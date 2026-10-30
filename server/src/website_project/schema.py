from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from src.utils.enum import RoleEnum

class ConversationSchema(BaseModel):
    id: int
    role: RoleEnum
    content: str
    timestamp: datetime
    class Config:
        from_attributes = True

class VersionSchema(BaseModel):
    id: int
    code: str
    description: str
    timestamp: datetime
    class Config:
        from_attributes = True

class UserSchema(BaseModel):
    id: int
    name: str
    email: str
    class Config:
        from_attributes = True

class WebsiteProjectSchema(BaseModel):
    id: int
    name: str
    initial_prompt: str
    current_code: Optional[str] = ""
    current_version_index: Optional[str] = ""
    user_id: int
    is_published: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    conversation: List[ConversationSchema] = []
    versions: List[VersionSchema] = []
    user: UserSchema
    class Config:
        from_attributes = True

class WebsiteProjectResponseSchema(BaseModel):
    project: WebsiteProjectSchema

class WebsiteProjectsResponseSchema(BaseModel):
    projects: List[WebsiteProjectSchema]

class WebsiteCreateSchema(BaseModel):
    initial_prompt: str

class WebsiteRevisionSchema(BaseModel):
    revision_prompt: str
    
class ProjectCodeSchema(BaseModel):
    code: str

class ProjectIdResponseSchema(BaseModel):
    project_id: int
