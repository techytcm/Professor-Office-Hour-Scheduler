from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class OfficeHourBase(BaseModel):
    start_time: datetime
    end_time: datetime
    location: str
    max_students: int = 1
    notes: Optional[str] = None

class OfficeHourCreate(OfficeHourBase):
    pass

class OfficeHourResponse(OfficeHourBase):
    id: int
    professor_id: int
    is_booked: bool
    duration_minutes: int
    current_bookings: int
    
    class Config:
        from_attributes = True  # ← Pydantic v2 syntax

class ProfessorListResponse(BaseModel):
    id: int
    name: str
    email: str
    department: Optional[str] = None
    
    class Config:
        from_attributes = True  # ← Pydantic v2 syntax