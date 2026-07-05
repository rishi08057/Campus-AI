from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env
try:
    from dotenv import load_dotenv
    load_dotenv()
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

from .database import (
    engine,
    Base,
    SessionLocal,
)

from .models import Event
from . import models

from .services.rag_service import vector_service

# --------------------------------------------------
# Create Database Tables
# --------------------------------------------------

Base.metadata.create_all(bind=engine)

# --------------------------------------------------
# Load Events + Index into ChromaDB
# --------------------------------------------------

try:
    db = SessionLocal()

    events = db.query(Event).all()

    if not events:
        from .data.mock_events import MOCK_EVENTS

        print("Database empty. Loading mock events...")

        for event in MOCK_EVENTS:
            db.add(
                Event(
                    id=event.id,
                    title=event.title,
                    description=event.description,
                    venue=event.venue,
                    category=event.category,
                    datetime=event.datetime,
                )
            )

        db.commit()

        events = db.query(Event).all()

    print(f"Found {len(events)} events")

    vector_service.upsert_events(events)

    print(f"Indexed {len(events)} events into ChromaDB")

except Exception as e:
    print(f"Warning: Could not index events: {e}")

finally:
    try:
        db.close()
    except Exception:
        pass


# --------------------------------------------------
# FastAPI Application Factory
# --------------------------------------------------

def create_app() -> FastAPI:

    app = FastAPI(
        title="CampusAI Backend",
        version="0.1.0",
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