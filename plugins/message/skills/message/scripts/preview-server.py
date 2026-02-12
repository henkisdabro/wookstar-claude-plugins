#!/usr/bin/env python3
"""Minimal HTTP server for previewing Gmail HTML email drafts.

Serves a single HTML file on a random free port with idle auto-shutdown.
No pip dependencies - stdlib only.

Usage:
    python3 preview-server.py /path/to/email.html [--timeout 600]
"""

import argparse
import os
import signal
import socket
import sys
import threading
import time
from http.server import HTTPServer, BaseHTTPRequestHandler


def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("", 0))
        return s.getsockname()[1]


class SingleFileHandler(BaseHTTPRequestHandler):
    """Serves only the specified HTML file regardless of request path."""

    html_path = None
    last_request_time = None
    lock = threading.Lock()

    def do_GET(self):
        try:
            with open(self.html_path, "rb") as f:
                content = f.read()
        except FileNotFoundError:
            self.send_error(404, "File not found")
            return

        with self.lock:
            SingleFileHandler.last_request_time = time.time()

        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(content)

    def log_message(self, format, *args):
        pass  # Suppress request logging


def idle_watchdog(server, timeout):
    """Background thread that shuts down the server after idle timeout."""
    while True:
        time.sleep(10)
        with SingleFileHandler.lock:
            elapsed = time.time() - SingleFileHandler.last_request_time
        if elapsed >= timeout:
            print(f"\nIdle for {timeout}s - shutting down.", flush=True)
            server.shutdown()
            return


def main():
    parser = argparse.ArgumentParser(description="Preview HTML email drafts")
    parser.add_argument("file", help="Path to HTML file to serve")
    parser.add_argument(
        "--timeout",
        type=int,
        default=600,
        help="Idle timeout in seconds (default: 600)",
    )
    args = parser.parse_args()

    html_path = os.path.abspath(args.file)
    if not os.path.isfile(html_path):
        print(f"Error: {html_path} not found", file=sys.stderr)
        sys.exit(1)

    SingleFileHandler.html_path = html_path
    SingleFileHandler.last_request_time = time.time()

    port = find_free_port()
    server = HTTPServer(("127.0.0.1", port), SingleFileHandler)

    # Clean shutdown on signals
    def handle_signal(signum, frame):
        print("\nShutting down.", flush=True)
        threading.Thread(target=server.shutdown).start()

    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)

    # Start idle watchdog
    watchdog = threading.Thread(
        target=idle_watchdog, args=(server, args.timeout), daemon=True
    )
    watchdog.start()

    url = f"http://127.0.0.1:{port}/"
    print(url, flush=True)

    server.serve_forever()
    server.server_close()


if __name__ == "__main__":
    main()
