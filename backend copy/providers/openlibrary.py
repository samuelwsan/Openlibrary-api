import httpx
from typing import List
import schemas
from .base import BookProvider


class OpenLibraryProvider(BookProvider):
    async def search(self, query: str, limit: int = 20) -> List[schemas.BookDetails]:
        # Open Library search API
        # We enforce language:por
        # To avoid borrowing queue ("embargos"), we might look for items with full text available that are public
        url = "https://openlibrary.org/search.json"
        params = {"q": query, "language": "por", "has_fulltext": "true", "limit": str(limit)}

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                data = response.json()
            except Exception as e:
                print(f"OpenLibrary API error: {e}")
                return []

        results = []
        for doc in data.get("docs", []):
            # Check availability if possible, avoiding "borrow" only books
            # For simplicity, we assume `has_fulltext` provides at least a viewable version.
            # To be strictly public domain, Open Library relies on publication year usually, but we filter cautiously.

            # For ENEM/Vestibular, older classics are usually public domain.

            book_id = f"ol_{doc.get('key', '').replace('/works/', '')}"
            authors = doc.get("author_name", [])
            author_str = ", ".join(authors) if authors else "Unknown"

            # Build cover URL
            cover_i = doc.get("cover_i")
            cover_url = (
                f"https://covers.openlibrary.org/b/id/{cover_i}-L.jpg"
                if cover_i
                else None
            )

            # The URL to read or preview
            preview_url = f"https://openlibrary.org{doc.get('key', '')}"

            book = schemas.BookDetails(
                id=book_id,
                title=doc.get("title", ""),
                author=author_str,
                language="pt",
                source="Open Library",
                download_url=None,  # Open Library usually requires read inside the browser
                preview_url=preview_url,
                cover_url=cover_url,
                summary=(
                    f"Disponível no Open Library. Editora: {doc.get('publisher', [''])[0]}"
                    if doc.get("publisher")
                    else "Disponível no Open Library."
                ),
            )
            results.append(book)

        return results
