from datetime import datetime
from typing import Annotated, Optional

from pydantic import AfterValidator, BaseModel, ConfigDict, Field, model_validator

from app.utils.datetime_utils import mark_utc, to_naive_utc

# Stored as naive UTC; returned to clients with an explicit UTC offset
UTCDatetime = Annotated[datetime, AfterValidator(mark_utc)]


class OfficeHourBase(BaseModel):
    start_time: datetime
    end_time: datetime
    location: str = Field(..., min_length=1)
    max_students: int = Field(1, ge=1, le=50)
    notes: Optional[str] = None


class OfficeHourCreate(OfficeHourBase):
    @model_validator(mode="after")
    def normalize_and_check_times(self):
        self.start_time = to_naive_utc(self.start_time)
        self.end_time = to_naive_utc(self.end_time)
        if self.end_time <= self.start_time:
            raise ValueError("end_time must be after start_time")
        return self


class OfficeHourResponse(OfficeHourBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    professor_id: int
    start_time: UTCDatetime
    end_time: UTCDatetime
    is_booked: bool
    duration_minutes: int
    current_bookings: int


class ProfessorListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    department: Optional[str] = None
