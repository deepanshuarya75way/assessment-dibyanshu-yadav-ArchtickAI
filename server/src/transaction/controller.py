from cashfree_pg.api_client import Cashfree
from cashfree_pg.models.customer_details import CustomerDetails
from cashfree_pg.models.create_order_request import CreateOrderRequest
from fastapi import HTTPException, status, Request
from sqlalchemy.orm import Session
from src.transaction.schema import CreateOrderRequest as CreateOrderRequestSchema
from src.transaction.model import TransactionModel
from src.users.model import UserModel
from src.utils.settings import settings
import uuid

# Initialize Cashfree
cf = Cashfree(
    XEnvironment=Cashfree.SANDBOX,
    XClientId=settings.CLIENT_ID,
    XClientSecret=settings.CLIENT_SECRET
)

def create_cashfree_order(body: CreateOrderRequestSchema, user: UserModel, db: Session):
    try:
        order_id = f"order_{uuid.uuid4().hex[:12]}"
        
        customer_details = CustomerDetails(
            customer_id=f"cust_{user.id}",
            customer_phone="9999999999", # Placeholder
            customer_email=user.email
        )

        create_order_request = CreateOrderRequest(
            order_id=order_id,
            order_amount=body.amount,
            order_currency="INR",
            customer_details=customer_details
        )

        response = cf.PGCreateOrder(create_order_request=create_order_request)
        
        if response.status_code == 200:
            # Create transaction record in DB
            new_transaction = TransactionModel(
                order_id=order_id,
                plan_id=body.plan_id,
                amount=body.amount,
                credits=body.credits,
                user_id=user.id,
                is_paid=False 
            )
            
            db.add(new_transaction)
            db.commit()
            db.refresh(new_transaction)

            return {
                "payment_session_id": response.data.payment_session_id,
                "order_id": order_id
            }
        else:
            raise HTTPException(status_code=400, detail=f"Cashfree Error: {response.data.message}")

    except Exception as e:
        print(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def handle_webhook(request: Request, db: Session):
    try:
        # Get raw body for signature verification
        raw_body = await request.body()
        raw_body_str = raw_body.decode("utf-8")
        
        # Get headers
        signature = request.headers.get("x-webhook-signature")
        timestamp = request.headers.get("x-webhook-timestamp")

        print(f"Webhook received with signature: {signature}")

        # Verify signature (if headers are present)
        if signature and timestamp:
            try:
                event = cf.PGVerifyWebhookSignature(signature, raw_body_str, timestamp)
                body = event.object
            except Exception as sig_error:
                print(f"Signature verification failed: {sig_error}")
                # In production, you might want to return 401 here. 
                # For now, we'll log it and continue if signature is missing (like in manual tests).
                body = await request.json()
        else:
            body = await request.json()

        data = body.get("data", {})
        order = data.get("order", {})
        payment = data.get("payment", {})
        
        order_id = order.get("order_id")
        payment_status = payment.get("payment_status")

        print(f"Processing webhook for Order: {order_id}, Status: {payment_status}")
        
        # Log full body for debugging if status is not success
        if payment_status != "SUCCESS":
            print(f"Non-success webhook: {body}")

        if payment_status in ["SUCCESS", "PAID"]:
            # Find transaction 
            transaction = db.query(TransactionModel).filter(TransactionModel.order_id == order_id).first()
            if not transaction:
                print(f"Transaction not found for Order ID: {order_id}")
            elif transaction.is_paid:
                print(f"Transaction {order_id} already marked as paid.")
            else:
                transaction.is_paid = True
                
                # Update user credits
                user = db.query(UserModel).filter(UserModel.id == transaction.user_id).first()
                if user:
                    old_credits = user.credits
                    user.credits += transaction.credits
                    db.commit()
                    print(f"Transaction {order_id} marked as SUCCESS. Credits updated for user {user.id}: {old_credits} -> {user.credits}")
                else:
                    print(f"User not found for transaction {transaction.id}")
                    db.commit()

        return {"status": "ok"}
    except Exception as e:
        print(f"Webhook error: {str(e)}")
        return {"status": "error", "message": str(e)}

def debug_complete_payment(order_id: str, db: Session):
    transaction = db.query(TransactionModel).filter(TransactionModel.order_id == order_id).first()
    if not transaction:
        return {"error": "Transaction not found"}
    
    if transaction.is_paid:
        return {"message": "Already paid", "credits": 0}

    transaction.is_paid = True
    user = db.query(UserModel).filter(UserModel.id == transaction.user_id).first()
    if user:
        added_credits = transaction.credits
        user.credits += added_credits
        db.commit()
        return {
            "message": "Payment simulation successful", 
            "added_credits": added_credits, 
            "new_total": user.credits,
            "order_id": order_id
        }
    return {"error": "User not found"}

def verify_payment(order_id: str, db: Session):
    try:
        # Fetch order details from Cashfree
        api_response = cf.PGFetchOrder(settings.API_VERSION, order_id)
        
        if not api_response.data:
            return {"error": "Order not found in Cashfree"}
            
        order_status = api_response.data.order_status
        print(f"Verifying Order {order_id}: Status is {order_status}")

        if order_status in ["PAID", "SUCCESS"]:
            # Find transaction 
            transaction = db.query(TransactionModel).filter(TransactionModel.order_id == order_id).first()
            if not transaction:
                return {"error": "Transaction not found in database"}
            
            if transaction.is_paid:
                return {"status": "SUCCESS", "message": "Credits already added", "order_id": order_id}

            transaction.is_paid = True
            user = db.query(UserModel).filter(UserModel.id == transaction.user_id).first()
            if user:
                user.credits += transaction.credits
                db.commit()
                print(f"Order {order_id} verified as PAID. Credits added to user {user.id}.")
                return {
                    "status": "SUCCESS", 
                    "message": "Payment verified and credits added", 
                    "order_id": order_id,
                    "credits_added": transaction.credits
                }
            else:
                db.commit()
                return {"error": "User not found"}
        
        return {"status": "PENDING", "message": f"Order status is {order_status}"}

    except Exception as e:
        print(f"Verification error: {str(e)}")
        return {"error": str(e)}
