# app/routers/admin/auth.py

from fastapi import APIRouter, Depends # type: ignore

from app.core.security import verify_admin

router = APIRouter(
    prefix="/admin/auth",
    tags=["Admin Auth"],
)


@router.get("/check-admin")
async def check_admin(
    _: dict = Depends(verify_admin),
):
    return {
        "success": True,
    }