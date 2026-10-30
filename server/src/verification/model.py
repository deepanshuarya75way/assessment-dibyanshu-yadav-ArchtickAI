from src.utils.db import Base
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class VerificationModel(Base):
    __tablename__ = "verification"

    id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String, index=True)
    value = Column(String)
    expires_at = Column(DateTime)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())