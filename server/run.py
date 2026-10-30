from fastapi import Depends, FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from src.users.auth import auth_router
from src.utils.db import engine, Base
from src.website_project.model import WebsiteProjectModel
from src.users.model import UserModel
from src.session.model import SessionModel
from src.account.model import AccountModel
from src.transaction.model import TransactionModel
from src.conversation.model import ConversationModel
from src.version.model import VersionModel
from src.utils.helper import is_authenticated
from src.users.router import user_router
from src.website_project.router import website_project_router
from src.transaction.router import transaction_router


import time
from fastapi import Request

app = FastAPI()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    print(f"Request: {request.method} {request.url.path} - Status: {response.status_code} - Duration: {duration:.2f}s")
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# print(fastapi.__version__) #checking fastapi installed or not
@app.get("/",status_code=status.HTTP_200_OK)
def home(user:UserModel = Depends(is_authenticated)):
    return {"message": "welcome to our website builder"}

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(website_project_router)
app.include_router(transaction_router)

# @app.get("/contact")
# def contact():
#     return "you can connect us anytime"
