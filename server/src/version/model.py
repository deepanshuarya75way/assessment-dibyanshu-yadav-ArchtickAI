from src.utils.db import Base
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class VersionModel(Base):
    __tablename__ = "version"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(Text)
    description = Column(Text)
    timestamp = Column(DateTime, server_default=func.now())
    project_id = Column(Integer, ForeignKey("website_project.id", ondelete="CASCADE"))

    project = relationship("WebsiteProjectModel", back_populates="versions")