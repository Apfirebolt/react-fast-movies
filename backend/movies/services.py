from fastapi import HTTPException, status
from typing import List
from . import models
from datetime import datetime


async def create_new_movie(request, database, current_user) -> models.Movie:
    try:
        new_movie = models.Movie(
            title=request.title,
            description=request.description,
            status=request.status,
            owner_id=current_user.id,
            createdDate=datetime.now(),
            dueDate=request.dueDate
        )
        database.add(new_movie)
        database.commit()
        database.refresh(new_movie)
        return new_movie
    except Exception as e:
        database.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the movie: {str(e)}"
        )


async def get_movie_listing(database, current_user) -> List[models.Movie]:
    try:
        movies = database.query(models.Movie).filter(models.Movie.owner_id == current_user).all()
        return movies
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching movies: {str(e)}"
        )


async def get_movie_by_id(movie_id, current_user, database):
    try:
        movie = database.query(models.Movie).filter_by(id=movie_id, owner_id=current_user).first()
        if not movie:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Movie Not Found!"
            )
        return movie
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the movie: {str(e)}"
        )


async def delete_movie_by_id(movie_id, database):
    try:
        database.query(models.Movie).filter(models.Movie.id == movie_id).delete()
        database.commit()
    except Exception as e:
        database.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the movie: {str(e)}"
        )
