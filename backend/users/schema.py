from datetime import datetime
from typing import Optional
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

    class Config:
        orm_mode = True
