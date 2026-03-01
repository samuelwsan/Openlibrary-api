import csv
import sqlite3
import uuid
from datetime import datetime

path = r"C:\Users\samue\Documents\books_1.Best_Books_Ever.csv"
db_path = r"c:\Users\samue\OneDrive\Music\OpenLibraryFREE\backend\books.db"

def import_destaques_books():
    print("Connecting to DB...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    top_books = []
    
    try:
        with open(path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                lang = row.get("language", "").lower()
                genres = row.get("genres", "").lower()
                
                if lang in ["portuguese", "pt", "pt-br"]:
                    cover = row.get("coverImg")
                    if cover and cover != "NaN" and "http" in cover:
                        book = {
                            "id": f"CSV_DESTAQUE_{row.get('bookId', uuid.uuid4())}",
                            "title": row.get("title"),
                            "author": row.get("author"),
                            "language": "pt",
                            "source": "csv_destaques",
                            "download_url": f"/?q={row.get('title')}", 
                            "preview_url": f"/?q={row.get('title')}",
                            "cover_url": cover,
                            "summary": row.get("description", "")
                        }
                        top_books.append(book)
                        
                if len(top_books) >= 30:
                    break

        print(f"Found {len(top_books)} Portuguese top books.")
        
        if top_books:
            cursor.execute("DELETE FROM books_cache WHERE id LIKE 'CSV_DESTAQUE_%'")
            
            for b in top_books:
                cursor.execute("""
                    INSERT OR REPLACE INTO books_cache 
                    (id, title, author, language, source, download_url, preview_url, cover_url, summary, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    b['id'], b['title'], b['author'], b['language'], b['source'], 
                    b['download_url'], b['preview_url'], b['cover_url'], b['summary'], datetime.utcnow()
                ))
            
            conn.commit()
            print("Successfully loaded general destaques into books_cache table!")

    except Exception as e:
        print("Error:", e)
    finally:
        conn.close()

if __name__ == "__main__":
    import_destaques_books()
