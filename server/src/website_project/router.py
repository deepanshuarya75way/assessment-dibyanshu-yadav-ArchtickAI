from src.users.model import UserModel
from src.utils.helper import is_authenticated
from src.utils.db import get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, Request, status
from src.website_project import controller
from src.website_project.schema import (
    WebsiteCreateSchema, 
    WebsiteRevisionSchema, 
    ProjectCodeSchema, 
    ProjectIdResponseSchema,
    WebsiteProjectResponseSchema,
    WebsiteProjectsResponseSchema
)

website_project_router = APIRouter(prefix="/website-project", tags=["Website Project"])

@website_project_router.post(
    "/create", response_model=ProjectIdResponseSchema, status_code=status.HTTP_201_CREATED
)
def create_website_project(body: WebsiteCreateSchema, user:UserModel = Depends(is_authenticated), db: Session = Depends(get_db)):
    return controller.create_website_project(body, user, db)

@website_project_router.get(
    "/all", response_model=WebsiteProjectsResponseSchema, status_code=status.HTTP_200_OK
)
def get_all_website_projects(user:UserModel = Depends(is_authenticated), db: Session = Depends(get_db)):
    return controller.get_user_projects(user, db)

@website_project_router.get(
    "/{project_id}", response_model=WebsiteProjectResponseSchema, status_code=status.HTTP_200_OK
)
def get_website_project(project_id: int, user:UserModel = Depends(is_authenticated), db: Session = Depends(get_db)):
    return controller.get_user_project(project_id, user, db)

@website_project_router.post("/publish/{project_id}", status_code=status.HTTP_200_OK)
def publish_website_project(project_id: int, user:UserModel = Depends(is_authenticated), db: Session = Depends(get_db)):
    return controller.toggle_publish(project_id, user, db)

@website_project_router.put("/save/{project_id}", status_code=status.HTTP_200_OK)
def save_website_project(project_id: int,body:ProjectCodeSchema, user:UserModel = Depends(is_authenticated), db: Session = Depends(get_db)):
    return controller.save_project_code(project_id,body, user, db)

@website_project_router.post("/revision/{project_id}", status_code=status.HTTP_200_OK)
def make_website_revision(project_id: int, body: WebsiteRevisionSchema, user:UserModel = Depends(is_authenticated), db: Session = Depends(get_db)):
    return controller.make_revision(project_id, body, user, db)

@website_project_router.put("/rollback/{project_id}/{version_id}", status_code=status.HTTP_200_OK)
def rollback_website_version(project_id: int, version_id: int, user:UserModel = Depends(is_authenticated), db: Session = Depends(get_db)):
    return controller.rollback_to_version(project_id, version_id, user, db)

@website_project_router.delete("/{project_id}", status_code=status.HTTP_200_OK)
def delete_website_project(project_id: int, user:UserModel = Depends(is_authenticated), db: Session = Depends(get_db)):
    return controller.delete_project(project_id, user, db)

@website_project_router.get("/preview/{project_id}", response_model=WebsiteProjectResponseSchema, status_code=status.HTTP_200_OK)
def get_website_project_preview(project_id: int, user:UserModel = Depends(is_authenticated), db: Session = Depends(get_db)):
    return controller.get_project_preview(project_id, user, db)

@website_project_router.get("/public/all", response_model=WebsiteProjectsResponseSchema, status_code=status.HTTP_200_OK)
def get_all_published_projects(db: Session = Depends(get_db)):
    return controller.get_published_project(db)

@website_project_router.get("/public/{project_id}",status_code=status.HTTP_200_OK)
def get_public_project_by_id(project_id: int, db: Session = Depends(get_db)):
    return controller.get_project_by_id(project_id, db)