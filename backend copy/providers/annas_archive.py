import httpx
import re
from typing import List
import schemas
from .base import BookProvider


class AnnasArchiveProvider(BookProvider):
    def __init__(self):
        self.base_url = "https://annas-archive.li"
        self.source_name = "Anna's Archive"

    async def search(self, query: str, limit: int = 20) -> List[schemas.BookDetails]:
        url = f"{self.base_url}/search?q={query}"
        
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url, follow_redirects=True)
                response.raise_for_status()
                html = response.text
                
            books = self._parse_html(html)
            return books[:limit]
        except Exception as e:
            print(f"Error fetching from Anna's Archive: {e}")
            return []

    def _parse_html(self, html: str) -> List[schemas.BookDetails]:
        books = []
        # split by item container
        parts = html.split('<div class="flex  pt-3 pb-3 border-b')
        if len(parts) < 2:
            return books
            
        parts = parts[1:]

        for p in parts:
            # md5
            md5_match = re.search(r'href="/md5/([^"]+)"', p)
            if not md5_match: continue
            md5 = md5_match.group(1)
            
            # cover
            cover_match = re.search(r'<img[^>]+src="([^"]+)"', p)
            cover_url = cover_match.group(1) if cover_match else None
            if cover_url and cover_url.startswith('/'):
                cover_url = self.base_url + cover_url
                
            # title
            title_match = re.search(r'<h3[^>]*>(.*?)</h3>', p)
            if not title_match:
                title_match = re.search(r'data-content="([^"]+)"', p)
                title = title_match.group(1) if title_match else "Unknown Title"
            else:
                title = re.sub(r'<[^>]+>', '', title_match.group(1)).strip()
                
            # author
            author = "Unknown Author"
            author_matches = re.findall(r'<div class="font-bold[^>]*data-content="([^"]+)"', p)
            if len(author_matches) > 1:
                author = author_matches[1]
            else:
                am = re.search(r'<div class="max-lg:line-clamp-\[2\] lg:truncate leading-\[1\.2\] lg:leading-\[1\.2\] text-xs lg:text-sm text-gray-500 italic">(.*?)</div>', p)
                if am:
                    author = re.sub(r'<[^>]+>', '', am.group(1)).strip()
                    
            # language and summary
            summary_match = re.search(r'<div class="truncate text-xs text-gray-500">(.*?)</div>', p)
            summary = re.sub(r'<[^>]+>', '', summary_match.group(1)).strip() if summary_match else ""
            
            lang = "en"
            if summary:
                if "Portuguese" in summary or "pt" in summary: lang = "pt"
                
            books.append(
                schemas.BookDetails(
                    id=f"anna_{md5}",
                    title=title,
                    author=author,
                    language=lang,
                    source=self.source_name,
                    download_url=f"{self.base_url}/md5/{md5}",
                    preview_url=f"{self.base_url}/md5/{md5}",
                    cover_url=cover_url,
                    summary=summary
                )
            )
            
        return books
