from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder
from core.models.user import UserModel
from core.database import db

router = APIRouter(prefix="/user")


@router.get("/", tags=["user"])
async def get_user():
    return {"message": "get_user"}


@router.post("/", description="Adds a new user", tags=["user"])
async def create_user(user: UserModel = Body(...)):
    user = jsonable_encoder(user)
    new_user = await db[UserModel._doc_name].insert_one(user)
    return {"user": new_user}
