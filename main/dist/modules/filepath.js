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
var os_1 = __importDefault(require("os"));
var config_1 = __importDefault(require("../config"));
var Store = __importStar(require("../base/store"));
function md5SavedPath(meta) {
    return path_1["default"].join(Store.get(config_1["default"].schema.gamePath), 'md5', meta.version);
}
exports.md5SavedPath = md5SavedPath;
function clientSavedPath(meta) {
    return path_1["default"].join(Store.get(config_1["default"].schema.installPath), meta.version + '.zip');
}
exports.clientSavedPath = clientSavedPath;
function patchSavedPath(meta) {
    return path_1["default"].join(Store.get(config_1["default"].schema.gamePath), 'patch', meta.version);
}
exports.patchSavedPath = patchSavedPath;
function metaSavedPath(version) {
    return path_1["default"].join(os_1["default"].tmpdir(), version + '.meta.json');
}
exports.metaSavedPath = metaSavedPath;
//# sourceMappingURL=filepath.js.map