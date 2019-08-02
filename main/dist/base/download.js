"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var child_process_1 = __importDefault(require("child_process"));
var path_1 = __importDefault(require("path"));
var electron_1 = require("electron");
var config_1 = __importDefault(require("../config"));
var ERROR_UNKNOW = 1;
var ERROR_LOCAL_FILE_EXIST = 2;
var ERROR_CONNECT_FAILED = 3;
function download(url, savedPath, onDone) {
    var info = {
        downloadedBytes: 0,
        done: false
    };
    var downloader = child_process_1["default"].spawn('python', [
        path_1["default"].join(electron_1.app.getAppPath(), '../server/ftp-download/main.py'),
        '-i', config_1["default"].ftpProperty.host,
        '-r', url,
        '-l', savedPath
    ]);
    downloader.stdout.on('data', function (data) {
        data = data.toString();
        data = JSON.parse(data);
        info.downloadedBytes = data['downloadedBytes'];
        info.done = data['done'] === 1;
    });
    downloader.on('close', function (code) {
        switch (code) {
            case 0:
                if (onDone)
                    onDone();
                break;
            case ERROR_LOCAL_FILE_EXIST:
                info.done = true;
                if (onDone)
                    onDone();
                break;
            default: throw new Error('DownloadFailed');
        }
    });
    return info;
}
exports.download = download;
//# sourceMappingURL=download.js.map