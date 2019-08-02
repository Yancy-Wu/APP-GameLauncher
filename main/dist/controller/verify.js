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
var Path = __importStar(require("./filepath"));
var Store = __importStar(require("../base/store"));
var Utils = __importStar(require("../base/utils"));
function checkPatch(meta, callback) {
    Utils.md5Check(Path.patchSavedPath(meta), meta.patchMd5, callback);
}
exports.checkPatch = checkPatch;
function unzipClient(meta, callback) {
    Utils.unzip(Path.clientSavedPath(meta), callback);
}
exports.unzipClient = unzipClient;
function checkClient(meta, callback) {
    var stream = fs_1["default"].createReadStream(Path.md5SavedPath(meta));
    var base = Store.get(config_1["default"].schema.gamePath);
    stream.on('line', function (line) {
        var _a = line.split('\t'), rpath = _a[0], md5 = _a[1];
        Utils.md5Check(path_1["default"].join(base, rpath), md5, function (res) {
            if (!res) {
                callback(false);
                stream.destroy();
            }
        });
    });
    stream.on('end', function () {
        callback(true);
    });
}
exports.checkClient = checkClient;
//# sourceMappingURL=verify.js.map