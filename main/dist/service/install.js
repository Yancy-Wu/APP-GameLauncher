"use strict";
exports.__esModule = true;
var meta_1 = require("../modules/meta");
var download_1 = require("../modules/download");
var verify_1 = require("../modules/verify");
var version_1 = require("../modules/version");
var electron_1 = require("electron");
var Install = /** @class */ (function () {
    function Install(sender, onDone) {
        this.sender = sender;
        this.callback = onDone;
        this.installLogic('Indexing');
    }
    Install.prototype.installLogic = function (action) {
        var _this = this;
        switch (action) {
            case 'Indexing':
                version_1.getNewestClientVersion(function (version) {
                    var REPLY = {
                        type: 'info',
                        what: 'Indexing',
                        msg: '正在获取元数据, 请等待...',
                        progressCur: 0,
                        progressTotal: 0
                    };
                    _this.sender.send('install.reply', REPLY);
                    _this.version = version;
                    _this.installLogic('Connecting');
                });
                break;
            case 'Connecting':
                meta_1.downloadMeta(this.version, function (meta) {
                    var REPLY = {
                        type: 'abstract',
                        version: _this.version,
                        needDownload: meta.exeSizeBytes
                    };
                    _this.sender.send('install.reply', REPLY);
                    _this.meta = meta;
                    _this.downloadProgress = download_1.downloadClient(_this.meta);
                    _this.installLogic('Downloading');
                });
                break;
            case 'Downloading':
                this.timeId = setTimeout(function () {
                    var progress = _this.downloadProgress.progress / _this.meta.exeSizeBytes;
                    var REPLY = {
                        type: 'info',
                        what: 'Downloading',
                        msg: '正在下载数据中...',
                        downloadedBytes: _this.downloadProgress.progress,
                        done: _this.downloadProgress.done,
                        progressCur: progress,
                        progressTotal: progress * 0.9
                    };
                    _this.sender.send('install.reply', REPLY);
                    if (_this.downloadProgress.done) {
                        clearInterval(_this.timeId);
                        _this.installLogic('Verifying');
                    }
                    else
                        _this.installLogic('Downloading');
                }, 1000);
                break;
            case 'Verifying':
        }
    };
    return Install;
}());
electron_1.ipcMain.on('install', function (event) {
    version_1.getNewestClientVersion(function (version) {
        event.sender.send('install.reply', {
            type: 'info',
            what: 'Indexing',
            version: version,
            msg: '正在获取元数据, 请等待...'
        });
        meta_1.downloadMeta(version, function (meta) {
            event.sender.send('install.reply', {
                type: 'info',
                what: 'Connecting',
                msg: '正在连接服务器, 请等待...'
            });
            var info = download_1.downloadClient(meta);
            var id = setInterval(function () {
                event.sender.send('install.reply', {
                    type: 'info',
                    what: 'Downloading',
                    msg: '正在下载数据中...',
                    downloadedBytes: info.progress
                });
                if (info.done) {
                    clearInterval(id);
                    event.sender.send('install.reply', {
                        type: 'info',
                        what: 'Verifying',
                        msg: '校验数据中...'
                    });
                    verify_1.checkExe(meta, function (res) {
                        if (res) {
                            event.sender.send('install.reply', {
                                type: 'info',
                                what: 'Installing',
                                msg: '安装客户端中...'
                            });
                            verify_1.unzipClient(meta, function () {
                                event.sender.send('install.reply', {
                                    what: 'Done',
                                    type: 'info',
                                    msg: '完成'
                                });
                            });
                        }
                    });
                }
            }, 1000);
        });
    });
});
//# sourceMappingURL=install.js.map