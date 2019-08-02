"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ftp_1 = __importDefault(require("ftp"));
var config_1 = __importDefault(require("../config"));
var ERROR_UNKNOW = 1;
var ERROR_CONNECT_FAILED = 2;
function getDirs(callback) {
    var ftpClient = new ftp_1["default"]();
    ftpClient.on('ready', function () {
        ftpClient.list('/', function (err, list) {
            if (err)
                throw err;
            callback(list.map(function (v) { return v.name; }));
        });
    });
    ftpClient.connect(config_1["default"].ftpProperty);
}
exports.getDirs = getDirs;
//# sourceMappingURL=ftp.js.map