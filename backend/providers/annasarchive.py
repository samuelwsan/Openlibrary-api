import httpx
from typing import List
from bs4 import BeautifulSoup
import schemas
from .base import BookProvider

class AnnasArchiveProvider(BookProvider):
    async def search(self, query: str, limit: int = 20) -> List[schemas.BookDetails]:
        url = "https://annas-archive.li/search"
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
            
            # Usually, there's a parent container (div or li) holding both the cover link and the info link
            parent = link.find_parent('div', class_=lambda c: c and ('flex' in c or 'relative' in c)) or link.parent
            if not parent:
                continue
            
            # Finding cover image
            img = parent.find('img')
            cover_url = img.get('src') if img else None
            
            # The title is usually in an h3, or it's the text of an <a> tag that is NOT the cover <a> tag
            title = "Unknown Title"
            author = "Unknown Author"
            
            # Grab all texts in the parent
            texts = [t.strip() for t in parent.stripped_strings if t.strip()]
            
            h3 = parent.find('h3')
            if h3:
                title = h3.get_text(strip=True)
                nxt = h3.find_next_sibling('div')
                if nxt:
                    author = nxt.get_text(strip=True)
            else:
                # If no h3 is found, look for texts. Often title is prominent. Let's just grab the first non-empty text that isn't too short
                valid_texts = [t for t in texts if len(t) > 2]
                if valid_texts:
                    title = valid_texts[0]
                if len(valid_texts) > 1:
                    author = valid_texts[1][:100]
                    
            if title == "Unknown Title" or not title:
                continue # skip if we really can't find a title
                
            seen_md5s.add(md5)
            
            summary_str = " | ".join(texts[:5]) if texts else "Disponível no Anna's Archive."
            if len(summary_str) > 200:
                summary_str = summary_str[:197] + "..."

            detail_url = f"https://annas-archive.li/md5/{md5}"
            
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
