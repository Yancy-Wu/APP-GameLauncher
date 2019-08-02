"use strict";
exports.__esModule = true;
var meta_1 = require("../controller/meta");
var download_1 = require("../controller/download");
var verify_1 = require("../controller/verify");
var version_1 = require("../controller/version");
var electron_1 = require("electron");
electron_1.ipcMain.on('install', function (event) {
    version_1.getNewestClientVersion(function (version) {
        event.sender.send('install.reply', {
            type: 'info',
            what: 'Indexing',
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
                    downloadedBytes: info.downloadedBytes
                });
                if (info.done) {
                    clearInterval(id);
                    event.sender.send('install.reply', {
                        type: 'info',
                        what: 'Verifying',
                        msg: '校验数据中...'
                    });
                    verify_1.checkClient(meta, function (res) {
                        if (res) {
                            event.sender.send('install.reply', {
                                type: 'info',
                                what: 'Installing',
                                msg: '安装客户端中...'
                            });
                            verify_1.unzipClient(meta, function () {
                                event.sender.send('install.reply', {
                                    what: 'Done',
                                    type: 'info'
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