/* ******** CONFIG ******** */

//const port = 3000

/* ******** END CONFIG ******** */

const http = require("http");
/*const fs = require("fs");
const path = require("path");*/
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

const server = http.createServer((req, res) => {
  if (req.url === "/") {

    const content = `
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
            <input
                type="text"
                id="cmdInput"
                placeholder="Type command here..."
            />
            <button id="runBtn" onclick="sendcom()">Run</button>
        </div>
        <script>
            const terminal = document.getElementById("terminal");
            const cmdInput = document.getElementById("cmdInput");

            function sendcom() {
                var command = cmdInput.value.trim();
                if (command.length > 0) {

                    appendix('<span class="prompt">$ </span>' + command);
                    fetch("/runCommand", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ command: command }),
                    })
                        .then(function(response) { return response.json(); })
                        .then(function(data) {
                            if (data.output) {

                                appendix(data.output);
                            } else if (data.error) {
                                appendix('Error: ' + data.error);
                            }
                        })
                        .catch(function(error) {
                            appendix('Error: ' + error.message);
                        });
                    cmdInput.value = "";
                }
            }

            function appendix(content) {
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

            appendix('<span class="prompt">Welcome to Termulator.</span>');
            appendix('<span class="prompt">$ </span>');
        </script>
    </body>
</html>
`
    /*
    fs.readFile(path.join(__dirname, "public", "index.html"), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading index.html");
      } else {*/
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      //}
    //});
  } else if (req.url === "/runCommand" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const command = JSON.parse(body).command;
      console.log(`Executing command: ${command}`);
      try {
        const result = await exec(command);
        const output = result.stdout;
        console.log(output);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ output }));
      } catch (error) {
        console.error(`Error executing command: ${error.message}`);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

const portExists = typeof port !== 'undefined' && port !== null;
const PORT = portExists ? port : process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));