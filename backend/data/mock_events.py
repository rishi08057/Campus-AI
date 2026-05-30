from datetime import datetime


MOCK_EVENTS: list[dict[str, object]] = [
    {
        "id": 1,
        "title": "AI Workshop",
        "description": "A hands-on workshop exploring practical AI tools for students.",
        "venue": "Innovation Lab",
        "category": "Workshop",
        "datetime": datetime(2026, 6, 5, 14, 0),
    },
    {
        "id": 2,
        "title": "Hackathon",
        "description": "A student hackathon focused on building useful campus apps.",
        "venue": "Main Auditorium",
        "category": "Competition",
        "datetime": datetime(2026, 6, 12, 9, 30),
    },
]