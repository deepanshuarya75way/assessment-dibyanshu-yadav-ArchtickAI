from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from src.utils.db import Base
from sqlalchemy.orm import relationship


class UserModel(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)

    total_creation = Column(Integer, default=0)
    credits = Column(Integer, default=20)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    email_verified = Column(Boolean, default=False)

    # Relationships
    projects = relationship(
        "WebsiteProjectModel", back_populates="user", cascade="all, delete"
    )
    sessions = relationship(
        "SessionModel", back_populates="user", cascade="all, delete"
    )
    accounts = relationship(
        "AccountModel", back_populates="user", cascade="all, delete"
    )
    transactions = relationship(
        "TransactionModel", back_populates="user", cascade="all, delete"
    )
