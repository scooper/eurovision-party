from core.database import Base

from pydantic import Field


class ThemeModel(Base):
    main_color: str = Field(...)
    accent_color: str = Field(...)
    text_color: str = Field(...)
    heading_color: str = Field(...)
    header_image_url: str = Field(...)

    _doc_name = "themes"
