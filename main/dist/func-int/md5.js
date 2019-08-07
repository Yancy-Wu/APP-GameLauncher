"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var crypto_1 = __importDefault(require("crypto"));
var fs_1 = __importDefault(require("fs"));
var define_1 = __importDefault(require("../exceptions/define"));
function default_1(filePath, md5, callback) {
    var info = {
        progress: 0,
        done: false
    };
    var size = fs_1["default"].statSync(filePath).size;
    var md5sum = crypto_1["default"].createHash('md5');
    var stream = fs_1["default"].createReadStream(filePath);
    stream.on('data', function (chunk) {
        info.progress = (stream.bytesRead / size) * 100;
        md5sum.update(chunk);
    });
    stream.on('end', function () {
        var str = md5sum.digest('hex').toUpperCase();
        stream.close();
        if (str !== md5.toUpperCase())
            throw new Error(define_1["default"].md5CheckFailed);
        info.done = true;
        if (callback)
            callback();
    });
    stream.on('error', function () {
        stream.close();
        throw new Error(define_1["default"].unknow);
    });
    return info;
}
exports["default"] = default_1;
//# sourceMappingURL=md5.js.map