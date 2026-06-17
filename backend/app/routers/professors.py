from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User, UserRole
from app.models.office_hour import OfficeHour
from app.schemas.office_hour import OfficeHourCreate, OfficeHourResponse, ProfessorListResponse
from app.dependencies import get_current_user, require_professor

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

@router.get("/{professor_id}/slots", response_model=List[OfficeHourResponse])
def get_professor_slots(
    professor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    slots = db.query(OfficeHour).filter(
        OfficeHour.professor_id == professor_id,
        OfficeHour.is_booked == False
    ).all()
    return slots

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
    
    # Cancel associated bookings
    for booking in slot.bookings:
        booking.status = "cancelled"
    
    db.delete(slot)
    db.commit()
    return {"message": "Slot deleted successfully"}

@router.get("/me/bookings", response_model=List[dict])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_professor)
):
    from app.models.booking import Booking
    bookings = db.query(Booking).join(OfficeHour).filter(
        OfficeHour.professor_id == current_user.id
    ).order_by(OfficeHour.start_time).all()
    
    return [
        {
            "id": b.id,
            "status": b.status.value,
            "start_time": b.start_time,
            "student_name": b.student.full_name if b.student else None,
            "student_id": b.student_id,
            "professor_name": current_user.full_name,
            "duration_minutes": b.duration_minutes,
            "location": b.location,
            "notes": b.notes
        }
        for b in bookings
    ]