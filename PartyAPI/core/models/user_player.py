from core.database import Base

from pydantic import Field


class UserPlayerModel(Base):
    user_id: str = Field(...)
    player_id: str = Field(...)
    event_id: str = Field(...)

    _doc_name = "user_player_associations"
