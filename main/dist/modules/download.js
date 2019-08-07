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
var fs_1 = __importDefault(require("fs"));
var download_1 = __importDefault(require("../func-ext/download"));
var config_1 = __importDefault(require("../config"));
var Path = __importStar(require("./filepath"));
function downloadMd5File(meta) {
    var remotePath = meta.version + '/' + meta.md5ListFileUrl;
    var localPath = Path.md5SavedPath(meta);
    return download_1["default"](remotePath, localPath);
}
exports.downloadMd5File = downloadMd5File;
function downloadClient(meta) {
    var remotePath = meta.version + '/' + meta.exeFileUrl;
    var localPath = Path.clientSavedPath(meta);
    return download_1["default"](remotePath, localPath);
}
exports.downloadClient = downloadClient;
function downloadPatch(meta) {
    var remotePath = meta.version + '/' + meta.patchFileUrl;
    var localPath = Path.patchSavedPath(meta);
    return download_1["default"](remotePath, localPath);
}
exports.downloadPatch = downloadPatch;
var version2MetaInfo = new Map();
function downloadMeta(version, callback) {
    var saved = version2MetaInfo.get(version);
    if (saved)
        callback(saved);
    var remotePath = version + '/' + config_1["default"].remoteMetaPath;
    var localPath = Path.metaSavedPath(version);
    download_1["default"](remotePath, localPath, function () {
        var meta = JSON.parse(fs_1["default"].readFileSync(localPath).toString());
        callback(meta);
        version2MetaInfo.set(version, meta);
    });
}
exports.downloadMeta = downloadMeta;
//# sourceMappingURL=download.js.map