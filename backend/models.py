from sqlalchemy import Column, String, Text, DateTime, Integer, Boolean
from datetime import datetime
from database import Base


class BookCache(Base):
    __tablename__ = "books_cache"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String, index=True, nullable=True)
    language = Column(String, index=True, nullable=True)
    source = Column(String, index=True)
    download_url = Column(String, nullable=True)
    preview_url = Column(String, nullable=True)
    cover_url = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True, unique=True)
    cor = Column(String, nullable=True)
    adulto = Column(Boolean, default=False)
