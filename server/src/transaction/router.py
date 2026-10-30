from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
from src.transaction import controller
from src.transaction.schema import CreateOrderRequest
from src.utils.db import get_db
from src.utils.helper import is_authenticated
from src.users.model import UserModel

transaction_router = APIRouter(prefix="/payment", tags=["Transaction"])

@transaction_router.post("/create-order")
def create_order(
    body: CreateOrderRequest,
    user: UserModel = Depends(is_authenticated),
    db: Session = Depends(get_db)
):
    return controller.create_cashfree_order(body, user, db)

@transaction_router.post("/webhook")
async def webhook(request: Request, db: Session = Depends(get_db)):
    return await controller.handle_webhook(request, db)

@transaction_router.get("/debug-complete-payment/{order_id}")
def debug_complete_payment(order_id: str, db: Session = Depends(get_db)):
    return controller.debug_complete_payment(order_id, db)

@transaction_router.get("/verify-payment/{order_id}")
def verify_payment(order_id: str, db: Session = Depends(get_db)):
    return controller.verify_payment(order_id, db)
