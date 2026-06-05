# backend/app/models.py

from enum import Enum as PyEnum
from datetime import datetime
import enum

from sqlalchemy import (  # type: ignore
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean,
    JSON,
    ForeignKey,
    func,
    Enum,
)

from sqlalchemy.orm import DeclarativeBase, relationship  # type: ignore # ← Add relationship here
from typing import List, Optional


class Base(DeclarativeBase):
    pass


# =========================================================
# BLOG CATEGORY ENUM
# =========================================================


class BlogCategory(str, enum.Enum):
    AI_ENGINEERING = "AI Engineering"
    LLMS = "LLMs"
    MACHINE_LEARNING = "Machine Learning"
    MLOPS = "MLOps"
    RAG = "RAG"
    AI_AGENTS = "AI Agents"
    INFERENCE = "Inference"
    INFRASTRUCTURE = "Infrastructure"
    RESEARCH = "Research"


# =========================================================
# SUBSCRIBERS
# =========================================================


class Subscriber(Base):
    __tablename__ = "subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# =========================================================
# PROJECTS
# =========================================================


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    tech_stack = Column(JSON, nullable=True)
    github_url = Column(String(255), nullable=True)
    live_url = Column(String(255), nullable=True)
    image_url = Column(Text, nullable=True)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# =========================================================
# LEADS
# =========================================================


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), index=True, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# =========================================================
# POSTS
# =========================================================


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    summary = Column(String, nullable=True)
    content = Column(String, nullable=False)
    category = Column(String, nullable=False)
    tags = Column(JSON, default=list)
    cover_image_url = Column(String, nullable=True)
    seo_title = Column(String, nullable=True)
    seo_description = Column(String, nullable=True)
    featured = Column(Boolean, default=False)
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime(timezone=True), nullable=True)
    reading_time = Column(Integer, nullable=False, default=1)
    author_name = Column(String, default="Obed Yameogo")
    author_initials = Column(String, default="OY")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), onupdate=func.now(), server_default=func.now()
    )

    author_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    author = relationship("User", back_populates="posts")


# =========================================================
# MATERIAL ENUMS
# =========================================================


class MaterialType(str, enum.Enum):
    DOCUMENT = "DOCUMENT"
    VIDEO = "VIDEO"


class VideoContext(str, enum.Enum):
    SINGLE = "SINGLE"
    PLAYLIST = "PLAYLIST"
    NONE = "NONE"


# =========================================================
# MATERIALS
# =========================================================


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    material_type = Column(
        Enum(MaterialType), nullable=False, default=MaterialType.DOCUMENT
    )
    video_context = Column(
        Enum(VideoContext), nullable=False, default=VideoContext.NONE
    )
    category = Column(String, nullable=False, default="General AI")
    resource_url = Column(String, nullable=False)
    thumbnail_url = Column(String, nullable=True)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())


# =========================================================
# SITE SETTINGS
# =========================================================


class SiteSettings(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    resume_url = Column(String, nullable=True)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


# =========================================================
# USERS
# =========================================================


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    clerk_id = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=True)
    receive_notifications = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_admin = Column(Boolean, default=False)

    # Relationship - posts authored by this user
    posts = relationship("Post", back_populates="author")


# =========================================================
# ADD THIS TO backend/app/models.py
# =========================================================


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    post_slug = Column(String, nullable=False, index=True)
    content = Column(Text, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_name = Column(String, nullable=False)
    user_avatar = Column(String, nullable=True)

    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True)

    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    author = relationship("User", foreign_keys=[user_id])
    replies = relationship(
        "Comment",
        primaryjoin="Comment.parent_id == Comment.id",
        foreign_keys="Comment.parent_id",
        back_populates="parent",
        lazy="noload",  # ← don't auto-load, we'll do it manually
    )
    parent = relationship(
        "Comment",
        primaryjoin="Comment.parent_id == Comment.id",
        foreign_keys="Comment.parent_id",
        back_populates="replies",
        remote_side="Comment.id",  # ← this is the fix
    )
    
class ReactionType(str, enum.Enum):
    LIKE       = "LIKE"        # 👍
    HEART      = "HEART"       # ❤️
    FIRE       = "FIRE"        # 🔥
    INSIGHTFUL = "INSIGHTFUL"  # 💡
 
 
class PostReaction(Base):
    __tablename__ = "post_reactions"
 
    id       = Column(Integer, primary_key=True, index=True)
    post_slug = Column(String, nullable=False, index=True)
    user_id  = Column(Integer, ForeignKey("users.id"), nullable=False)
    reaction  = Column(Enum(ReactionType), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
 
    author = relationship("User", foreign_keys=[user_id])
 
    # One reaction type per user per post
    __table_args__ = (
        __import__("sqlalchemy").UniqueConstraint(
            "post_slug", "user_id", "reaction",
            name="uq_post_reaction_user"
        ),
    )
 
