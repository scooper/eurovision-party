from core.database import Base

from typing import List
from pydantic import Field


class ScoreModel(Base):
    event_id: str = Field(...)
    player_id: str = Field(...)
    scores: List[(str, int)] = Field(...)  # player_id/score pair

    _doc_name = "scores"
