import httpx
from typing import List
import schemas
from .base import BookProvider


class GutenbergProvider(BookProvider):
    async def search(self, query: str, limit: int = 20) -> List[schemas.BookDetails]:
        url = "https://gutendex.com/books/"
        # We search with specifically portuguese Language filter as requested
        params = {"search": query, "languages": "pt"}

        async with httpx.AsyncClient() as client:
            try:
                # We use a 10 second timeout
                response = await client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                data = response.json()
            except Exception as e:
                print(f"Gutenberg API error: {e}")
                return []

        results = []
        for item in data.get("results", [])[:limit]:
            authors = [a["name"] for a in item.get("authors", [])]
            author_str = ", ".join(authors) if authors else "Unknown"

            # format IDs to be globally unique
            book_id = f"gutenberg_{item['id']}"

            formats = item.get("formats", {})
            # Prefer epub, then html for download url
            download_url = formats.get("application/epub+zip") or formats.get(
                "text/html"
            )
            preview_url = formats.get("text/html")
            cover_url = formats.get("image/jpeg")

            book = schemas.BookDetails(
                id=book_id,
                title=item.get("title", ""),
                author=author_str,
                language="pt",
                source="Project Gutenberg",
                download_url=download_url,
                preview_url=preview_url,
                cover_url=cover_url,
                summary=f"Público e gratuito no Projeto Gutenberg. Formatos disponíveis: {', '.join(formats.keys())}",
            )
            results.append(book)
        return results
