import httpx
from typing import List
import schemas
from .base import BookProvider

class InternetArchiveProvider(BookProvider):
    async def search(self, query: str, limit: int = 20) -> List[schemas.BookDetails]:
        # Internet Archive Advanced Search API
        url = "https://archive.org/advancedsearch.php"
        
        # Format exactly as IA expects
        fq = f"{query} AND mediatype:(texts) AND language:(por)"
        
        params = {
            "q": fq,
            "fl[]": ["identifier", "title", "creator", "description", "downloads", "language"],
            "sort[]": "downloads desc",
            "rows": str(limit),
            "output": "json"
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, params=params, timeout=15.0)
                response.raise_for_status()
                data = response.json()
            except Exception as e:
                print(f"InternetArchive API error: {e}")
                return []

        results = []
        docs = data.get("response", {}).get("docs", [])
        
        for doc in docs:
            identifier = doc.get("identifier", "")
            if not identifier:
                continue
                
            book_id = f"ia_{identifier}"
            
            # Handle creator which can be a list or a string
            creator_data = doc.get("creator")
            if isinstance(creator_data, list):
                author_str = ", ".join(creator_data)
            elif isinstance(creator_data, str):
                author_str = creator_data
            else:
                author_str = "Unknown"
                
            # Cover URL - Archive uses a predictable format
            cover_url = f"https://archive.org/services/img/{identifier}"
            
            # Preview and Download URLs
            preview_url = f"https://archive.org/details/{identifier}?view=theater"
            # Link to the PDF version (requires knowing the exact file name usually, 
            # so we link to the download page or standard details page for safety)
            download_url = f"https://archive.org/download/{identifier}/{identifier}.pdf"

            # Summary handling (can be list or str)
            desc_data = doc.get("description")
            if isinstance(desc_data, list):
                summary_str = desc_data[0]
            elif isinstance(desc_data, str):
                summary_str = desc_data
            else:
                summary_str = "Disponível no Internet Archive."
                
            # Truncate summary if it's too long
            if len(summary_str) > 500:
                summary_str = summary_str[:497] + "..."

            book = schemas.BookDetails(
                id=book_id,
                title=doc.get("title", "Unknown Title"),
                author=author_str,
                language="pt",
                source="Internet Archive",
                download_url=download_url,
                preview_url=preview_url,
                cover_url=cover_url,
                summary=summary_str,
            )
            results.append(book)

        return results
