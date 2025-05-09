from fastapi import HTTPException, status
from typing import List
from . schema import UserList, UserDetail
from backend.auth.models import User
from datetime import datetime


async def get_user_listing(database) -> List[UserDetail]:
    try:
        users = (
            database.query(User)
            .all()
        )
        return users
    except Exception as e:
        if isinstance(e, HTTPException) and e.status_code == status.HTTP_400_BAD_REQUEST:
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching users: {str(e)}",
        )


async def get_user_by_id(user_id, database):
    try:
        user = (
            database.query(User)
            .filter_by(id=user_id)
            .first()
        )
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found!"
            )
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the user: {str(e)}",
        )