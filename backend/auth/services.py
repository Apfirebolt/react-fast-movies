from fastapi import HTTPException, status
from typing import List, Optional
from datetime import datetime

from . import schema
from . import models
from ..kafkaConnection import send_kafka_message


async def new_user_register(request: schema.BaseModel, database) -> models.User:
    try:
        new_user = models.User(username=request.username, email=request.email,
                               password=request.password,
                               role='user')                     
        database.add(new_user)
        database.commit()
        database.refresh(new_user)
        
        # Publish user registration event to Kafka
        kafka_message = {
            "event": "user_registered",
            "user_id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "role": new_user.role,
            "registered_at": datetime.now().isoformat(),
            "timestamp": datetime.now().isoformat(),
        }
        await send_kafka_message("user-events", kafka_message, str(new_user.id))
        
        return new_user
    except Exception as e:
        database.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while registering the user: {str(e)}"
        )


async def all_users(database) -> List[models.User]:
    try:
        users = database.query(models.User).all()
        return users
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching all users: {str(e)}"
        )


async def get_user_by_id(user_id, database) -> Optional[models.User]:
    try:
        user_info = database.query(models.User).get(user_id)

        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Data not found!"
            )

        return user_info
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the user by ID: {str(e)}"
        )


async def get_profile(database, current_user) -> models.User:
    try:
        user = database.query(models.User).filter(models.User.email == current_user.email).first()
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the user profile: {str(e)}"
        )
