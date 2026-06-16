from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
import qrcode
import io

from ..database import get_db
from ..models import Ticket, Registration, User
from ..schemas.ticket import TicketResponse
from ..dependencies import get_current_user

router = APIRouter(prefix="/tickets", tags=["tickets"])

@router.get("", response_model=List[TicketResponse])
def get_user_tickets(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Returns all tickets owned by the logged-in user.
    Uses SQLAlchemy joins through Registration for ownership validation.
    """
    tickets = db.query(Ticket).join(
        Registration, Ticket.registration_id == Registration.id
    ).filter(
        Registration.user_id == current_user.id
    ).all()
    
    return tickets

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket_by_id(
    ticket_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns a specific ticket owned by the authenticated user.
    Returns 404 if not found or if the user does not own it.
    """
    ticket = db.query(Ticket).join(
        Registration, Ticket.registration_id == Registration.id
    ).filter(
        Ticket.ticket_id == ticket_id,
        Registration.user_id == current_user.id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    return ticket

@router.get("/{ticket_id}/qr")
def get_ticket_qr(
    ticket_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generates and returns a PNG QR code image for a ticket owned by the user.
    """
    # Validate ownership before generating QR
    ticket = db.query(Ticket).join(
        Registration, Ticket.registration_id == Registration.id
    ).filter(
        Ticket.ticket_id == ticket_id,
        Registration.user_id == current_user.id
    ).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    qr_data = f"ticket:{ticket_id}"
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    
    return StreamingResponse(buf, media_type="image/png")
