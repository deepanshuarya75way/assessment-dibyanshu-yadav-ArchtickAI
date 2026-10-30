from src.utils.db import Base
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Float, Integer
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class TransactionModel(Base):
    __tablename__ = "transaction"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, unique=True, index=True)
    is_paid = Column(Boolean, default=False)
    plan_id = Column(String)
    amount = Column(Float)
    credits = Column(Integer)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    user = relationship("UserModel", back_populates="transactions")