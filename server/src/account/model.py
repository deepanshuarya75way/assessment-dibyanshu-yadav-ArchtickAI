from src.utils.db import Base
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class AccountModel(Base):
    __tablename__ = "account"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(String)
    provider_id = Column(String)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))

    access_token = Column(Text)
    refresh_token = Column(Text)
    id_token = Column(Text)
    access_token_expires_at = Column(DateTime)
    refresh_token_expires_at = Column(DateTime)
    scope = Column(String)
    password = Column(String)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    user = relationship("UserModel", back_populates="accounts")
