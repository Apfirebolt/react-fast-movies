from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend import db

from . import schema
from . import services


router = APIRouter(tags=["User"], prefix="/api/users")


@router.get("/", status_code=status.HTTP_200_OK, response_model=List[schema.UserDetail])
async def user_list(
    database: Session = Depends(db.get_db),
):
    result = await services.get_user_listing(database)
    return result


@router.get(
    "/{user_id}", status_code=status.HTTP_200_OK, response_model=schema.UserDetail
)
async def get_user_by_id(
    user_id: int,
    database: Session = Depends(db.get_db)
):
    return await services.get_user_by_id(user_id, database)
