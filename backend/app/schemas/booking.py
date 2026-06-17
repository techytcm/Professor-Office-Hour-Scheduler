from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BookingBase(BaseModel):
    notes: Optional[str] = None

class BookingCreate(BookingBase):
    slot_id: int

class BookingResponse(BookingBase):
    id: int
    status: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    professor_name: Optional[str] = None
    professor_id: Optional[int] = None
    student_name: Optional[str] = None
    student_id: Optional[int] = None
    duration_minutes: Optional[int] = None
    location: Optional[str] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True  # ← Pydantic v2 syntax