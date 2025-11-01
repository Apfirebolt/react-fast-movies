from typing import List
from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from backend.auth.jwt import get_current_user
from backend.auth.models import User

from backend import db

from . import schema
from . import services


router = APIRouter(tags=["Movie"], prefix="/api/movies")

playlist_router = APIRouter(tags=["Playlist"], prefix="/api/playlists")


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schema.MovieBase)
async def create_new_movie(
    request: schema.MovieBase,
    database: Session = Depends(db.get_db),
    current_user: User = Depends(get_current_user),
):
    user = database.query(User).filter(User.email == current_user.email).first()
    result = await services.create_new_movie(request, database, user)
    return result


@router.get("/", status_code=status.HTTP_200_OK, response_model=List[schema.MovieList])
async def movie_list(
    database: Session = Depends(db.get_db),
    current_user: User = Depends(get_current_user),
):
    result = await services.get_movie_listing(database, current_user.id)
    return result


@router.get(
    "/{movie_id}", status_code=status.HTTP_200_OK, response_model=schema.MovieBase
)
async def get_movie_by_id(
    movie_id: int,
    database: Session = Depends(db.get_db),
    current_user: User = Depends(get_current_user),
):
    return await services.get_movie_by_id(movie_id, current_user.id, database)


@router.delete(
    "/{movie_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response
)
async def delete_movie_by_id(
    movie_id: str,
    database: Session = Depends(db.get_db),
    current_user: User = Depends(get_current_user),
):
    return await services.delete_movie_by_id(movie_id, current_user, database)


# Playlist Routes
@playlist_router.post(
    "/", status_code=status.HTTP_201_CREATED, response_model=schema.PlaylistBase
)
async def create_new_playlist(
    request: schema.PlaylistBase,
    database: Session = Depends(db.get_db),
    current_user: User = Depends(get_current_user),
):
    user = database.query(User).filter(User.email == current_user.email).first()
    result = await services.create_new_playlist(request, database, user)
    return result


@playlist_router.get(
    "/", status_code=status.HTTP_200_OK, response_model=List[schema.PlayList]
)
async def playlist_list(
    database: Session = Depends(db.get_db),
    current_user: User = Depends(get_current_user),
):
    result = await services.get_playlist_listing(database, current_user.id)
    return result


@playlist_router.get(
    "/{playlist_id}", status_code=status.HTTP_200_OK, response_model=schema.PlayList
)
async def get_playlist_by_id(
    playlist_id: int,
    database: Session = Depends(db.get_db),
    current_user: User = Depends(get_current_user),
):
    return await services.get_playlist_by_id(playlist_id, current_user.id, database)


@playlist_router.put(
    "/{playlist_id}", status_code=status.HTTP_200_OK, response_model=schema.PlayList
)
async def update_playlist(
    playlist_id: int,
    request: schema.PlaylistBase,
    database: Session = Depends(db.get_db),
    current_user: User = Depends(get_current_user),
):
    return await services.update_playlist(playlist_id, request, current_user, database)


@playlist_router.delete(
    "/{playlist_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response
)
async def delete_playlist_by_id(
    playlist_id: str,
    database: Session = Depends(db.get_db),
    current_user: User = Depends(get_current_user),
):
    return await services.delete_playlist_by_id(playlist_id, current_user, database)


@playlist_router.post(
    "/add/{movie_id}",
    status_code=status.HTTP_200_OK,
    response_model=schema.MoviePlaylistBase,
)
async def add_movie_to_playlist(
    request: schema.MoviePlaylistPayload,
    database: Session = Depends(db.get_db),
    current_user: User = Depends(get_current_user),
):
    return await services.add_movie_to_playlist(
        request, current_user, database
    )


@playlist_router.delete(
    "/{playlist_id}/movies/{movie_id}",
    status_code=status.HTTP_200_OK,
    response_model=schema.MoviePlaylistBase,
)
async def remove_movie_from_playlist(
    playlist_id: int,
    movie_id: int,
    database: Session = Depends(db.get_db),
    current_user: User = Depends(get_current_user),
):
    return await services.remove_movie_from_playlist(
        playlist_id, movie_id, current_user, database
    )
