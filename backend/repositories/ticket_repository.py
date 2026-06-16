from sqlalchemy.orm import Session
from ..models import Ticket, Registration

class TicketRepository:
    @staticmethod
    def get_user_tickets(db: Session, user_id: int):
        return db.query(Ticket).join(
            Registration, Ticket.registration_id == Registration.id
        ).filter(
            Registration.user_id == user_id
        ).all()

    @staticmethod
    def get_user_ticket_by_id(db: Session, ticket_id: str, user_id: int):
        return db.query(Ticket).join(
            Registration, Ticket.registration_id == Registration.id
        ).filter(
            Ticket.ticket_id == ticket_id,
            Registration.user_id == user_id
        ).first()

ticket_repository = TicketRepository()