from core.database import Base
from pydantic import Field


class PlayerModel(Base):
    name: str = Field(...)
    image_url: str = Field(...)

    _doc_name = "players"
