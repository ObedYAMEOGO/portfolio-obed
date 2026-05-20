from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from sqlalchemy.future import select

from app.database import get_db

from app.models import (
    Project,
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

router = APIRouter(
    prefix="/admin/projects",
    tags=["Admin Projects"],
)


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
    return await (
        ProjectRepository.create(
            db,
            project,
        )
    )


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

    update_data = (
        payload.model_dump()
    )

    for key, value in (
        update_data.items()
    ):
        setattr(project, key, value)

    await db.commit()

    await db.refresh(project)

    return project


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