from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, ForeignKey, Text, DateTime, Integer

from backend.db import Base


class Movie(Base):
    __tablename__ = "movie"

    id = Column(Integer, primary_key=True, autoincrement=True)
    createdDate = Column(DateTime, default=datetime.now)
    year = Column(String(50))
    title = Column(String(50))
    imdbID = Column(String(50), unique=True)
    type = Column(String(50))
    poster = Column(Text)
    owner_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))

    owner = relationship("User", back_populates="movies")


