import http.server
import socketserver
import json
import subprocess
from urllib.parse import parse_qs

PORT = 3000

HTML_CONTENT = """
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Termulator</title>
    <style>
    body {
        background-color: #1e1e1e;
        color: #f0f0f0;
        font-family: "Courier New", monospace;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        height: 100vh;
    }
    .terminal {
        flex-grow: 1;
        overflow-y: auto;
        padding: 20px;
        background-color: #000;
        border: 1px solid #333;
        border-radius: 5px;
        margin: 20px;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
    }
    .command-line {
        display: flex;
        padding: 10px 20px;
        background-color: #333;
    }
    #cmdInput {
        flex-grow: 1;
        background-color: #1e1e1e;
        border: none;
        color: #f0f0f0;
        font-family: "Courier New", monospace;
        font-size: 16px;
        padding: 10px;
        margin-right: 10px;
    }
    #runBtn {
        background-color: #4caf50;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        transition-duration: 0.4s;
    }
    #runBtn:hover {
        background-color: #45a049;
    }
    .output-line {
        margin: 5px 0;
        word-wrap: break-word;
    }
    .prompt {
        color: #4caf50;
        font-weight: bold;
    }
    </style>
</head>
<body>
    <div class="terminal" id="terminal"></div>
    <div class="command-line">
        <input type="text" id="cmdInput" placeholder="Type command here..." />
        <button id="runBtn" onclick="sendcom()">Run</button>
    </div>
    <script>
        const terminal = document.getElementById("terminal");
        const cmdInput = document.getElementById("cmdInput");

        function sendcom() {
            var command = cmdInput.value.trim();
            if (command.length > 0) {
                append('<span class="prompt">$ </span>' + command);
                fetch("/runCommand", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({ command: command }),
                })
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    if (data.output) {
                        append(data.output);
                    } else if (data.error) {
                        append('Error: ' + data.error);
                    }
                })
                .catch(function(error) {
                    append('Error: ' + error.message);
                });
                cmdInput.value = "";
            }
        }

        function append(content) {
            var line = document.createElement("div");
            line.className = "output-line";
            line.innerHTML = content;
            terminal.appendChild(line);
            terminal.scrollTop = terminal.scrollHeight;
        }

        cmdInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                sendcom();
            }
        });

        append('<span class="prompt">Welcome to Termulator.</span>');
        append('<span class="prompt">$ </span>');
    </script>
</body>
</html>
"""

class TermulatorHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(HTML_CONTENT.encode())

    def do_POST(self):
        if self.path == '/runCommand':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            command = json.loads(post_data.decode())['command']

            try:
                result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                output = result.stdout.decode()
                response = json.dumps({'output': output})
            except Exception as e:
                response = json.dumps({'error': str(e)})

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(response.encode())

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), TermulatorHandler) as httpd:
        print(f"Serving on port {PORT}")
        httpd.serve_forever()