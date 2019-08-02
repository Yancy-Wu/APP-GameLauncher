"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var child_process_1 = __importDefault(require("child_process"));
var ERROR_UNKNOW = 1;
var ERROR_FILE_EXIST = 2;
var ERROR_NODISK = 3;
var ERROR_NOMEM = 4;
function patch(dir, patchFilePath, callback) {
    var patcher = child_process_1["default"].spawn('python', [
        '-m', 'patch', '--patch',
        '-r', dir,
        '-f', patchFilePath
    ], { cwd: '../server/' });
    patcher.on('close', function (code) {
        switch (code) {
            case 0: callback();
            default: throw new Error('PatchFailed');
        }
    });
}
exports.patch = patch;
//# sourceMappingURL=patch.js.map