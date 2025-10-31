from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, HttpUrl

class PlaylistBase(BaseModel):
    name: str


class PlayList(PlaylistBase):
    id: int
    createdDate: datetime
    owner_id: int

    class Config:
        from_attributes = True


class MoviePlaylistBase(BaseModel):
    movie_id: int
    playlist_id: int


class MovieBase(BaseModel):
    year: str
    title: str
    imdbID: str
    type: str
    poster: Optional[HttpUrl] = None


class MovieCreate(MovieBase):
    pass


class Movie(MovieBase):
    id: int
    createdDate: datetime
    owner_id: int

    owner: "UserSchema"  # Forward reference to UserSchema


class MovieList(MovieBase):
    id: int
    createdDate: datetime
    owner_id: int
    owner: "UserSchema"  # Forward reference to UserSchema


class UserSchema(BaseModel):
    username: str
    email: EmailStr

    class Config:
        from_attributes = True
