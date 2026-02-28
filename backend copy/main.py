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
from providers.annas_archive import AnnasArchiveProvider

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Open Books Search Engine API")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

providers = [GutenbergProvider(), OpenLibraryProvider(), AnnasArchiveProvider()]


@app.get("/")
def read_root() -> dict:
    return {"message": "Welcome to the Open Books Search Engine API!"}


@app.get("/api/search", response_model=List[schemas.BookDetails])
async def search_books(
    query: str, limit: int = 20, db: Session = Depends(get_db)
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

    # Save to SQLite cache
    for book in all_books:
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

    return all_books[:limit]


@app.get("/api/books/{book_id}", response_model=schemas.BookDetails)
def get_book_details(book_id: str, db: Session = Depends(get_db)) -> Any:
    book = db.query(models.BookCache).filter(models.BookCache.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found in cache")
    return book


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
