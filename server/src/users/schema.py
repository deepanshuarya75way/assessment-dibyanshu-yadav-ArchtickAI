from pydantic import BaseModel

class User(BaseModel):
    name: str
    email: str

class UserSchema(User):
    password : str

class UserResponseSchema(BaseModel):
    id : int
    name : str
    email : str

class LoginSchema(BaseModel):
    email : str
    password : str

class UserCreditsResponse(BaseModel):
    credits: int
