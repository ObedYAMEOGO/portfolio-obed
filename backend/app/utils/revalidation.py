import os
import httpx
import logging

logger = logging.getLogger(__name__)

async def trigger_frontend_revalidation(
    content_type: str = "all",
    slug: str = None
):
    """
    Trigger Next.js ISR revalidation on the frontend.
    
    Args:
        content_type: "posts", "projects", "materials", or "all"
        slug: Optional specific slug to revalidate
    """
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    revalidate_secret = os.getenv("REVALIDATE_SECRET", "revalidate")
    
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(
                f"{frontend_url}/api/revalidate",
                json={
                    "type": content_type,
                    "slug": slug,
                },
                headers={
                    "Authorization": f"Bearer {revalidate_secret}",
                },
            )
            logger.info(f"Triggered revalidation for {content_type}{f' - {slug}' if slug else ''}")
    except Exception as e:
        logger.error(f"Failed to trigger revalidation: {e}")
        # Don't raise - revalidation failure shouldn't block API response
