"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_1 = __importDefault(require("fs"));
var filepath_1 = require("./filepath");
var download_1 = require("../ext/download");
var config_1 = __importDefault(require("../config"));
var version2MetaInfo = new Map();
function downloadMeta(version, callback) {
    var saved = version2MetaInfo.get(version);
    if (saved)
        callback(saved);
    var remotePath = version + '/' + config_1["default"].remoteMetaPath;
    var localPath = filepath_1.metaSavedPath(version);
    download_1.download(remotePath, localPath, function () {
        var meta = JSON.parse(fs_1["default"].readFileSync(localPath).toString());
        callback(meta);
        version2MetaInfo.set(version, meta);
    });
}
exports.downloadMeta = downloadMeta;
//# sourceMappingURL=meta.js.map