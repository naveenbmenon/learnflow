from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "supersecretkey"  # later move to env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 6

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
