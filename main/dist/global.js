"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var mainWindow = null;
exports["default"] = mainWindow;
function init() {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // and load the index.html of the app.
    //mainWindow.loadFile('index.html')
    // and load the index.html of the app.
    //mainWindow.loadFile('./build/index.html')
    mainWindow.loadURL('http://localhost:3000/');
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}
exports.init = init;
//# sourceMappingURL=global.js.map