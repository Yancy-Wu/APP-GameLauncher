"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var child_process_1 = __importDefault(require("child_process"));
var path_1 = __importDefault(require("path"));
var caller_1 = __importDefault(require("./caller"));
var config_1 = __importDefault(require("../config"));
var define_1 = __importDefault(require("../exceptions/define"));
function default_1(filePath, callback) {
    return caller_1["default"](child_process_1["default"].spawn(config_1["default"].unzipBinPath, [
        'x', '-y', '-t7z', filePath,
        '-o' + path_1["default"].dirname(filePath)
    ]), define_1["default"].unzipException, callback, function (data) {
        var str = data.toString();
        var progress = str.match(/[0-9]*\%$/g);
        return progress ? progress[0] : '';
    });
}
exports["default"] = default_1;
//# sourceMappingURL=unzip.js.map