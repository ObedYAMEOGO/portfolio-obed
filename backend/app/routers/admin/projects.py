from typing import List

from fastapi import (  # type: ignore
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.ext.asyncio import (  # type: ignore
    AsyncSession,
)

from sqlalchemy.future import select  # type: ignore

from app.database import get_db

from app.models import (
    Project,
    User,
)

from app.schemas import (
    ProjectCreate,
    ProjectResponse,
)

from app.crud import (
    ProjectRepository,
)

from app.core.security import (
    verify_admin,
)

# =========================================================
# CELERY TASKS
# =========================================================

from app.tasks import (
    broadcast_new_project_task,
)

router = APIRouter(
    prefix="/admin/projects",
    tags=["Admin Projects"],
)


# =========================================================
# LIST PROJECTS
# =========================================================

@router.get(
    "",
    response_model=List[ProjectResponse],
)
async def list_projects(
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Project).order_by(
        Project.created_at.desc()
    )

    result = await db.execute(query)

    return result.scalars().all()


# =========================================================
# GET SINGLE PROJECT
# =========================================================

@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Project).where(
        Project.id == project_id
    )

    result = await db.execute(query)

    project = result.scalars().first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    return project


# =========================================================
# CREATE PROJECT
# =========================================================

@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_project(
    project: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    created_project = await (
        ProjectRepository.create(
            db,
            project,
        )
    )

    # =====================================================
    # SEND EMAIL IF PUBLISHED
    # =====================================================

    if created_project.is_published:

        users_query = select(User).where(
            User.receive_notifications == True
        )

        users_result = await db.execute(
            users_query
        )

        users = users_result.scalars().all()

        emails = [
            user.email
            for user in users
            if user.email
        ]

        if emails:
            broadcast_new_project_task.delay(
                subscriber_emails=emails,
                project_title=created_project.title,
                project_description=(
                    created_project.description
                    or ""
                ),
                # project_slug removed — projects link to /projects
            )

    return created_project


# =========================================================
# UPDATE PROJECT
# =========================================================

@router.put(
    "/{project_id}",
    response_model=ProjectResponse,
)
async def update_project(
    project_id: int,
    payload: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Project).where(
        Project.id == project_id
    )

    result = await db.execute(query)

    project = result.scalars().first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    was_published = (
        project.is_published
    )

    update_data = (
        payload.model_dump()
    )

    for key, value in (
        update_data.items()
    ):
        setattr(project, key, value)

    await db.commit()

    await db.refresh(project)

    # =====================================================
    # SEND EMAIL ONLY WHEN:
    # DRAFT -> PUBLISHED
    # =====================================================

    if (
        not was_published
        and project.is_published
    ):

        users_query = select(User).where(
            User.receive_notifications == True
        )

        users_result = await db.execute(
            users_query
        )

        users = users_result.scalars().all()

        emails = [
            user.email
            for user in users
            if user.email
        ]

        if emails:
            broadcast_new_project_task.delay(
                subscriber_emails=emails,
                project_title=project.title,
                project_description=(
                    project.description
                    or ""
                ),
                # project_slug removed — projects link to /projects
            )

    return project


# =========================================================
# DELETE PROJECT
# =========================================================

@router.delete(
    "/{project_id}",
    status_code=status.HTTP_200_OK,
)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Project).where(
        Project.id == project_id
    )

    result = await db.execute(query)

    project = result.scalars().first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    await db.delete(project)

    await db.commit()

    return {
        "success": True,
        "message": "Project deleted.",
    }