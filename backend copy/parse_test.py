import re
import json

with open("test_anna.html", "r", encoding="utf-8") as f:
    html = f.read()

books = []
# split by item container
parts = html.split('<div class="flex  pt-3 pb-3 border-b')[1:]

for p in parts:
    # md5
    md5_match = re.search(r'href="/md5/([^"]+)"', p)
    if not md5_match: continue
    md5 = md5_match.group(1)
    
    # cover
    cover_match = re.search(r'<img[^>]+src="([^"]+)"', p)
    cover_url = cover_match.group(1) if cover_match else None
    
    # title
    title_match = re.search(r'<h3[^>]*>(.*?)</h3>', p)
    if not title_match:
        # fallback to data-content
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
        # try to find italic div
        am = re.search(r'<div class="max-lg:line-clamp-\[2\] lg:truncate leading-\[1\.2\] lg:leading-\[1\.2\] text-xs lg:text-sm text-gray-500 italic">(.*?)</div>', p)
        if am:
            author = re.sub(r'<[^>]+>', '', am.group(1)).strip()
            
    # language and extension usually in a gray div
    summary_match = re.search(r'<div class="truncate text-xs text-gray-500">(.*?)</div>', p)
    summary = re.sub(r'<[^>]+>', '', summary_match.group(1)).strip() if summary_match else ""
    
    lang = "en"
    if summary:
        if "Portuguese" in summary or "pt" in summary: lang = "pt"
        
    books.append({
        "id": f"anna_{md5}",
        "title": title,
        "author": author,
        "language": lang,
        "source": "Anna's Archive",
        "download_url": f"https://annas-archive.li/md5/{md5}",
        "preview_url": f"https://annas-archive.li/md5/{md5}",
        "cover_url": cover_url,
        "summary": summary
    })
    
print(json.dumps(books[:3], indent=2))
