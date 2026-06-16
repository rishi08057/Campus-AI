from sqlalchemy.orm import Session
from ..models import Event, SavedEvent

class EventRepository:
    @staticmethod
    def get_saved_event_by_user_and_event(db: Session, user_id: int, event_id: int) -> SavedEvent | None:
        return db.query(SavedEvent).filter(
            SavedEvent.user_id == user_id,
            SavedEvent.event_id == event_id
        ).first()

    @staticmethod
    def toggle_saved_event(db: Session, saved_event: SavedEvent | None, user_id: int, event_id: int) -> bool:
        if saved_event:
            db.delete(saved_event)
            db.commit()
            return False
        
        new_save = SavedEvent(
            user_id=user_id,
            event_id=event_id
        )
        db.add(new_save)
        db.commit()
        return True

event_repository = EventRepository()