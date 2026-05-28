from celery import Celery

from app.core.config import settings

from app.emails import (
    broadcast_new_post,
    broadcast_new_project,
    broadcast_new_material,
    send_welcome_email,
    send_lead_notification,
)

# =========================================================
# CELERY APP
# =========================================================

celery = Celery(
    "portfolio_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

# =========================================================
# CELERY CONFIG
# =========================================================

celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# =========================================================
# NEWSLETTER TASKS
# =========================================================


@celery.task(name="send_welcome_email_task")
def send_welcome_email_task(
    to_email: str,
):
    send_welcome_email(
        to_email
    )


# =========================================================
# LEAD TASK
# =========================================================


@celery.task(name="send_lead_notification_task")
def send_lead_notification_task(
    full_name: str,
    email: str,
    message: str,
):
    send_lead_notification(
        lead_name=full_name,
        lead_email=email,
        message=message,
    )

# =========================================================
# POST BROADCAST TASK
# =========================================================


@celery.task(name="broadcast_new_post_task")
def broadcast_new_post_task(
    subscriber_emails: list[str],
    post_title: str,
    post_summary: str,
    post_slug: str,
):
    broadcast_new_post(
        subscriber_emails=subscriber_emails,
        post_title=post_title,
        post_summary=post_summary,
        post_slug=post_slug,
    )


# =========================================================
# PROJECT BROADCAST TASK
# =========================================================


@celery.task(name="broadcast_new_project_task")
def broadcast_new_project_task(
    subscriber_emails: list[str],
    project_title: str,
    project_description: str,
    project_slug: str,
):
    broadcast_new_project(
        subscriber_emails=subscriber_emails,
        project_title=project_title,
        project_description=project_description,
        project_slug=project_slug,
    )


# =========================================================
# MATERIAL BROADCAST TASK
# =========================================================


@celery.task(name="broadcast_new_material_task")
def broadcast_new_material_task(
    subscriber_emails: list[str],
    material_title: str,
    material_description: str,
    material_slug: str,
):
    broadcast_new_material(
        subscriber_emails=subscriber_emails,
        material_title=material_title,
        material_description=material_description,
        material_slug=material_slug,
    )