from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from sqlalchemy.future import select # type: ignore
from typing import List

from .database import get_db
from .models import Subscriber, Post
from .schemas import (
    ProjectResponse, ProjectCreate, 
    LeadCreate, LeadResponse,
    SubscriberResponse, SubscriberCreate,
    PostResponse, PostCreate
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

# --- ADMIN ROUTES (DASHBOARD) ---

@router.get("/admin/posts", response_model=List[PostResponse])
async def admin_list_posts(db: AsyncSession = Depends(get_db)):
    """Dashboard: View all drafts and published posts."""
    return await PostRepository.get_all(db, published_only=False)

@router.post("/admin/posts")
async def create_post(
    post: PostCreate, 
    background_tasks: BackgroundTasks, # Correctly injected by FastAPI
    db: AsyncSession = Depends(get_db)
):
    """Creates a new post and broadcasts to subscribers if published."""
    # 1. Create the post in DB
    new_post = await PostRepository.create(db, post)
    
    # 2. If published, trigger the notification logic
    if new_post.is_published:
        # Get active subscribers from repo
        subscribers = await SubscriberRepository.get_active(db)
        emails = [s.email for s in subscribers]
        
        if emails:
            # Dispatch broadcast task
            background_tasks.add_task(
                broadcast_new_post,
                subscriber_emails=emails,
                post_title=new_post.title,
                post_summary=new_post.summary,
                post_slug=new_post.slug
            )
            
    return new_post

@router.get("/leads", response_model=List[LeadResponse])
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