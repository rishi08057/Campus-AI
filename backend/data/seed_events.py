from sqlalchemy.orm import Session
from backend.models import Event
from backend.database import SessionLocal
from datetime import datetime


def seed_events():
    db: Session = SessionLocal()

    if db.query(Event).count() > 0:
        print("Events already seeded")
        return

    events = [
        Event(
            title="AI Workshop",
            description="Hands-on workshop on AI and ML",
            venue="Auditorium A",
            category="Workshop",
            datetime=datetime(2026, 7, 10, 14, 0),
        ),
        Event(
            title="Hackathon 2026",
            description="24-hour coding competition",
            venue="Innovation Lab",
            category="Competition",
            datetime=datetime(2026, 7, 20, 9, 0),
        ),
        Event(
            title="Career Fair",
            description="Meet recruiters from top companies",
            venue="Main Hall",
            category="Placement",
            datetime=datetime(2026, 8, 5, 10, 0),
        ),
    ]

    db.add_all(events)
    db.commit()

    print("Events seeded successfully")


if __name__ == "__main__":
    seed_events()