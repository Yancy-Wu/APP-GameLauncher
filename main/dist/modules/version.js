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
var ftp_1 = require("../base/ftp");
var config_1 = __importDefault(require("../config"));
var Store = __importStar(require("../base/store"));
function getCurrentVersion() {
    var gamePath = Store.get(config_1["default"].schema.gamePath);
    var data = undefined;
    try {
        data = fs_1["default"].readFileSync(gamePath + path_1["default"].sep + 'version.txt').toString();
    }
    catch (err) {
        data = undefined;
    }
    ;
    return data;
}
exports.getCurrentVersion = getCurrentVersion;
function getToUpdateVersions(callback) {
    var version = getCurrentVersion();
    ftp_1.getDirs(function (dirNames) {
        dirNames.sort();
        callback(dirNames.slice(dirNames.indexOf(version) + 1));
    });
}
exports.getToUpdateVersions = getToUpdateVersions;
function getNewestClientVersion(callback) {
    ftp_1.getDirs(function (dirNames) {
        dirNames.sort();
        callback(dirNames[dirNames.length - 1]);
    });
}
exports.getNewestClientVersion = getNewestClientVersion;
//# sourceMappingURL=version.js.map