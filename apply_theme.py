import os

replacements = {
    "purple-600": "red-600",
    "purple-500": "red-600",
    "purple-400": "red-500",
    "indigo-500": "red-700",
    "indigo-600": "red-600",
    "blue-500": "red-600",
    "blue-600": "red-700",
    "purple-900": "red-900",
    "purple-200": "red-200",
    "bg-[#0a0a0a]": "bg-[#141414]",
    "bg-[#0f0f0f]": "bg-[#141414]",
    "bg-gray-900": "bg-[#141414]",
    "dark:bg-gray-900": "dark:bg-[#141414]",
    "dark:bg-[#0a0a0a]": "dark:bg-[#141414]",
    "from-purple-600": "from-red-600",
    "to-indigo-600": "to-red-800",
    "to-blue-500": "to-red-500",
    "from-purple-500/10": "from-red-600/10",
    "via-indigo-500/5": "via-red-800/5",
    "shadow-purple-500/30": "shadow-red-600/30",
    "text-purple-600": "text-red-600",
    "border-purple-600": "border-red-600",
    "ring-purple-500": "ring-red-600"
}

frontend_dir = r"c:\Users\samue\OneDrive\Music\OpenLibraryFREE\frontend\src"

for root, _, files in os.walk(frontend_dir):
    for f in files:
        if f.endswith(".tsx") or f.endswith(".ts") or f.endswith(".css"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                content = file.read()
                
            orig_content = content
            for k, v in replacements.items():
                content = content.replace(k, v)
                
            if content != orig_content:
                with open(path, "w", encoding="utf-8") as file:
                    file.write(content)
                print(f"Updated {os.path.basename(path)}")
