"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ftp_1 = __importDefault(require("ftp"));
var config_1 = __importDefault(require("../config"));
var exceptions_1 = __importDefault(require("../exceptions"));
function getDirs(callback) {
    var ftpClient = new ftp_1["default"]();
    ftpClient.on('ready', function () {
        ftpClient.list('/', function (_, list) {
            callback(list.map(function (v) { return v.name; }));
            ftpClient.end();
        });
    });
    ftpClient.on('error', function (_) {
        ftpClient.destroy();
        throw new Error(exceptions_1["default"].ftpException.connect_failed);
    });
    ftpClient.connect(config_1["default"].ftpProperty);
}
exports.getDirs = getDirs;
//# sourceMappingURL=ftp.js.map