from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.booking import Booking
from app.models.user import User, UserRole
from app.models.office_hour import OfficeHour
from app.schemas.booking import BookingResponse
from app.schemas.office_hour import OfficeHourCreate, OfficeHourResponse, ProfessorListResponse
from app.dependencies import get_current_user, require_professor
from app.utils.datetime_utils import utcnow

router = APIRouter(prefix="/professors", tags=["professors"])

@router.get("", response_model=List[ProfessorListResponse])
def get_all_professors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    professors = db.query(User).filter(User.role == UserRole.PROFESSOR).all()
    return [
        {
            "id": p.id,
            "name": p.full_name,
            "email": p.email,
            "department": p.department
        }
        for p in professors
    ]

# NOTE: the /me/... routes must be declared before /{professor_id}/slots,
# otherwise "me" is matched as a professor_id and the request fails with 422.

@router.get("/me/slots", response_model=List[OfficeHourResponse])
def get_my_slots(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_professor)
):
    slots = db.query(OfficeHour).filter(
        OfficeHour.professor_id == current_user.id
    ).order_by(OfficeHour.start_time).all()
    return slots

@router.post("/me/slots", response_model=OfficeHourResponse)
def create_slot(
    slot_data: OfficeHourCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_professor)
):
    if slot_data.start_time <= utcnow():
        raise HTTPException(status_code=400, detail="Office hours must start in the future")

    # Check for time conflicts
    conflicting = db.query(OfficeHour).filter(
        OfficeHour.professor_id == current_user.id,
        OfficeHour.start_time < slot_data.end_time,
        OfficeHour.end_time > slot_data.start_time
    ).first()
    
    if conflicting:
        raise HTTPException(status_code=400, detail="Time slot conflicts with existing office hour")
    
    new_slot = OfficeHour(
        professor_id=current_user.id,
        start_time=slot_data.start_time,
        end_time=slot_data.end_time,
        location=slot_data.location,
        max_students=slot_data.max_students,
        notes=slot_data.notes
    )
    
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return new_slot

@router.delete("/me/slots/{slot_id}")
def delete_slot(
    slot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_professor)
):
    slot = db.query(OfficeHour).filter(
        OfficeHour.id == slot_id,
        OfficeHour.professor_id == current_user.id
    ).first()
    
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    
    # Associated bookings are removed via the relationship cascade
    db.delete(slot)
    db.commit()
    return {"message": "Slot deleted successfully"}

@router.get("/me/bookings", response_model=List[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_professor)
):
    bookings = db.query(Booking).join(OfficeHour).filter(
        OfficeHour.professor_id == current_user.id
    ).order_by(OfficeHour.start_time).all()
    return bookings

@router.get("/{professor_id}/slots", response_model=List[OfficeHourResponse])
def get_professor_slots(
    professor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only upcoming slots that still have room
    slots = db.query(OfficeHour).filter(
        OfficeHour.professor_id == professor_id,
        OfficeHour.is_booked == False,
        OfficeHour.start_time > utcnow()
    ).order_by(OfficeHour.start_time).all()
    return slots
