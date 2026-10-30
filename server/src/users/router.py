from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
from src.users import controller
from src.utils.db import get_db
from src.utils.helper import is_authenticated
from src.users.model import UserModel
from src.users.schema import UserCreditsResponse

user_router = APIRouter(prefix="/user", tags=["User"])

@user_router.get(
    "/credits", response_model=UserCreditsResponse, status_code=status.HTTP_200_OK
)
def get_user_credits(user:UserModel = Depends(is_authenticated), db: Session = Depends(get_db)):
    return controller.get_user_credits(user, db)

@user_router.post(
    "/purchase-credits", response_model=UserCreditsResponse, status_code=status.HTTP_200_OK
)
def purchase_credits(user:UserModel = Depends(is_authenticated), db: Session = Depends(get_db)):
    return controller.purchase_credits(user, db)