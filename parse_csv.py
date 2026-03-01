import csv

path = r"C:\Users\samue\Documents\books_1.Best_Books_Ever.csv"

try:
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)
        print("HEADER:", header)
        
        fantasy_books = []
        for i, row in enumerate(reader):
            # Check if row has enough columns
            if len(row) > 1:
                # Assuming genre might be in one of the columns, let's just print a few rows first
                print(f"Row {i}:", row[:5]) # print first 5 columns of first 5 rows
                if i >= 4:
                    break
except Exception as e:
    print("Error:", e)
