import asyncio
from typing import List, Any

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import engine, get_db

from providers.gutenberg import GutenbergProvider
from providers.openlibrary import OpenLibraryProvider
from providers.internetarchive import InternetArchiveProvider
from providers.annasarchive import AnnasArchiveProvider

# We need threading to run bot polling concurrently with FastAPI
import threading
from bot import run_bot

models.Base.metadata.create_all(bind=engine)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # This runs when FastAPI starts
    bot_thread = threading.Thread(target=run_bot, daemon=True)
    bot_thread.start()
    yield
    # This runs when FastAPI stops (shutdown logic if needed)

app = FastAPI(title="Open Books Search Engine API", lifespan=lifespan)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

providers = [AnnasArchiveProvider(), GutenbergProvider(), OpenLibraryProvider(), InternetArchiveProvider()]


@app.get("/")
def read_root() -> dict:
    return {"message": "Welcome to the Open Books Search Engine API!"}


@app.get("/api/search", response_model=List[schemas.BookDetails])
async def search_books(
    query: str, limit: int = 60, db: Session = Depends(get_db)
) -> Any:
    # 1. Very simple cache check: if we already searched this query, we might have it stored.
    # For now, let's keep it simple: we fetch from providers and upsert to cache.
    # Real cache logic should be more robust, potentially a separate SearchCache table.

    tasks = [provider.search(query, limit) for provider in providers]
    provider_results = await asyncio.gather(*tasks, return_exceptions=True)

    all_books: List[schemas.BookDetails] = []

    for res in provider_results:
        if isinstance(res, Exception):
            print(f"Provider error: {res}")
            continue
        if isinstance(res, list):
            all_books.extend(res)

    final_books = all_books[:limit]

    # Save to SQLite cache
    for book in final_books:
        existing = (
            db.query(models.BookCache).filter(models.BookCache.id == book.id).first()
        )
        if not existing:
            new_book = models.BookCache(
                id=book.id,
                title=book.title,
                author=book.author,
                language=book.language,
                source=book.source,
                download_url=book.download_url,
                preview_url=book.preview_url,
                cover_url=book.cover_url,
                summary=book.summary,
            )
            db.add(new_book)
        else:
            # Update fields
            existing.title = book.title  # type: ignore[assignment]
            existing.cover_url = book.cover_url  # type: ignore[assignment]

    db.commit()

    return final_books


@app.get("/api/books/{book_id}", response_model=schemas.BookDetails)
def get_book_details(book_id: str, db: Session = Depends(get_db)) -> Any:
    book = db.query(models.BookCache).filter(models.BookCache.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found in cache")
    return book


@app.get("/api/categorias", response_model=schemas.CategoryList)
def get_categorias(db: Session = Depends(get_db)) -> dict:
    categories = db.query(models.Category).all()
    if not categories:
        default_categories = [
            models.Category(nome="Fantasia", cor="#8b5cf6", adulto=False),
            models.Category(nome="Dark", cor="#1f2937", adulto=True),
            models.Category(nome="Estudo", cor="#3b82f6", adulto=False)
        ]
        db.add_all(default_categories)
        db.commit()
        categories = db.query(models.Category).all()

    return {"categorias": categories}


@app.get("/api/categoria/{nome}", response_model=List[schemas.BookDetails])
async def search_books_by_category(
    nome: str, db: Session = Depends(get_db)
) -> Any:
    # Fetch up to 100 books for this category. We re-use the providers.
    query = f"subject:{nome}" if "openlibrary" in [p.__class__.__name__.lower() for p in providers] else nome
    limit = 100
    
    tasks = [provider.search(query, limit) for provider in providers]
    provider_results = await asyncio.gather(*tasks, return_exceptions=True)

    all_books: List[schemas.BookDetails] = []

    for res in provider_results:
        if isinstance(res, Exception):
            print(f"Provider error: {res}")
            continue
        if isinstance(res, list):
            all_books.extend(res)

    final_books = all_books[:limit]

    # Save to SQLite cache
    for book in final_books:
        existing = (
            db.query(models.BookCache).filter(models.BookCache.id == book.id).first()
        )
        if not existing:
            new_book = models.BookCache(
                id=book.id,
                title=book.title,
                author=book.author,
                language=book.language,
                source=book.source,
                download_url=book.download_url,
                preview_url=book.preview_url,
                cover_url=book.cover_url,
                summary=book.summary,
            )
            db.add(new_book)
        else:
            existing.title = book.title  # type: ignore[assignment]
            existing.cover_url = book.cover_url  # type: ignore[assignment]

    db.commit()

    return all_books


import json
import os

PRELOADED_BOOKS_PATH = os.path.join(os.path.dirname(__file__), "preloaded_books.json")

def load_preloaded_books():
    try:
        with open(PRELOADED_BOOKS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading preloaded books: {e}")
        return {"destaques": [], "fantasy": []}

@app.get("/api/destaques", response_model=List[schemas.BookDetails])
def get_destaques(db: Session = Depends(get_db)) -> Any:
    data = load_preloaded_books()
    return data.get("destaques", [])[:12]

@app.get("/api/fantasy-destaques", response_model=List[schemas.BookDetails])
def get_fantasy_destaques(db: Session = Depends(get_db)) -> Any:
    data = load_preloaded_books()
    return data.get("fantasy", [])[:30]


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
