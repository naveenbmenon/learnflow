from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session

from app.auth.utils import verify_password
from app.auth.jwt import create_access_token
from app.auth.deps import get_db
from app.users.models import User

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": user.email,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }
