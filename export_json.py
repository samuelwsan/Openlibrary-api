import sqlite3
import json
conn = sqlite3.connect(r'c:\Users\samue\OneDrive\Music\OpenLibraryFREE\backend\books.db')
conn.row_factory = sqlite3.Row
c = conn.cursor()

c.execute("SELECT * FROM books_cache WHERE source='csv_destaques'")
destaques = [dict(row) for row in c.fetchall()]

c.execute("SELECT * FROM books_cache WHERE source='csv_best_books'")
fantasy = [dict(row) for row in c.fetchall()]

data = {'destaques': destaques, 'fantasy': fantasy}

with open(r'c:\Users\samue\OneDrive\Music\OpenLibraryFREE\backend\preloaded_books.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print('Exported', len(destaques), 'destaques and', len(fantasy), 'fantasy books to JSON')
