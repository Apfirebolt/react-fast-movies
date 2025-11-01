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


class MoviePlaylistPayload(BaseModel):
    movieId: int
    playlistId: list[int]


class MoviePlaylistBase(BaseModel):
    id: int
    createdDate: datetime
    playlist_id: int
    movie_id: int

    class Config:
        from_attributes = True


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


class PlaylistDetail(BaseModel):
    playlist: PlayList
    movies: list[Movie]

    class Config:
        from_attributes = True
