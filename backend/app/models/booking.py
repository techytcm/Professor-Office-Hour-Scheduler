from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class BookingStatus(str, enum.Enum):
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    office_hour_id = Column(Integer, ForeignKey("office_hours.id"), nullable=False)
    status = Column(Enum(BookingStatus), default=BookingStatus.CONFIRMED)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False)
    
    # Relationships
    student = relationship("User", back_populates="bookings", foreign_keys=[student_id])
    office_hour = relationship("OfficeHour", back_populates="bookings")
    
    @property
    def start_time(self):
        return self.office_hour.start_time if self.office_hour else None
    
    @property
    def end_time(self):
        return self.office_hour.end_time if self.office_hour else None
    
    @property
    def professor_name(self):
        return self.office_hour.professor.full_name if self.office_hour and self.office_hour.professor else None
    
    @property
    def student_name(self):
        return self.student.full_name if self.student else None

    @property
    def professor_id(self):
        return self.office_hour.professor_id if self.office_hour else None
    
    @property
    def location(self):
        return self.office_hour.location if self.office_hour else None
    
    @property
    def duration_minutes(self):
        return self.office_hour.duration_minutes if self.office_hour else None