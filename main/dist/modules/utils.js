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
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var config_1 = __importDefault(require("../config"));
var md5_1 = __importDefault(require("../func-int/md5"));
var unzip_1 = __importDefault(require("../func-ext/unzip"));
var define_1 = __importDefault(require("../exceptions/define"));
var Path = __importStar(require("./filepath"));
var Store = __importStar(require("../func-int/store"));
function checkExe(meta, callback) {
    return md5_1["default"](Path.clientSavedPath(meta), meta.exeMd5, callback);
}
exports.checkExe = checkExe;
function checkPatch(meta, callback) {
    return md5_1["default"](Path.patchSavedPath(meta), meta.patchMd5, callback);
}
exports.checkPatch = checkPatch;
function unzipClient(meta, callback) {
    return unzip_1["default"](Path.clientSavedPath(meta), callback);
}
exports.unzipClient = unzipClient;
function checkClient(meta, callback) {
    var stream = fs_1["default"].createReadStream(Path.md5SavedPath(meta));
    var base = Store.get(config_1["default"].schema.gamePath);
    stream.on('line', function (line) {
        var _a = line.split('\t'), rpath = _a[0], md5 = _a[1];
        md5_1["default"](path_1["default"].join(base, rpath), md5);
    });
    stream.on('end', function () { return callback(); });
    stream.on('error', function () { throw new Error(define_1["default"].unknow); });
}
exports.checkClient = checkClient;
//# sourceMappingURL=utils.js.map