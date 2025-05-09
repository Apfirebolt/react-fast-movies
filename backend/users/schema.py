from datetime import datetime
from typing import Optional, List
from backend.movies.schema import MovieBase
from pydantic import BaseModel, EmailStr


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
    username: str
    email: EmailStr
    role: Optional[str] = "user"
