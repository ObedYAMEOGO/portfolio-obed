from fastapi import FastAPI  # type: ignore
from fastapi.middleware.cors import (  # type: ignore
    CORSMiddleware,
)

# =========================================================
# PUBLIC ROUTERS
# =========================================================

from app.routers.public.posts import (
    router as public_posts_router,
)

from app.routers.public.projects import (
    router as public_projects_router,
)

from app.routers.public.materials import (
    router as public_materials_router,
)

from app.routers.public.leads import (
    router as public_leads_router,
)

from app.routers.public.newsletter import (
    router as public_newsletter_router,
)

from app.routers.public.subscribers import (
    router as public_subscribers_router,
)  
from app.routers.public.users import (
    router as public_users_router,
)

from app.routers.public.notifications import (
    router as notifications_router,
)

from app.routers.public import comments as public_comments

from app.routers.public import reactions as public_reactions
# =========================================================
# ADMIN ROUTERS
# =========================================================

from app.routers.admin.posts import (
    router as admin_posts_router,
)

from app.routers.admin.projects import (
    router as admin_projects_router,
)

from app.routers.admin.materials import (
    router as admin_materials_router,
)

from app.routers.admin.leads import (
    router as admin_leads_router,
)

from app.routers.admin.subscribers import (
    router as admin_subscribers_router,
)

from app.routers.admin.stats import (
    router as admin_stats_router,
)

from app.routers.admin.admin_settings import (
    router as admin_settings_router,
)
from app.routers.admin import users

from app.routers.admin import auth

from app.routers.admin import comments as admin_comments


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="Portfolio API",
    version="1.0.0",
)

# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# PUBLIC ROUTES
# =========================================================

app.include_router(
    public_posts_router,
    prefix="/api/v1",
    tags=["Public Posts"],
)

app.include_router(
    public_projects_router,
    prefix="/api/v1",
    tags=["Public Projects"],
)

app.include_router(
    public_materials_router,
    prefix="/api/v1",
    tags=["Public Materials"],
)

app.include_router(
    public_leads_router,
    prefix="/api/v1",
    tags=["Public Leads"],
)

app.include_router(
    public_newsletter_router,
    prefix="/api/v1",
    tags=["Newsletter"],
)

app.include_router(
    public_users_router,
    prefix="/api/v1",
    tags=["Public Users"],
)

app.include_router(
    notifications_router,
    prefix="/api/v1",
    tags=["Notifications"],
)

app.include_router(public_comments.router, prefix="/api/v1")

app.include_router(public_reactions.router, prefix="/api/v1")


# =========================================================
# ADMIN ROUTES
# =========================================================

app.include_router(
    admin_posts_router,
    prefix="/api/v1",
    tags=["Admin Posts"],
)

app.include_router(
    admin_projects_router,
    prefix="/api/v1",
    tags=["Admin Projects"],
)

app.include_router(
    admin_materials_router,
    prefix="/api/v1",
    tags=["Admin Materials"],
)

app.include_router(
    admin_leads_router,
    prefix="/api/v1",
    tags=["Admin Leads"],
)

app.include_router(
    admin_subscribers_router,
    prefix="/api/v1",
    tags=["Admin Subscribers"],
)

app.include_router(
    admin_stats_router,
    prefix="/api/v1",
    tags=["Admin Stats"],
)

app.include_router(
    admin_settings_router,
    prefix="/api/v1",
    tags=["Admin Settings"],
)

app.include_router(
    public_subscribers_router,
    prefix="/api/v1",
    tags=["Public Subscribers"],
)

app.include_router(
    users.router,
    prefix="/api/v1",
    tags=["Admin Users"],
)

app.include_router(
    auth.router,
    prefix="/api/v1",
)

app.include_router(admin_comments.router, prefix="/api/v1")
# =========================================================
# ROOT
# =========================================================

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "portfolio-api",
        "version": "1.0.0",
    }

@app.get("/health")
async def health():
    return {"status": "ok"}
