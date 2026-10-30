
from src.utils.db import Base
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.sql import func
from src.utils.db import Base
from sqlalchemy.orm import relationship
from src.utils.enum import RoleEnum


class ConversationModel(Base):
    __tablename__ = "conversation"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(Enum(RoleEnum))
    content = Column(Text)
    timestamp = Column(DateTime, server_default=func.now())
    project_id = Column(Integer, ForeignKey("website_project.id", ondelete="CASCADE"))

    project = relationship("WebsiteProjectModel", back_populates="conversation")