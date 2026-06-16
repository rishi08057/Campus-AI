from database import SessionLocal
from models import Event
from datetime import datetime

db = SessionLocal()

events = [
    Event(
        title="AI Workshop",
        description="Learn AI basics",
        venue="Seminar Hall",
        category="Technology",
        datetime=datetime(2026, 7, 1, 10, 0)
    ),
    Event(
        title="Hackathon",
        description="24 hour coding challenge",
        venue="Lab 2",
        category="Coding",
        datetime=datetime(2026, 7, 5, 9, 0)
    )
]

for event in events:
    db.add(event)

db.commit()
db.close()