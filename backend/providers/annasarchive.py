import httpx
from typing import List
from bs4 import BeautifulSoup
import schemas
from .base import BookProvider

class AnnasArchiveProvider(BookProvider):
    async def search(self, query: str, limit: int = 20) -> List[schemas.BookDetails]:
        url = "https://annas-archive.gl/search"
        params = {"q": query}
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, params=params, headers=headers, timeout=15.0)
                response.raise_for_status()
                html = response.text
            except Exception as e:
                print(f"AnnasArchive scraping error: {e}")
                return []

        soup = BeautifulSoup(html, "html.parser")
        links = soup.select('a[href^="/md5/"]')
        
        results = []
        seen_md5s = set()
        
        for link in links:
            if len(results) >= limit:
                break
                
            href = link.get('href', '')
            md5 = href.split('/')[-1]
            if md5 in seen_md5s:
                continue
            
            # Finding the full book card container because html.parser breaks on nested <a> tags
            container = link.find_parent('div', class_=lambda c: c and 'mb-4' in c)
            if not container:
                container = link.find_parent('div', class_=lambda c: c and 'flex' in c) or link.parent
            
            # Finding cover image
            img = container.find('img')
            cover_url = img.get('src') if img else None
            
            # Grab all texts in the container
            texts = [t.strip() for t in container.stripped_strings if t.strip()]
            
            # Filter out UI elements and metadata
            valid_texts = []
            for t in texts:
                t_lower = t.lower()
                if 'base score' in t_lower or t == 'Save' or 'mb ·' in t_lower or 'read more…' in t_lower or t.startswith('✅') or t.startswith('🚀') or 'english [' in t_lower or 'portuguese [' in t_lower:
                    continue
                valid_texts.append(t)
                
            if not valid_texts:
                continue
                
            # If the first text is a raw filename or path, skip it
            first_text = valid_texts[0].lower()
            if 'upload/' in first_text or 'lgli/' in first_text or first_text.endswith(('.epub', '.pdf', '.mobi', '.azw3', '.lit', '.txt')):
                valid_texts = valid_texts[1:]
                
            if not valid_texts:
                continue
                
            title = valid_texts[0]
            author = valid_texts[1][:100] if len(valid_texts) > 1 else "Unknown Author"
            
            seen_md5s.add(md5)
            
            summary_str = " | ".join(valid_texts[:4]) if valid_texts else "Disponível no Anna's Archive."
            if len(summary_str) > 200:
                summary_str = summary_str[:197] + "..."

            detail_url = f"https://annas-archive.gl/md5/{md5}"
            
            book = schemas.BookDetails(
                id=f"aa_{md5}",
                title=title,
                author=author,
                language="pt", 
                source="Annas Archive",
                download_url=detail_url,
                preview_url=detail_url,
                cover_url=cover_url,
                summary=summary_str,
            )
            results.append(book)

        return results
