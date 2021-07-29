import { app, BrowserWindow } from "electron";
import * as path from "path"

let window: BrowserWindow;

app.on('ready', () => {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });
    window.loadFile(path.join(__dirname, '../src/index/index.html'));
});
