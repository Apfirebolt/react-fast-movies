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

    def to_dict(self):
        return {
            "id": self.id,
            "year": self.year,
            "title": self.title,
            "imdbID": self.imdbID,
            "type": self.type,
            "poster": self.poster,
        }


class Playlist(Base):
    __tablename__ = "playlist"

    id = Column(Integer, primary_key=True, autoincrement=True)
    createdDate = Column(DateTime, default=datetime.now)
    name = Column(String(50))
    owner_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))


class PlaylistMovie(Base):
    __tablename__ = "playlist_movie"

    id = Column(Integer, primary_key=True, autoincrement=True)
    createdDate = Column(DateTime, default=datetime.now)
    playlist_id = Column(Integer, ForeignKey("playlist.id", ondelete="CASCADE"))
    movie_id = Column(Integer, ForeignKey("movie.id", ondelete="CASCADE"))