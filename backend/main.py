import os
import json
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# --------------------------------------------------
# Load Environment Variables
# --------------------------------------------------

try:
    from dotenv import load_dotenv

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    load_dotenv(os.path.join(BASE_DIR, ".env"))
except Exception:
    pass

from .config import get_cors_origins
from .api.routes.chat import router as chat_router
from .api.routes.events import router as events_router
from .api.routes.health import router as health_router
from .api.routes.root import router as root_router
from .api.routes.profile import router as profile_router
from .api.routes.recommendations import router as recommendations_router
from .api.routes.auth import router as auth_router
from .api.routes.tickets import router as tickets_router
from .api.routes.admin import router as admin_router

from .database import SessionLocal
from .models import Event
from .limiter import limiter

from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

# --------------------------------------------------
# Logging
# --------------------------------------------------

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger("backend.main")

# Hide noisy HTTP request logs from Gemini
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

# --------------------------------------------------
# Lifespan
# --------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.getenv("TESTING") == "1":
        yield
        return

    db = SessionLocal()

    try:
        from .agents.config import (
            event_vector_service,
            support_vector_service,
            placement_vector_service,
            health_vector_service,
        )

        # ---------------- Events ----------------

        events = db.query(Event).all()
        logger.info(f"Found {len(events)} events")

        if event_vector_service.collection.count() == 0:
            event_vector_service.upsert_events(events)
            logger.info(f"Indexed {len(events)} events into ChromaDB")
        else:
            logger.info("Events already indexed. Skipping.")

        # ---------------- Generic JSON Indexer ----------------

        def index_json_docs(
            directory: str,
            files: list[str],
            v_service,
            doc_type: str,
        ):
            dir_path = os.path.join(
                os.path.dirname(__file__),
                "data",
                directory,
            )

            all_docs = []

            if not os.path.exists(dir_path):
                logger.warning(f"{doc_type} directory not found: {dir_path}")
                return

            for filename in files:
                filepath = os.path.join(dir_path, filename)

                if os.path.exists(filepath):
                    with open(filepath, "r", encoding="utf-8") as f:
                        all_docs.extend(json.load(f))

            if not all_docs:
                logger.warning(f"No {doc_type} documents found.")
                return

            if v_service.collection.count() == 0:
                v_service.index_documents(all_docs)
                logger.info(
                    f"Indexed {len(all_docs)} {doc_type} documents into ChromaDB"
                )
            else:
                logger.info(
                    f"{doc_type.capitalize()} collection already indexed. Skipping."
                )

        # ---------------- Support ----------------

        index_json_docs(
            "support",
            [
                "attendance.json",
                "exams.json",
                "faculty.json",
                "rooms.json",
            ],
            support_vector_service,
            "support",
        )

        # ---------------- Placement ----------------

        index_json_docs(
            "placement",
            [
                "companies.json",
                "interviews.json",
                "resume.json",
                "coding.json",
                "aptitude.json",
                "career.json",
            ],
            placement_vector_service,
            "placement",
        )

        # ---------------- Health ----------------

        index_json_docs(
            "health",
            [
                "wellness.json",
                "nutrition.json",
                "exercise.json",
                "mental_health.json",
                "sleep.json",
                "campus_health.json",
                "emergency.json",
            ],
            health_vector_service,
            "health",
        )

    except Exception as e:
        logger.exception(f"Startup indexing failed: {e}")

    finally:
        db.close()

    yield

# --------------------------------------------------
# App Factory
# --------------------------------------------------

def create_app() -> FastAPI:

    def check_env():
        required = ["SECRET_KEY", "GEMINI_API_KEY", "DATABASE_URL"]
        missing = [v for v in required if not os.getenv(v)]

        if missing:
            raise RuntimeError(
                f"Missing required environment variables: {', '.join(missing)}"
            )

    check_env()

    app = FastAPI(
        title="Campus-AI API",
        description="Backend API for Campus-AI platform",
        version="0.1.0",
        lifespan=lifespan,
    )

    app.state.limiter = limiter
    app.add_exception_handler(
        RateLimitExceeded,
        _rate_limit_exceeded_handler,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_cors_origins(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(root_router)
    app.include_router(health_router)
    app.include_router(events_router)
    app.include_router(chat_router)
    app.include_router(profile_router)
    app.include_router(recommendations_router)
    app.include_router(auth_router)
    app.include_router(tickets_router)
    app.include_router(admin_router)

    return app


app = create_app()