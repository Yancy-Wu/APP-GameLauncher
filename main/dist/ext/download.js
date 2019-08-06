"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var child_process_1 = __importDefault(require("child_process"));
var path_1 = __importDefault(require("path"));
var caller_1 = __importDefault(require("./caller"));
var config_1 = __importDefault(require("../config"));
var exceptions_1 = __importDefault(require("../exceptions"));
var electron_1 = require("electron");
function download(url, savedPath, callback) {
    return caller_1["default"](child_process_1["default"].spawn('python', [
        path_1["default"].join(electron_1.app.getAppPath(), config_1["default"].downloaderBinPath),
        '-i', config_1["default"].ftpProperty.host,
        '-r', url,
        '-l', savedPath
    ]), exceptions_1["default"].downloadException, callback);
}
exports.download = download;
//# sourceMappingURL=download.js.map