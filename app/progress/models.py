from sqlalchemy import Column, Integer, ForeignKey, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class UserVideoProgress(Base):
    __tablename__ = "user_video_progress"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)

    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, server_default=func.now())
