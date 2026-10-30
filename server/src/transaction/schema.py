from pydantic import BaseModel
from typing import Optional

class CreateOrderRequest(BaseModel):
    plan_id: str
    amount: float
    credits: int

class OrderResponse(BaseModel):
    order_id: str
    payment_session_id: str
    order_status: str

class WebhookData(BaseModel):
    order_id: str
    order_amount: float
    order_currency: str
    payment_status: str
    # Other fields can be added as needed based on Cashfree webhook payload
