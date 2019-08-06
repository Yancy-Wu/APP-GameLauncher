"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
// Modules to control application life and create native browser window
var electron_1 = require("electron");
var global_1 = __importStar(require("./global"));
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', global_1.init);
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (global_1["default"] === null)
        global_1.init();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
require("./service/info");
require("./service/install");
require("./service/ui");
require("./service/update");
//test
var ftp_1 = require("./base/ftp");
ftp_1.getDirs(function () { console.log('ssss'); });
//# sourceMappingURL=main.js.map