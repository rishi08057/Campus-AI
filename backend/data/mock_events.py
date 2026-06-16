from datetime import datetime, timezone

from ..schemas.event import Event


MOCK_EVENTS: list[Event] = [
    Event(
        id=1,
        title="AI Workshop",
        description="A hands-on workshop exploring practical AI tools for students.",
        venue="Innovation Lab",
        category="Workshop",
        datetime=datetime(
            2026,
            6,
            5,
            14,
            0,
            tzinfo=timezone.utc,
        ),
    ),
    Event(
        id=2,
        title="Hackathon",
        description="A student hackathon focused on building useful campus apps.",
        venue="Main Auditorium",
        category="Competition",
        datetime=datetime(
            2026,
            6,
            12,
            9,
            30,
            tzinfo=timezone.utc,
        ),
    ),
]