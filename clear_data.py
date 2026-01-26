from app.database import SessionLocal
from app.videos.models import Video
from app.questions.models import Question

db = SessionLocal()

db.query(Question).delete()
db.query(Video).delete()
db.commit()
db.close()

print("All videos and questions cleared.")
