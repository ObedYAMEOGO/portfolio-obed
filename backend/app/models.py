from enum import Enum as PyEnum
from datetime import datetime, timezone
import enum

from sqlalchemy import (  # type: ignore
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean,
    JSON,
    func,
    Enum,
)

from sqlalchemy.orm import DeclarativeBase  # type: ignore


class Base(DeclarativeBase):
    pass


class Subscriber(Base):
    __tablename__ = "subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


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


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), index=True, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    feature_image_url = Column(Text, nullable=True)
    category = Column(String(100), default="Research")
    is_published = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class MaterialType(str, enum.Enum):
    DOCUMENT = "DOCUMENT"
    VIDEO = "VIDEO"


# New Enum tracking video arrangement type
class VideoContext(str, enum.Enum):
    SINGLE = "SINGLE"
    PLAYLIST = "PLAYLIST"
    NONE = "NONE"  # Fallback designation for pure Text Documents


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)

    material_type = Column(
        Enum(MaterialType), nullable=False, default=MaterialType.DOCUMENT
    )
    # Target column ensuring structural flexibility
    video_context = Column(
        Enum(VideoContext), nullable=False, default=VideoContext.NONE
    )

    category = Column(String, nullable=False, default="General AI")
    resource_url = Column(
        String, nullable=False
    )  # Maps to single YouTube link OR specific Playlist layout URL
    thumbnail_url = Column(String, nullable=True)

    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())


class SiteSettings(Base):
    __tablename__ = "site_settings"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    resume_url = Column(
        String,
        nullable=True,
    )

    updated_at = Column(
        DateTime(
            timezone=True,
        ),
        server_default=func.now(),
        onupdate=func.now(),
    )


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    clerk_id = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    full_name = Column(
        String,
        nullable=True,
    )

    receive_notifications = Column(
        Boolean,
        default=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )
    
    is_admin = Column(
        Boolean,
        default=False,
    )
