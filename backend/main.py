from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from a local .env file when present. This is
# optional and only used for local development convenience. Production
# deployments should provide real environment variables via the platform.
try:
    from dotenv import load_dotenv
    load_dotenv()  # loads .env from project root if present
except Exception:
    # If python-dotenv isn't installed, skip loading .env — requirements.txt
    # includes python-dotenv so this should be available in dev environments.
    pass

from .config import get_cors_origins
from .routes.chat import router as chat_router
from .routes.events import router as events_router
from .routes.health import router as health_router
from .routes.root import router as root_router
from .routes.profile import router as profile_router
from .routes.recommendations import router as recommendations_router
from .routes.auth import router as auth_router
from .database import engine, Base
from . import models
from .services.vector_service import vector_service
from .data.mock_events import MOCK_EVENTS

# Create database tables
Base.metadata.create_all(bind=engine)

# Index events for RAG
try:
    vector_service.upsert_events(MOCK_EVENTS)
except Exception as e:
    print(f"Warning: Could not index events: {e}")


def create_app() -> FastAPI:
    app = FastAPI(title="CampusAI Backend", version="0.1.0")

    # Keep CORS explicit and environment-driven so local dev and deployment can
    # use different origins without code changes.
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

    return app


app = create_app()
