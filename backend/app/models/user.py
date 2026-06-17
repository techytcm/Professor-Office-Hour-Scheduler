from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    PROFESSOR = "professor"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    
    # Professor-specific
    department = Column(String, nullable=True)
    
    # Relationships
    bookings = relationship("Booking", back_populates="student", foreign_keys="Booking.student_id")
    office_hours = relationship("OfficeHour", back_populates="professor")
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"