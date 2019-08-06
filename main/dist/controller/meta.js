"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var download_1 = require("../base/download");
var version2MetaInfo = new Map();
function downloadMeta(version, callback) {
    var saved = version2MetaInfo.get(version);
    if (saved)
        callback(saved);
    var remotePath = version + '/meta.json ';
    var localPath = path_1["default"].join(os_1["default"].tmpdir(), version + '.meta.json');
    download_1.download(remotePath, localPath, function () {
        console.log(fs_1["default"].readFileSync(localPath).toString());
        var meta = JSON.parse(fs_1["default"].readFileSync(localPath).toString());
        callback(meta);
        version2MetaInfo.set(version, meta);
    });
}
exports.downloadMeta = downloadMeta;
//# sourceMappingURL=meta.js.map