"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var electron_1 = require("electron");
var global_1 = __importDefault(require("../global"));
function openDirDialog(callback) {
    electron_1.dialog.showOpenDialog(global_1["default"], {
        defaultPath: electron_1.app.getAppPath(),
        properties: ['openDirectory']
    }, function (path) { return callback(path ? path[0] : undefined); });
}
exports.openDirDialog = openDirDialog;
//# sourceMappingURL=electron.js.map