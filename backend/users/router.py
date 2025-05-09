from typing import List
from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
import json

from backend import db

from . import schema
from . import services


router = APIRouter(tags=["User"], prefix="/api/users")


@router.get("/", status_code=status.HTTP_200_OK)
async def user_list(
    database: Session = Depends(db.get_db),
):
    result = await services.get_user_listing(database)
    if not result:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    return Response(
        content=json.dumps({
            "data": [user.to_dict() for user in result],
            "message": "User list retrieved successfully",
            "status": "success",
        }),
        media_type="application/json",
        status_code=status.HTTP_200_OK,
    )

@router.get(
    "/{user_id}", status_code=status.HTTP_200_OK, response_model=schema.UserDetail
)
async def get_user_by_id(
    user_id: int,
    database: Session = Depends(db.get_db)
):
    return await services.get_user_by_id(user_id, database)


@router.post("/data", status_code=status.HTTP_201_CREATED)
async def create_user(
    user: schema.UserPayload,
):
    """
    Retrieves an item by its ID.

    This endpoint allows you to fetch details about a specific item.
    You can optionally provide a query parameter 'q' to filter results
    (though it doesn't actually do anything in this example).
    """
    return Response(
        content=json.dumps({
            "data": user.dict(),
            "message": "User created successfully",
            "status": "success",
        }),
        media_type="application/json",
        status_code=status.HTTP_201_CREATED,
    )