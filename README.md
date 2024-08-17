# Termulator
Zero dependency, one file browser shell for Node.js, Python, and Minecraft mod jar (coming soon)

I only made this in 30 minutes (this is why the Termulator UI/UX is kinda shit) and for the purpose of having a shell for "free hosts" (you could do this on free Minecraft servers that allow custom jars, host Termulator on the specific port and have a shell). If you're actually looking to use this as some kind of good browser shell I recommend you find some other one, this was made for zero-setup shells on servers that don't give you shells.

Python's built in http.server module is used for the python version.

> Note: you can't do inputs after running the command, and you only see the output of the command once the ENTIRE command has ran. sudo commands don't work if theres a password, because of this restriction. If there isn't a persistant file storage system, new files/folders will probably delete after you create them using Termulator.

NodeJS instructions:

1. Download `app/index.js` from this repo (you don't need to download the app directory) and put it somewhere
2. Change config value within the file (line 3, change `//const port = 3000` to `const port = [SOME PORT HERE]`), or add a PORT env var, or don't do anything at all. Termulator will default to port `3000`, if the config wasn't changed or a port env var doesn't exist.
3. Run `node index.js` and the site is running.

Python:

1. Download `python/app.py` (no need to download the python dir) and put it on the server
2. Change line seven to a port number, the default value is `8000`.
3. Run the python file and Termulator will start.

Minecraft Mod Jar:

> Coming soon

Licensed under CC0 1.0 Universal cus I spent like half an hour on this for a specific case

---

(don't laugh, its minimal for a reason)


![skull](image.png)