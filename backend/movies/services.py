from fastapi import HTTPException, status
from typing import List
from . import models
from backend.auth.models import User
from datetime import datetime


from fastapi import HTTPException, status
from datetime import datetime
from sqlalchemy.orm import Session
from . import models
from pydantic import HttpUrl


async def create_new_movie(
    request, database: Session, current_user: User
) -> models.Movie:
    try:
        # Check if request.poster is an HttpUrl object and convert to string if so
        poster_str = (
            str(request.poster)
            if isinstance(request.poster, HttpUrl)
            else request.poster
        )

        # error if the same movie has been added by the same user
        existing_movie = (
            database.query(models.Movie)
            .filter(
                models.Movie.imdbID == request.imdbID,
                models.Movie.owner_id == current_user.id,
            )
            .first()
        )
        if existing_movie:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Movie already exists in your collection.",
            )

        new_movie = models.Movie(
            title=request.title,
            imdbID=request.imdbID,
            poster=poster_str,  # Use the converted string
            year=request.year,
            type=request.type,
            owner_id=current_user.id,
            createdDate=datetime.now(),
        )
        database.add(new_movie)
        database.commit()
        database.refresh(new_movie)
        return new_movie
    except Exception as e:
        database.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the movie: {str(e)}",
        )


async def get_movie_listing(database, current_user) -> List[models.Movie]:
    try:
        movies = (
            database.query(models.Movie)
            .filter(models.Movie.owner_id == current_user)
            .all()
        )
        return movies
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching movies: {str(e)}",
        )


async def get_movie_by_id(movie_id, current_user, database):
    try:
        movie = (
            database.query(models.Movie)
            .filter_by(id=movie_id, owner_id=current_user)
            .first()
        )
        if not movie:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Movie Not Found!"
            )
        return movie
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the movie: {str(e)}",
        )


async def delete_movie_by_id(movie_id, database):
    try:
        database.query(models.Movie).filter(models.Movie.imdbID == movie_id).delete()
        database.commit()
    except Exception as e:
        database.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the movie: {str(e)}",
        )
