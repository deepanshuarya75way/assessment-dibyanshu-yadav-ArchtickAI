from src.utils.db import Base
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class SessionModel(Base):
    __tablename__ = "session"

    id = Column(Integer, primary_key=True, index=True)
    expires_at = Column(DateTime)
    token = Column(String, unique=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    ip_address = Column(String)
    user_agent = Column(String)

    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))

    user = relationship("UserModel", back_populates="sessions")