import os

def build_standalone():
    # Read the JSX code
    with open('src/App.jsx', 'r', encoding='utf-8') as f:
        jsx_code = f.read()
    
    # Create the standalone HTML
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sahara Elderly Health Companion</title>
  
  <style>
    body {{
      margin: 0;
      padding: 0;
      font-family: 'Outfit', sans-serif;
    }}
  </style>

  <!-- React 18 UMD builds -->
  <script crossorigin src="https://unpkg.com/react@18.2.0/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js"></script>
  
  <!-- Babel Standalone (v7) -->
  <script src="https://unpkg.com/@babel/standalone@7.23.10/babel.min.js"></script>

  <!-- Puter.js for AI -->
  <script src="https://js.puter.com/v2/"></script>
</head>
<body>
  <div id="root"></div>

  <!-- Inline App Component (JSX) -->
  <script type="text/babel">
{jsx_code}
  </script>
  
  <!-- Render -->
  <script type="text/babel">
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<AppRoot />);
  </script>
</body>
</html>"""

    # Write the standalone file
    with open('sahara_standalone.html', 'w', encoding='utf-8') as f:
        f.write(html_content)

if __name__ == '__main__':
    build_standalone()
    print("Standalone file created!")
