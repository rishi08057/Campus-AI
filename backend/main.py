from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_cors_origins
from .routes.chat import router as chat_router
from .routes.events import router as events_router
from .routes.health import router as health_router
from .routes.root import router as root_router


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

    return app


app = create_app()
