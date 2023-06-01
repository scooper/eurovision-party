from core.database import Base
from pydantic import Field
from typing import List


class EventModel(Base):
    name: str = Field(...)
    participants: List[str] = Field(...)

    _doc_name = "events"
