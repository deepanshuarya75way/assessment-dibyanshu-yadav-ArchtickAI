from src.utils.db import Base
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class WebsiteProjectModel(Base):
    __tablename__ = "website_project"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    initial_prompt = Column(Text)
    current_code = Column(Text)
    current_version_index = Column(String, default="")
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    is_published = Column(Boolean, default=False)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    # Relationships
    user = relationship("UserModel", back_populates="projects")
    conversation = relationship(
        "ConversationModel", back_populates="project", cascade="all, delete"
    )
    versions = relationship(
        "VersionModel", back_populates="project", cascade="all, delete"
    )
