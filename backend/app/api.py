from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from sqlalchemy.future import select # type: ignore
from sqlalchemy import func # type: ignore
from typing import List

from .database import get_db
from .models import Lead, Material, Subscriber, Post
from .schemas import (
    ProjectResponse, ProjectCreate, 
    LeadCreate, LeadResponse,
    SubscriberResponse, SubscriberCreate,
    PostResponse, PostCreate,
    MaterialCreate, MaterialResponse # Injected validation mirrors
)
from .crud import ProjectRepository, LeadRepository, PostRepository, SubscriberRepository
from .config import settings
from .tasks import send_welcome_email, send_lead_notification, broadcast_new_post

router = APIRouter()

# --- PUBLIC ROUTES ---

@router.post("/subscribe")
async def subscribe(
    subscriber: SubscriberCreate, 
    background_tasks: BackgroundTasks, 
    db: AsyncSession = Depends(get_db)
):
    """Initializes or re-activates a newsletter subscription."""
    query = select(Subscriber).where(Subscriber.email == subscriber.email)
    result = await db.execute(query)
    existing_sub = result.scalars().first()

    if existing_sub:
        if existing_sub.is_active:
            raise HTTPException(
                status_code=400, 
                detail="Identity already registered and active in system."
            )
        else:
            # Re-activate if they previously unsubscribed
            existing_sub.is_active = True
            await db.commit()
            return {"status": "success", "message": "Subscription re-activated."}

    # Create new subscriber using repository
    await SubscriberRepository.create(db, subscriber)
    
    # Dispatch welcome email task
    background_tasks.add_task(send_welcome_email, subscriber.email)
    
    return {"status": "success", "message": "Subscription initialized."}

@router.post("/unsubscribe")
async def unsubscribe(
    email: str, 
    db: AsyncSession = Depends(get_db)
):
    """De-activates a subscription based on email."""
    query = select(Subscriber).where(Subscriber.email == email)
    result = await db.execute(query)
    sub = result.scalars().first()

    if not sub:
        raise HTTPException(status_code=404, detail="Email not found in system logs.")

    sub.is_active = False
    await db.commit()
    
    return {"status": "success", "message": "De-registered from transmission list."}

@router.get("/projects", response_model=List[ProjectResponse])
async def list_projects(db: AsyncSession = Depends(get_db)):
    """Fetches all published portfolio projects."""
    return await ProjectRepository.get_all_published(db)

@router.get("/posts", response_model=List[PostResponse])
async def list_published_posts(db: AsyncSession = Depends(get_db)):
    """Public feed for research articles."""
    return await PostRepository.get_all(db, published_only=True)

@router.get("/posts/{slug}", response_model=PostResponse)
async def get_post_details(slug: str, db: AsyncSession = Depends(get_db)):
    """Public route for a single research article by its slug."""
    post = await PostRepository.get_by_slug(db, slug)
    if not post:
        raise HTTPException(status_code=404, detail="Article not found in system logs.")
    return post

@router.post("/leads")
async def submit_lead(
    lead: LeadCreate, 
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Handles contact form submissions and triggers notifications."""
    new_lead = await LeadRepository.create(db, lead)
    background_tasks.add_task(
        send_lead_notification, 
        lead.email, 
        lead.full_name, 
        lead.message
    )
    return {"message": "Inquiry received. System notification dispatched."}

# --- PUBLIC AI MATERIALS ROUTES ---

@router.get("/materials", response_model=List[MaterialResponse])
async def list_learning_materials(db: AsyncSession = Depends(get_db)):
    """Public feed: Fetches all active AI training assets and streams."""
    query = select(Material).where(Material.is_published == True).order_by(Material.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

# --- ADMIN ROUTES (DASHBOARD) ---

@router.get("/admin/posts", response_model=List[PostResponse])
async def admin_list_posts(db: AsyncSession = Depends(get_db)):
    """Dashboard: View all drafts and published posts."""
    return await PostRepository.get_all(db, published_only=False)

@router.post("/admin/posts")
async def create_post(
    post: PostCreate, 
    background_tasks: BackgroundTasks, 
    db: AsyncSession = Depends(get_db)
):
    """Creates a new post and broadcasts to subscribers if published."""
    new_post = await PostRepository.create(db, post)
    
    if new_post.is_published:
        subsubscribers = await SubscriberRepository.get_active(db)
        emails = [s.email for s in subsubscribers]
        
        if emails:
            background_tasks.add_task(
                broadcast_new_post,
                subscriber_emails=emails,
                post_title=new_post.title,
                post_summary=new_post.summary,
                post_slug=new_post.slug
            )
            
    return new_post

@router.get("/admin/leads", response_model=List[LeadResponse])
async def list_leads(db: AsyncSession = Depends(get_db)):
    """Dashboard: Fetches all received leads/inquiries."""
    return await LeadRepository.get_all(db)

@router.get("/subscribers", response_model=List[SubscriberResponse])
async def list_subscribers(db: AsyncSession = Depends(get_db)):
    """Dashboard: Fetches the complete mailing list."""
    return await SubscriberRepository.get_all(db)

@router.post("/projects", response_model=ProjectResponse)
async def create_project(project: ProjectCreate, db: AsyncSession = Depends(get_db)):
    """Dashboard: Adds a new project to the portfolio."""
    return await ProjectRepository.create(db, project)

@router.get("/admin/stats")
async def get_system_stats(db: AsyncSession = Depends(get_db)):
    sub_count = await db.execute(select(func.count(Subscriber.id)).where(Subscriber.is_active == True))
    lead_count = await db.execute(select(func.count(Lead.id)))
    post_count = await db.execute(select(func.count(Post.id)))
    material_count = await db.execute(select(func.count(Material.id)))
    
    return {
        "active_subscribers": sub_count.scalar(),
        "total_leads": lead_count.scalar(),
        "total_articles": post_count.scalar(),
        "total_materials": material_count.scalar(),
        "system_status": "Operational"
    }

@router.delete("/admin/posts/{post_id}", status_code=status.HTTP_200_OK)
async def delete_post(
    post_id: int, 
    db: AsyncSession = Depends(get_db)
):
    """Dashboard: Permanently removes a research post from the repository."""
    query = select(Post).where(Post.id == post_id)
    result = await db.execute(query)
    post = result.scalars().first()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Target node not found in repository logs."
        )
    
    await db.delete(post)
    await db.commit()
    return {"status": "success", "message": "Log entry scrubbed successfully."}

# --- ADMIN COURSE MATERIALS MANAGEMENT ENDPOINTS ---

@router.post("/admin/materials", response_model=MaterialResponse, status_code=status.HTTP_201_CREATED)
async def create_learning_material(
    material: MaterialCreate, 
    db: AsyncSession = Depends(get_db)
):
    """Dashboard: Direct injection node for technical documentation or media assets."""
    db_material = Material(**material.model_dump())
    db.add(db_material)
    await db.commit()
    await db.refresh(db_material)
    return db_material

@router.delete("/admin/materials/{material_id}", status_code=status.HTTP_200_OK)
async def delete_learning_material(
    material_id: int, 
    db: AsyncSession = Depends(get_db)
):
    """Dashboard: Permanent excision of structural AI tracking entities."""
    query = select(Material).where(Material.id == material_id)
    result = await db.execute(query)
    target_material = result.scalars().first()
    
    if not target_material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Target training resource not found in data matrix."
        )
        
    await db.delete(target_material)
    await db.commit()
    return {"status": "success", "message": "Material node systematically expunged."}