import os
import motor.motor_asyncio
from bson import ObjectId
from pydantic import Field, BaseModel
from datetime import datetime

client = motor.motor_asyncio.AsyncIOMotorClient(
    os.environ["DB_CONNECTION_STRING"]
)  # noqa E501

db = client.party


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class Base(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    timestamp: datetime = Field(default_factory=datetime.now)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed: True
        json_encoders = {ObjectId: str}
