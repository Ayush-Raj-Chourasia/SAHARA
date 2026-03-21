import typing

def upgrade_fonts():
    file_path = "src/App.jsx"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Modern, big, premium font
    # Outfit is excellent for general UI
    outfit_import = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap"
    old_import = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap"
    
    content = content.replace(old_import, outfit_import)
    content = content.replace("'DM Sans',sans-serif", "'Outfit', sans-serif")
    content = content.replace("'Cormorant Garamond',serif", "'Outfit', sans-serif")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    upgrade_fonts()
    print("Fonts upgraded successfully!")
