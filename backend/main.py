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

# --------------------------------------------------
# Load Support Documents + Index into ChromaDB
# --------------------------------------------------
try:
    import json
    import os
    from .services.support_vector_service import support_vector_service

    support_dir = os.path.join(os.path.dirname(__file__), "data", "support")
    support_docs = []

    if os.path.exists(support_dir):
        for filename in ["attendance.json", "exams.json", "faculty.json", "rooms.json"]:
            filepath = os.path.join(support_dir, filename)
            if os.path.exists(filepath):
                with open(filepath, "r", encoding="utf-8") as f:
                    docs = json.load(f)
                    support_docs.extend(docs)
        
        if support_docs:
            print(f"Found {len(support_docs)} support documents")
            support_vector_service.index_documents(support_docs)
            print(f"Indexed {len(support_docs)} support documents into ChromaDB")
        else:
            print("Warning: No support documents found in support JSON files.")
    else:
        print(f"Warning: Support data directory {support_dir} does not exist.")

except Exception as e:
    print(f"Warning: Could not index support documents: {e}")

# --------------------------------------------------
# Load Placement Documents + Index into ChromaDB
# --------------------------------------------------
try:
    import json
    import os
    from .services.placement_vector_service import placement_vector_service

    placement_dir = os.path.join(os.path.dirname(__file__), "data", "placement")
    placement_docs = []

    if os.path.exists(placement_dir):
        for filename in ["companies.json", "interviews.json", "resume.json", "coding.json", "aptitude.json", "career.json"]:
            filepath = os.path.join(placement_dir, filename)
            if os.path.exists(filepath):
                with open(filepath, "r", encoding="utf-8") as f:
                    docs = json.load(f)
                    placement_docs.extend(docs)
        
        if placement_docs:
            print(f"Found {len(placement_docs)} placement documents")
            placement_vector_service.index_documents(placement_docs)
            print(f"Indexed {len(placement_docs)} placement documents into ChromaDB")
        else:
            print("Warning: No placement documents found in placement JSON files.")
    else:
        print(f"Warning: Placement data directory {placement_dir} does not exist.")

except Exception as e:
    print(f"Warning: Could not index placement documents: {e}")

# --------------------------------------------------
# Load Health Documents + Index into ChromaDB
# --------------------------------------------------
try:
    import json
    import os
    from .services.health_vector_service import health_vector_service

    health_dir = os.path.join(os.path.dirname(__file__), "data", "health")
    health_docs = []

    if os.path.exists(health_dir):
        for filename in ["wellness.json", "nutrition.json", "exercise.json", "mental_health.json", "sleep.json", "campus_health.json", "emergency.json"]:
            filepath = os.path.join(health_dir, filename)
            if os.path.exists(filepath):
                with open(filepath, "r", encoding="utf-8") as f:
                    docs = json.load(f)
                    health_docs.extend(docs)
        
        if health_docs:
            print(f"Found {len(health_docs)} health documents")
            health_vector_service.index_documents(health_docs)
            print(f"Indexed {len(health_docs)} health documents into ChromaDB")
        else:
            print("Warning: No health documents found in health JSON files.")
    else:
        print(f"Warning: Health data directory {health_dir} does not exist.")

except Exception as e:
    print(f"Warning: Could not index health documents: {e}")

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