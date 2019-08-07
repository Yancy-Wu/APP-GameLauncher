"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ftp_1 = __importDefault(require("ftp"));
var config_1 = __importDefault(require("../config"));
var define_1 = __importDefault(require("../exceptions/define"));
function getDirs(callback) {
    var ftpClient = new ftp_1["default"]();
    ftpClient.on('ready', function () {
        ftpClient.list('/', function (_, list) {
            ftpClient.end();
            callback(list.map(function (v) { return v.name; }));
        });
    });
    ftpClient.on('error', function () {
        ftpClient.destroy();
        throw new Error(define_1["default"].connectFailed);
    });
    ftpClient.connect(config_1["default"].ftpProperty);
}
exports.getDirs = getDirs;
//# sourceMappingURL=ftp.js.map