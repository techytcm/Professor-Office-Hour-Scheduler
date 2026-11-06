from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional, Literal

class UserBase(BaseModel):
    email: EmailStr
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    role: Literal["student", "professor"]
    department: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: str
    name: str
    department: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None