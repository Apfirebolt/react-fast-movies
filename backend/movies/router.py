from typing import List
from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from backend.auth.jwt import get_current_user
from backend.auth.models import User

from backend import db

from .import schema
from .import services


router = APIRouter(
    tags=["Movie"],
    prefix='/api/movies'
)


@router.post('/', status_code=status.HTTP_201_CREATED,
             response_model=schema.MovieBase)
async def create_new_movie(request: schema.MovieBase, database: Session = Depends(db.get_db), 
    current_user: User = Depends(get_current_user)):
    user = database.query(User).filter(User.email == current_user.email).first()
    result = await services.create_new_movie(request, database, user)
    return result


@router.get('/', status_code=status.HTTP_200_OK,
            response_model=List[schema.MovieList])
async def movie_list(database: Session = Depends(db.get_db),
                                current_user: User = Depends(get_current_user)):
    result = await services.get_movie_listing(database, current_user.id)
    return result


@router.get('/{movie_id}', status_code=status.HTTP_200_OK, response_model=schema.MovieBase)
async def get_movie_by_id(movie_id: int, database: Session = Depends(db.get_db),
                                current_user: User = Depends(get_current_user)):                            
    return await services.get_movie_by_id(movie_id, current_user.id, database)


@router.delete('/{movie_id}', status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
async def delete_movie_by_id(movie_id: int,
                                database: Session = Depends(db.get_db),
                                current_user: User = Depends(get_current_user)):
    return await services.delete_movie_by_id(movie_id, database)
