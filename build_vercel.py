import os

# Create API directory
os.makedirs("api", exist_ok=True)

# Read monolithic server
with open("server.py", "r", encoding="utf-8") as f:
    code = f.read()

# Port proxy class to Vercel Serverless 'handler' definition
code = code.replace("class ProxyHTTPRequestHandler(SimpleHTTPRequestHandler):", "from http.server import BaseHTTPRequestHandler\nclass handler(BaseHTTPRequestHandler):")

# Disable recursive static file serving inside the API handler (Vercel edge caches this)
code = code.replace("super().do_GET()", "self.send_error(404, 'Vercel API Edge endpoint')")

# Write to Vercel endpoint
with open("api/index.py", "w", encoding="utf-8") as f:
    f.write(code)

# Write Vercel config
vercel_config = """{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.py" }
  ]
}"""

with open("vercel.json", "w", encoding="utf-8") as f:
    f.write(vercel_config)

# Write empty requirements (only native modules utilized)
with open("requirements.txt", "w", encoding="utf-8") as f:
    f.write("")

print("Vercel Architecture Porting Complete.")
