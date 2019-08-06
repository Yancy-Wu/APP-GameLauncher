"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var version_1 = require("../modules/version");
var electron_1 = require("electron");
var config_1 = __importDefault(require("../config"));
var Store = __importStar(require("../base/store"));
electron_1.ipcMain.on('info.getAppPath', function (event) {
    event.returnValue = electron_1.app.getAppPath();
});
electron_1.ipcMain.on('info.getCurrentVersion', function (event) {
    event.returnValue = version_1.getCurrentVersion();
});
electron_1.ipcMain.on('info.getInstallPath', function (event) {
    event.returnValue = Store.get(config_1["default"].schema.installPath);
});
electron_1.ipcMain.on('info.setInstallPath', function (event, path) {
    event.returnValue = Store.set(config_1["default"].schema.installPath, path);
});
electron_1.ipcMain.on('info.getGamePath', function (event) {
    event.returnValue = Store.get(config_1["default"].schema.gamePath);
});
electron_1.ipcMain.on('info.setGamePath', function (event, path) {
    event.returnValue = Store.set(config_1["default"].schema.gamePath, path);
});
//# sourceMappingURL=info.js.map