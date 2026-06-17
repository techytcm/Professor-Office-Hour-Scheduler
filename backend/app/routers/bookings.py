from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from app.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.office_hour import OfficeHour
from app.models.user import User, UserRole
from app.schemas.booking import BookingCreate, BookingResponse
from app.dependencies import get_current_user, require_student

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.get("/my", response_model=List[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student)
):
    bookings = db.query(Booking).filter(
        Booking.student_id == current_user.id
    ).order_by(Booking.created_at.desc()).all()
    return bookings

@router.post("", response_model=BookingResponse)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student)
):
    # Get the slot
    slot = db.query(OfficeHour).filter(OfficeHour.id == booking_data.slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Time slot not found")
    
    # Check if already booked
    if slot.is_booked and slot.current_bookings >= slot.max_students:
        raise HTTPException(status_code=400, detail="This slot is fully booked")
    
    # Check if student already booked this slot
    existing = db.query(Booking).filter(
        Booking.student_id == current_user.id,
        Booking.office_hour_id == slot.id,
        Booking.status != BookingStatus.CANCELLED
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already booked this slot")
    
    # Create booking
    new_booking = Booking(
        student_id=current_user.id,
        office_hour_id=slot.id,
        notes=booking_data.notes,
        created_at=datetime.utcnow()
    )
    
    # Update slot status if full
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    # Check if slot is now full
    if slot.current_bookings >= slot.max_students:
        slot.is_booked = True
        db.commit()
    
    return new_booking

@router.delete("/{booking_id}")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Check ownership
    if booking.student_id != current_user.id and current_user.role != UserRole.PROFESSOR:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")
    
    booking.status = BookingStatus.CANCELLED
    
    # Free up the slot
    slot = booking.office_hour
    if slot:
        slot.is_booked = False
    
    db.commit()
    return {"message": "Booking cancelled successfully"}