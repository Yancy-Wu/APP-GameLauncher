"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var child_process_1 = __importDefault(require("child_process"));
var config_1 = __importDefault(require("../config"));
var electron_1 = require("electron");
var path_1 = __importDefault(require("path"));
var ERROR_UNKNOW = 1;
var ERROR_FILE_EXIST = 2;
var ERROR_NODISK = 3;
var ERROR_NOMEM = 4;
function patch(dir, patchFilePath, callback) {
    console.log(path_1["default"].join(electron_1.app.getAppPath(), config_1["default"].patchBinCwd));
    var patcher = child_process_1["default"].spawn('python', [
        '-m', 'patch', '--patch',
        '-s', dir,
        '-f', patchFilePath
    ], { cwd: path_1["default"].join(electron_1.app.getAppPath(), config_1["default"].patchBinCwd) });
    patcher.on('close', function (code) {
        console.log(code);
        switch (code) {
            case 0:
                callback();
                break;
            default: throw new Error('PatchFailed');
        }
    });
}
exports.patch = patch;
//# sourceMappingURL=patch.js.map