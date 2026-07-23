import os
import json
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

from .logging_config import setup_logging, get_logger
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

from .database import SessionLocal, engine
from .models import Event
from .limiter import limiter

from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

# --------------------------------------------------
# Initialise logging (once, before anything else logs)
# --------------------------------------------------

logger = setup_logging()

# --------------------------------------------------
# Lifespan
# --------------------------------------------------

def _print_banner(status: dict[str, str], port: str) -> None:
    """Print a concise startup summary."""
    import sys

    lines = [
        "",
        "--------------------------------------------------",
        "CampusAI Backend Started",
        "",
    ]
    for label, value in status.items():
        lines.append(f"  {label:<16}{value}")
    lines.append("")
    lines.append(f"  Listening on   http://127.0.0.1:{port}")
    lines.append("--------------------------------------------------")
    lines.append("")
    text = "\n".join(lines) + "\n"
    # Write via buffer to avoid Windows cp1252 encoding errors with emoji/unicode
    try:
        sys.stdout.buffer.write(text.encode("utf-8"))
        sys.stdout.buffer.flush()
    except Exception:
        # Ultimate fallback: strip non-ascii
        sys.stdout.write(text.encode("ascii", errors="replace").decode("ascii"))
        sys.stdout.flush()


@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.getenv("TESTING") == "1":
        yield
        return

    status: dict[str, str] = {}
    db = SessionLocal()

    try:
        # ---------- Database ----------
        engine.connect().close()
        status["Database"] = "OK  Connected"
    except Exception as exc:
        status["Database"] = f"FAIL {exc}"
        logger.exception("Database connection failed")

    try:
        from .agents.config import (
            event_vector_service,
            support_vector_service,
            placement_vector_service,
            health_vector_service,
        )

        # ---------- Events ----------
        events = db.query(Event).all()
        status["Events"] = f"OK  {len(events)} loaded"

        if event_vector_service.collection.count() == 0:
            event_vector_service.upsert_events(events)
            status["Chroma"] = "OK  Indexed"
        else:
            status["Chroma"] = "OK  Indexed"

        # ---------- JSON Knowledge Bases ----------

        def _index_json(directory: str, files: list[str], v_service, label: str):
            dir_path = os.path.join(os.path.dirname(__file__), "data", directory)
            all_docs: list = []

            if not os.path.exists(dir_path):
                status[label] = "WARN Dir missing"
                return

            for filename in files:
                filepath = os.path.join(dir_path, filename)
                if os.path.exists(filepath):
                    with open(filepath, "r", encoding="utf-8") as f:
                        all_docs.extend(json.load(f))

            if not all_docs:
                status[label] = "WARN No docs"
                return

            if v_service.collection.count() == 0:
                v_service.index_documents(all_docs)

            status[label] = "OK  Ready"

        _index_json(
            "support",
            ["attendance.json", "exams.json", "faculty.json", "rooms.json"],
            support_vector_service,
            "Support DB",
        )

        _index_json(
            "placement",
            [
                "companies.json", "interviews.json", "resume.json",
                "coding.json", "aptitude.json", "career.json",
            ],
            placement_vector_service,
            "Placement DB",
        )

        _index_json(
            "health",
            [
                "wellness.json", "nutrition.json", "exercise.json",
                "mental_health.json", "sleep.json", "campus_health.json",
                "emergency.json",
            ],
            health_vector_service,
            "Health DB",
        )

        # ---------- Gemini ----------
        status["Gemini"] = "OK  Ready"

    except Exception as e:
        logger.exception("Startup indexing failed: %s", e)

    finally:
        db.close()

    port = os.getenv("PORT", "8000")
    _print_banner(status, port)

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