"use strict";
exports.__esModule = true;
var electron_1 = require("../controller/electron");
var electron_2 = require("electron");
electron_2.ipcMain.on('ui.openDirDialog', function (event) {
    electron_1.openDirDialog(function (path) {
        event.sender.send('ui.openDirDialog.reply', {
            type: 'info',
            path: path
        });
    });
});
//# sourceMappingURL=ui.js.map