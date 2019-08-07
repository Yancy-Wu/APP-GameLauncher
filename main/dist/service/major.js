"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var electron_1 = require("electron");
var install_1 = __importDefault(require("../logic/install"));
var update_1 = __importDefault(require("../logic/update"));
electron_1.ipcMain.on('install', function (event) { return new install_1["default"](event.sender, 'install'); });
electron_1.ipcMain.on('update', function (event) { return new update_1["default"](event.sender, 'update'); });
//# sourceMappingURL=major.js.map