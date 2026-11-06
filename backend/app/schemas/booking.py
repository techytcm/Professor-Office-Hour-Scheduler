from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator

from app.schemas.office_hour import UTCDatetime


class BookingBase(BaseModel):
    notes: Optional[str] = None


class BookingCreate(BookingBase):
    slot_id: int


class BookingResponse(BookingBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    start_time: Optional[UTCDatetime] = None
    end_time: Optional[UTCDatetime] = None
    professor_name: Optional[str] = None
    professor_id: Optional[int] = None
    student_name: Optional[str] = None
    student_id: Optional[int] = None
    duration_minutes: Optional[int] = None
    location: Optional[str] = None
    created_at: Optional[UTCDatetime] = None

    @field_validator("status", mode="before")
    @classmethod
    def enum_to_value(cls, v):
        return getattr(v, "value", v)
