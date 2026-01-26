from fastapi import APIRouter, Depends, Form, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.questions.models import Question
from app.videos.models import Video
from app.auth.permissions import admin_required
from app.auth.current_user import get_current_user

router = APIRouter(prefix="/questions", tags=["Questions"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/add")
def add_question(
    video_id: int = Form(...),
    question_text: str = Form(...),
    difficulty: str = Form("Medium"),
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    question = Question(
        video_id=video_id,
        question_text=question_text,
        difficulty=difficulty
    )

    db.add(question)
    db.commit()
    db.refresh(question)

    return {"message": "Question added successfully", "question_id": question.id}

@router.get("/video/{video_id}")
def get_questions_for_video(
    video_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    questions = db.query(Question).filter(Question.video_id == video_id).all()
    return questions

@router.post("/add")
def add_question(
    video_id: int = Form(...),
    question_text: str = Form(...),
    answer: str = Form(None),          # 👈 ADD THIS
    difficulty: str = Form("Medium"),
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    question = Question(
        video_id=video_id,
        question_text=question_text,
        answer=answer,                 # 👈 ADD THIS
        difficulty=difficulty
    )

    db.add(question)
    db.commit()
    db.refresh(question)

    return {"message": "Question added"}
