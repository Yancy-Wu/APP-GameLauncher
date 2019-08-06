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
function patch(dir, patchFilePath, callback) {
    return caller_1["default"](child_process_1["default"].spawn('python', [
        '-m', 'patch', '--patch',
        '-s', dir,
        '-f', patchFilePath
    ], { cwd: path_1["default"].join(electron_1.app.getAppPath(), config_1["default"].patchBinCwd) }), exceptions_1["default"].patchException, callback);
}
exports.patch = patch;
//# sourceMappingURL=patch.js.map