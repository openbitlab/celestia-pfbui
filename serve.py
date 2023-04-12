import http.server
import http.client
import urllib.parse
from socketserver import ThreadingMixIn
import threading

PROXY_PORT = 8000
API_TARGET_PORT = 26659
API_ENDPOINT = "/api"


class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def _send_request(self, method):    	
        self.path = self.path[len(API_ENDPOINT):]
        url = f'http://localhost:{API_TARGET_PORT}{self.path}'
        parsed_url = urllib.parse.urlparse(url)
        target_host = parsed_url.netloc

        client = http.client.HTTPConnection(target_host)
        client.request(method, url, body=self.rfile.read(int(self.headers.get('Content-Length', 0))), headers=dict(self.headers))

        response = client.getresponse()
        self.send_response(response.status)
        for header, value in response.getheaders():
            self.send_header(header, value)
        self.end_headers()
        

        data = response.read()
        self.wfile.write(data)

    def serve_file(self, path):
        try:
            with open(path, 'rb') as file:
                self.send_response(200)
                self.send_header('Content-Type', 'text/html')
                self.end_headers()
                self.wfile.write(file.read())
        except IOError:
            self.send_error(404, "File not found")

    def do_GET(self):
        if self.path.startswith(API_ENDPOINT):
            self._send_request("GET")
        else:
            if self.path == "/":
                self.serve_file("index.html")
            elif self.path == "/app.js":
                self.serve_file("app.js")
            else:
                self.send_error(404, "Not Found")

    def do_POST(self):
        if self.path.startswith(API_ENDPOINT):
            self._send_request("POST")
        else:
            self.send_error(404, "Not Found")


class ThreadingServer(ThreadingMixIn, http.server.HTTPServer):
    pass


def run(server_class=ThreadingServer, handler_class=ProxyHandler, port=PROXY_PORT):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)

    httpd.protocol_version = "HTTP/1.1"

    print(f"Serving on port {port}...")
    httpd.serve_forever()


if __name__ == '__main__':
    run()
