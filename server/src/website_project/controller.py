from typing import Any

from src.users.model import UserModel
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from src.website_project.schema import WebsiteCreateSchema, WebsiteRevisionSchema,ProjectCodeSchema
from src.website_project.model import WebsiteProjectModel
from src.conversation.model import ConversationModel
from src.version.model import VersionModel
from src.utils.helper import model
import json

def create_website_project(body: WebsiteCreateSchema, user: UserModel, db: Session):
    """create user project"""
    try:
        # 1. Credit check
        if user.credits < 5:
            raise HTTPException(status_code=403, detail="Insufficient credits")
        
        # 2. Initialize project
        project_name = body.initial_prompt if len(body.initial_prompt) < 50 else body.initial_prompt[:47] + "..."
        project = WebsiteProjectModel(
            name=project_name,
            initial_prompt=body.initial_prompt,
            user_id=user.id,
        )
        db.add(project)
        db.flush()  # Get project.id without committing

        # 3. Create initial user conversation entry
        user_conv = ConversationModel(
            role="user",
            content=body.initial_prompt,
            project_id=project.id,
        )
        db.add(user_conv)

        # 4. Enhance the website prompt via AI
        prompt_enhance_system = """
        You are a prompt enhancement specialist. Take the user's website request and expand it into a detailed, comprehensive prompt that will help create the best possible website.

        Enhance this prompt by:
        1. Adding specific design details (layout, color scheme, typography)
        2. Specifying key sections and features
        3. Describing the user experience and interactions
        4. Including modern web design best practices
        5. Mentioning responsive design requirements
        6. Adding any missing but important elements

        Return ONLY the enhanced prompt, nothing else. Make it detailed but concise (2-3 paragraphs max).
        """
        
        message = [
            {"role": "system", "content": prompt_enhance_system},
            {"role": "user", "content": body.initial_prompt}
        ]

        response = model.invoke(message)
        enhanced_prompt = json.dumps(response.content)

        # 5. Create enhanced prompt conversation entry
        enhanced_conv = ConversationModel(
            role="assistant",
            content=f"I have enhanced your prompt to: {enhanced_prompt}",
            project_id=project.id,
        )
        db.add(enhanced_conv)

        # 6. Create generation status conversation entry
        gen_status_conv = ConversationModel(
            role="assistant",
            content="Now generating your website...",
            project_id=project.id,
        )
        db.add(gen_status_conv)

        # 7. Update existing user credits and stats
        user.credits -= 5
        user.total_creation += 1
        db.add(user)

        # 8. Create website generation task
        website_creation_system = f"""
        You are an expert web developer. Create a complete, production-ready, single-page website based on this request: "{enhanced_prompt}"

            CRITICAL REQUIREMENTS:
            - You MUST output valid HTML ONLY. 
            - Use Tailwind CSS for ALL styling
            - Include this EXACT script in the <head>: <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
            - Use Tailwind utility classes extensively for styling, animations, and responsiveness
            - Make it fully functional and interactive with JavaScript in <script> tag before closing </body>
            - To import tailwind in the html use the cdn "https://cdn.tailwindcss.com" 
            - Use modern, beautiful design with great UX using Tailwind classes
            - Make it responsive using Tailwind responsive classes (sm:, md:, lg:, xl:)
            - Use Tailwind animations and transitions (animate-*, transition-*)
            - Include all necessary meta tags
            - Use Google Fonts CDN if needed for custom fonts
            - Use placeholder images from https://placehold.co/600x400
            - Use Tailwind gradient classes for beautiful backgrounds
            - Make sure all buttons, cards, and components use Tailwind styling

            CRITICAL HARD RULES:
            1. You MUST put ALL output ONLY into message.content.
            2. You MUST NOT place anything in "reasoning", "analysis", "reasoning_details", or any hidden fields.
            3. You MUST NOT include internal thoughts, explanations, analysis, comments, or markdown.
            4. Do NOT include markdown, explanations, notes, or code fences.

            The HTML should be complete and ready to render as-is with Tailwind CSS.
        """

        website_message = [
            {"role": "system", "content": website_creation_system},
            {"role": "user", "content": enhanced_prompt or ''}
        ]

        response = model.invoke(website_message)
        get_code = json.dumps(response.content)

        # 9. storing the code version
        code_version = VersionModel(
            code = get_code,
            description = "Initial version",
            project_id = project.id,
        )   
        db.add(code_version)

         # 10. getting to know that user website is ready
        gen_status_conv = ConversationModel(
            role="assistant",
            content="Your website is created. you can now preview it and request any changes",
            project_id=project.id,
        )
        db.add(gen_status_conv)

        # 11. updating the project current version 
        project.current_version_index = code_version.id
        project.current_code = get_code
        db.add(project)

        # 12. Commit all changes
        db.commit()
        db.refresh(project)
        return {"project_id": project.id}

    except HTTPException:
        db.rollback()
        user.credits += 5
        db.add(user)
        db.commit()
        raise
    except Exception as e:
        db.rollback()
        user.credits += 5
        db.add(user)
        db.commit()
        print(f"Error creating project: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred while creating the project"
        )

def get_user_project(project_id: int, user: UserModel, db: Session):
    """get one project of user"""
    try:
        project = db.query(WebsiteProjectModel).options(
            joinedload(WebsiteProjectModel.conversation),
            joinedload(WebsiteProjectModel.versions)
        ).filter(WebsiteProjectModel.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        if project.user_id != user.id:
            raise HTTPException(status_code=403, detail="User is not authorized to access this project")
        return {"project": project}
    except Exception as e:
        print(f"Error fetching project: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching projects")

def get_user_projects(user: UserModel, db: Session):
    """get all projects of user"""
    try:
        projects = db.query(WebsiteProjectModel).filter(WebsiteProjectModel.user_id == user.id).all()
        return {"projects": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while fetching projects")

def toggle_publish(project_id: int, user: UserModel, db: Session):
    """toggle publish of user project"""
    try:
        project = db.query(WebsiteProjectModel).filter(WebsiteProjectModel.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        if project.user_id != user.id:
            raise HTTPException(status_code=403, detail="User is not authorized to access this project")
        project.is_published = not project.is_published
        db.add(project)
        db.commit()
        return {"message": "Project published successfully" if project.is_published else "Project unpublished successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while toggling publish")
    
def make_revision(project_id: int,body:WebsiteRevisionSchema, user: UserModel, db: Session):
    """make revision of user project"""
    try:
        # 1. Credit check
        if user.credits < 5:
            raise HTTPException(status_code=403, detail="Insufficient credits")
        
        if not body.revision_prompt:
            raise HTTPException(status_code=400, detail="Revision prompt is required")

        # 2. Get project
        project = db.query(WebsiteProjectModel).filter(WebsiteProjectModel.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        if project.user_id != user.id:
            raise HTTPException(status_code=403, detail="User is not authorized to access this project")
        
        # 3. Create revision prompt conversation entry
        revision_conv = ConversationModel(
            role="user",
            content=body.revision_prompt,
            project_id=project_id,
        )
        db.add(revision_conv)

        # 4. Enhance the revision prompt via AI
        prompt_enhance_system = """
        You are a prompt enhancement specialist. The user wants to make changes to their website. Enhance their request to be more specific and actionable for a web developer.

        Enhance this by:
        1. Being specific about what elements to change
        2. Mentioning design details (colors, spacing, sizes)
        3. Clarifying the desired outcome
        4. Using clear technical terms

        Return ONLY the enhanced request, nothing else. Keep it concise (1-2 sentences).
        """
        
        message = [
            {"role": "system", "content": prompt_enhance_system},
            {"role": "user", "content": body.revision_prompt}
        ]

        response = model.invoke(message)
        enhanced_prompt: Any = json.dumps(response.content)

        # 5. Create enhanced prompt conversation entry
        enhanced_conv = ConversationModel(
            role="assistant",
            content=f"I have enhanced your revision prompt to: {enhanced_prompt}",
            project_id=project_id,
        )
        db.add(enhanced_conv)

        # 6. Create revision status conversation entry
        revision_status_conv = ConversationModel(
            role="assistant",
            content="Now making changes in your website...",
            project_id=project_id,
        )
        db.add(revision_status_conv)

        # 7. Update existing user credits and stats
        user.credits -= 5
        db.add(user)    

        # 8. Create website revision task
        website_revision_system = f"""
        You are an expert web developer. 

        CRITICAL REQUIREMENTS:
        - Return ONLY the complete updated HTML code with the requested changes.
        - Use Tailwind CSS for ALL styling (NO custom CSS).
        - Use Tailwind utility classes for all styling changes.
        - Include all JavaScript in <script> tags before closing </body>
        - Make sure it's a complete, standalone HTML document with Tailwind CSS
        - Return the HTML Code Only, nothing else

        Apply the requested changes while maintaining the Tailwind CSS styling approach.
        """

        website_revision_message = [
            {"role": "system", "content": website_revision_system},
            {"role": "user", "content": f"""
            Current Website Code:
            {project.current_code}

            The user wants to make these/this changes/change:
            {enhanced_prompt}
            """}
        ]

        response = model.invoke(website_revision_message)
        get_code = json.dumps(response.content)

        # 9. storing the code version
        code_version = VersionModel(
            code = get_code,
            description = "changes done",
            project_id = project_id,
        )   
        db.add(code_version)

         # 10. getting to know that user website is ready
        revision_status_conv = ConversationModel(
            role="assistant",
            content="I have made the changes in your website! you can now preview it and request any changes",
            project_id=project_id,
        )
        db.add(revision_status_conv)

        # 11. updating the project current version 
        project.current_version_index = code_version.id
        project.current_code = get_code
        db.add(project)

        # 12. Commit all changes
        db.commit()
        db.refresh(project)
        return {"message":"Changes made successfully"}

    except HTTPException:
        db.rollback()
        user.credits += 5
        db.add(user)
        db.commit()
        raise
    except Exception as e:
        db.rollback()
        user.credits += 5
        db.add(user)
        db.commit()
        print(f"Error making revision: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred while making revision"
        )

def rollback_to_version(project_id: int, version_id: int, user: UserModel, db: Session):
    """rollback to specific version of user project"""
    try:
        # 1. Get project
        project = db.query(WebsiteProjectModel).filter(WebsiteProjectModel.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        if project.user_id != user.id:
            raise HTTPException(status_code=403, detail="User is not authorized to access this project")
        
        # 2. Get version
        version = db.query(VersionModel).filter(VersionModel.id == version_id).first()
        if not version:
            raise HTTPException(status_code=404, detail="Version not found")
        if version.project_id != project_id:
            raise HTTPException(status_code=403, detail="Version is not authorized to access this project")
            
        # 3. Update project with version code
        project.current_code = version.code
        project.current_version_index = version_id
        db.add(project)
        
        # 4. Create rollback conversation entry
        rollback_conv = ConversationModel(
            role="assistant",
            content="I have rollback to your website to selected version. You can now preview it",
            project_id=project_id,
        )
        db.add(rollback_conv)
        
        # 5. Commit all changes
        db.commit()
        db.refresh(project)
        return {"message": "Rolled back to version successfully"}
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        print(f"Error rolling back to version: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred while rolling back to version"
        )

def delete_project(project_id: int, user: UserModel, db: Session):
    """delete user project"""
    try:
        # 1. Get project
        project = db.query(WebsiteProjectModel).filter(WebsiteProjectModel.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        if project.user_id != user.id:
            raise HTTPException(status_code=403, detail="User is not authorized to access this project")
        
        # 2. Delete project
        db.delete(project)
        db.commit()
        return {"message": "Project deleted successfully"}
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting project: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred while deleting project"
        )

def get_project_preview(project_id: int, user: UserModel, db: Session):
    """get user project preview"""
    try:
        # 1. Get project
        project = db.query(WebsiteProjectModel).options(joinedload(WebsiteProjectModel.versions)).filter(WebsiteProjectModel.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        if project.user_id != user.id:
            raise HTTPException(status_code=403, detail="User is not authorized to access this project")
        
        return {"project": project}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting project preview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred while getting project preview"
        )
    
def get_published_project(db: Session):
    """get user published project"""
    try:
        # 1. Get project
        projects = db.query(WebsiteProjectModel).options(
            joinedload(WebsiteProjectModel.user)
        ).filter(WebsiteProjectModel.is_published == True).all()
        if not projects:
            raise HTTPException(status_code=404, detail="No published projects found")
        
        
        return {"projects": projects}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting published project: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred while getting published project"
        )

def get_project_by_id(project_id: int, db: Session):
    """get user project by id"""
    try:
        # 1. Get project
        project = db.query(WebsiteProjectModel).options(joinedload(WebsiteProjectModel.versions)).filter(WebsiteProjectModel.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if not project.is_published:
            raise HTTPException(status_code=403, detail="Project is not published") 
        
        if project.current_code == "":
            raise HTTPException(status_code=404, detail="Project has no code")

        return {"code":project.current_code}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting project by id: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred while getting project by id"
        )

def save_project_code(project_id: int,body:ProjectCodeSchema, user: UserModel, db: Session):
    """save user project code"""
    try:
        if not body.code:
            raise HTTPException(status_code=400, detail="Code is required")
        # 1. Get project
        project = db.query(WebsiteProjectModel).filter(WebsiteProjectModel.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        if project.user_id != user.id:
            raise HTTPException(status_code=403, detail="User is not authorized to access this project")
        
        # 2. Save project code
        project.current_code = body.code
        project.current_version_index = ""
        db.add(project)
        db.commit()
        db.refresh(project)
        return {"message": "Project code saved successfully"}
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        print(f"Error saving project code: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred while saving project code"
        )
