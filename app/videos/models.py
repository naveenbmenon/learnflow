from sqlalchemy import Column, Integer, String, ForeignKey, DateTime , Boolean
from sqlalchemy.sql import func
from app.database import Base

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    video_path = Column(String, nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    # ✅ SOFT DELETE FLAG
    is_active = Column(Boolean, default=True)
    
