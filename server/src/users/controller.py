from src.users.schema import UserSchema, LoginSchema
from sqlalchemy.orm import Session
from src.users.model import UserModel
from fastapi import HTTPException, status, Request
from pwdlib import PasswordHash
import jwt
from src.utils.settings import settings
from datetime import datetime, timedelta
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

password_hash = PasswordHash.recommended()

def get_password_hash(password):
    return password_hash.hash(password)

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

def register(body: UserSchema, db: Session):
    # email validation
    is_email = db.query(UserModel).filter(UserModel.email == body.email).first()
    if is_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = get_password_hash(body.password)

    new_user = UserModel(
        name=body.name,
        hashed_password=hashed_password,
        email=body.email,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(body: LoginSchema, db: Session):
    user = db.query(UserModel).filter(UserModel.email == body.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid password")

    exp_time = datetime.now() + timedelta(hours=settings.EXP_TIME)
    token = jwt.encode(
        {"_id": user.id, "exp": exp_time.timestamp()},
        settings.SECRET_KEY,
        settings.ALGORITHM,
    )

    return {"token": token}


# Token Sends ----
def is_authenticated(request: Request, db: Session):
    try:
        token = request.headers.get("Authorization")
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token is missing"
            )

        token = token.split(" ")[-1]
        data = jwt.decode(token, settings.SECRET_KEY, settings.ALGORITHM)
        user_id = data.get("_id")

        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
            )

        return user
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

def get_user_credits(user:UserModel, db:Session):
    try:
        return {"credits": user.credits}
    except Exception as e:
        raise HTTPException(status_code=500, detail="User is not authorized to get credits")

def purchase_credits(user:UserModel,db:Session):
    pass