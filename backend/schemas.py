from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class BookBase(BaseModel):
    id: str
    title: str
    author: Optional[str] = None
    language: Optional[str] = None
    source: str
    download_url: Optional[str] = None
    preview_url: Optional[str] = None
    cover_url: Optional[str] = None
    summary: Optional[str] = None

    class Config:
        from_attributes = True


class BookDetails(BookBase):
    pass


class BookCache(BookBase):
    created_at: datetime


class CategoryBase(BaseModel):
    nome: str
    cor: Optional[str] = None
    adulto: Optional[bool] = False


class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class CategoryList(BaseModel):
    categorias: List[Category]
