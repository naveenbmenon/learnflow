from sqlalchemy import Column, Integer, String, ForeignKey ,Text
from app.database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"))
    question_text = Column(String, nullable=False)
    difficulty = Column(String, default="Medium")
    answer = Column(Text, nullable=True)

