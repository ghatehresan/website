"""Serve the isolated, static concept preview. This is not the production site."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os


class PreviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("X-Robots-Tag", "noindex, nofollow, noarchive")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        super().end_headers()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "4173"))
    handler = partial(PreviewHandler, directory=str(Path(__file__).resolve().parent))
    server = ThreadingHTTPServer(("0.0.0.0", port), handler)
    print(f"Concept preview listening on 0.0.0.0:{port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
