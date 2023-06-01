from core.database import Base
from pydantic import Field


class UserModel(Base):
    name: str = Field(...)
    username: str = Field(...)
    password: str = Field(...)
    privelege: bool = Field(default=False)

    _doc_name = "users"
