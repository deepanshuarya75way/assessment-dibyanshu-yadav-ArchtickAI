from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
from src.users import controller
from src.users.schema import LoginSchema, UserSchema, UserResponseSchema
from src.utils.db import get_db

auth_router = APIRouter(prefix="/auth", tags=["Auth"])


@auth_router.post(
    "/register", response_model=UserResponseSchema, status_code=status.HTTP_201_CREATED
)
def register(body: UserSchema, db: Session = Depends(get_db)):
    return controller.register(body, db)


@auth_router.post(
    "/login",
    status_code=status.HTTP_200_OK
)
def login_user(body: LoginSchema, db: Session = Depends(get_db)):
    return controller.login_user(body, db)


@auth_router.get(
    "/is-auth", response_model=UserResponseSchema, status_code=status.HTTP_200_OK
)
def is_auth(request: Request, db: Session = Depends(get_db)):
    return controller.is_authenticated(request, db)
