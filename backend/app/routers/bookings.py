from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.office_hour import OfficeHour
from app.models.user import User, UserRole
from app.schemas.booking import BookingCreate, BookingResponse
from app.dependencies import get_current_user, require_student
from app.utils.datetime_utils import utcnow

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
    # Lock the slot row so two students can't grab the last seat at once (Postgres)
    slot = db.query(OfficeHour).filter(
        OfficeHour.id == booking_data.slot_id
    ).with_for_update().first()
    if not slot:
        raise HTTPException(status_code=404, detail="Time slot not found")

    if slot.start_time <= utcnow():
        raise HTTPException(status_code=400, detail="This slot has already started")

    if slot.current_bookings >= slot.max_students:
        raise HTTPException(status_code=400, detail="This slot is fully booked")
    
    # Check if student already booked this slot
    existing = db.query(Booking).filter(
        Booking.student_id == current_user.id,
        Booking.office_hour_id == slot.id,
        Booking.status != BookingStatus.CANCELLED
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already booked this slot")
    
    new_booking = Booking(
        student_id=current_user.id,
        office_hour_id=slot.id,
        status=BookingStatus.CONFIRMED,
        notes=booking_data.notes,
        created_at=utcnow()
    )
    slot.bookings.append(new_booking)
    slot.is_booked = slot.current_bookings >= slot.max_students

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
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
    
    # Students may cancel their own bookings; professors only bookings for their own slots
    is_owner = booking.student_id == current_user.id
    is_slot_professor = (
        current_user.role == UserRole.PROFESSOR
        and booking.office_hour is not None
        and booking.office_hour.professor_id == current_user.id
    )
    if not (is_owner or is_slot_professor):
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")

    if booking.status == BookingStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Booking is already cancelled")
    
    booking.status = BookingStatus.CANCELLED
    
    # Free up the slot
    slot = booking.office_hour
    if slot:
        slot.is_booked = slot.current_bookings >= slot.max_students
    
    db.commit()
    return {"message": "Booking cancelled successfully"}
