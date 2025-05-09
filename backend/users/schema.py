from datetime import datetime
from typing import Optional, List
from backend.movies.schema import MovieBase
from pydantic import BaseModel, EmailStr, Field


class UserList(BaseModel):
    username: str
    email: EmailStr

    class Config:
        orm_mode = True


class UserDetail(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    movies: List[MovieBase]

    class Config:
        orm_mode = True


class UserPayload(BaseModel):
    username: str = Field(error_messages={"any_str.min_length": "Username must be at least 3 characters.",
                                           "value_error.missing": "The 'username' field is required."})
    email: EmailStr = Field(error_messages={"value_error.email": "Invalid email format.",
                                             "value_error.missing": "The 'email' field is required."})
    role: Optional[str] = Field("user", error_messages={"any_str.min_length": "Role must be at least 1 character."})

