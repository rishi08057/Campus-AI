from sqlalchemy.orm import Session
from ..models import Registration

class RegistrationRepository:
    @staticmethod
    def get_registration_by_user_and_event(db: Session, user_id: int, event_id: int) -> Registration | None:
        return db.query(Registration).filter(
            Registration.user_id == user_id,
            Registration.event_id == event_id
        ).first()

    @staticmethod
    def create_registration(db: Session, registration: Registration) -> Registration:
        db.add(registration)
        db.commit()
        db.refresh(registration)
        return registration

registration_repository = RegistrationRepository()