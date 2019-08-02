"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var download_1 = require("../base/download");
var Path = __importStar(require("./filepath"));
function downloadMd5File(meta) {
    var remotePath = meta.version + '/' + meta.md5ListFileUrl;
    var localPath = Path.md5SavedPath(meta);
    return download_1.download(remotePath, localPath);
}
exports.downloadMd5File = downloadMd5File;
function downloadClient(meta) {
    var remotePath = meta.version + '/' + meta.exeFileUrl;
    var localPath = Path.clientSavedPath(meta);
    return download_1.download(remotePath, localPath);
}
exports.downloadClient = downloadClient;
function downloadPatch(meta) {
    var remotePath = meta.version + '/' + meta.patchFileUrl;
    var localPath = Path.patchSavedPath(meta);
    return download_1.download(remotePath, localPath);
}
exports.downloadPatch = downloadPatch;
//# sourceMappingURL=download.js.map