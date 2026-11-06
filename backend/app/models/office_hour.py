from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class OfficeHour(Base):
    __tablename__ = "office_hours"
    
    id = Column(Integer, primary_key=True, index=True)
    professor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    location = Column(String, nullable=False)
    max_students = Column(Integer, default=1)
    is_booked = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    
    # Relationships
    professor = relationship("User", back_populates="office_hours")
    # Deleting a slot deletes its bookings (booking.office_hour_id is NOT NULL)
    bookings = relationship("Booking", back_populates="office_hour", cascade="all, delete-orphan")
    
    @property
    def duration_minutes(self):
        return int((self.end_time - self.start_time).total_seconds() / 60)
    
    @property
    def current_bookings(self):
        from app.models.booking import BookingStatus
        return sum(1 for b in self.bookings if b.status != BookingStatus.CANCELLED)