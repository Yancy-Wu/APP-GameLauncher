"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var crypto_1 = __importDefault(require("crypto"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var child_process_1 = __importDefault(require("child_process"));
var ERROR_UNKNOW = 1;
var ERROR_PERMISSION_DENY = 2;
var ERROR_NODISK = 3;
var ERROR_NOMEM = 4;
function unzip(filePath, callback) {
    var unzipper = child_process_1["default"].spawn('../external/7z', [
        'x', '-y', filePath,
        '-o' + path_1["default"].dirname(filePath)
    ]);
    unzipper.on('close', function (code) {
        switch (code) {
            case 0: callback();
            default: throw new Error('UnzipFailed');
        }
    });
}
exports.unzip = unzip;
function md5Check(filePath, md5, callback) {
    var md5sum = crypto_1["default"].createHash('md5');
    var stream = fs_1["default"].createReadStream(filePath);
    stream.on('data', function (chunk) {
        md5sum.update(chunk);
    });
    stream.on('end', function () {
        var str = md5sum.digest('hex').toUpperCase();
        callback(str == md5.toUpperCase());
    });
}
exports.md5Check = md5Check;
//# sourceMappingURL=utils.js.map