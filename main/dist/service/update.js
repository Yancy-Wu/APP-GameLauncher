"use strict";
exports.__esModule = true;
var meta_1 = require("../controller/meta");
var download_1 = require("../controller/download");
var verify_1 = require("../controller/verify");
var version_1 = require("../controller/version");
var patch_1 = require("../controller/patch");
var electron_1 = require("electron");
electron_1.ipcMain.on('update', function (event) {
    var patchVersion = function (versions) {
        var versionIter = versions.next();
        var version = versionIter.value;
        if (versionIter.done)
            return;
        event.sender.send('update.reply', {
            type: 'info',
            what: 'Indexing',
            version: version,
            msg: '正在获取元数据, 请等待...'
        });
        meta_1.downloadMeta(version, function (meta) {
            event.sender.send('update.reply', {
                type: 'info',
                what: 'Connecting',
                version: version,
                msg: '正在连接服务器, 请等待...'
            });
            var info = download_1.downloadPatch(meta);
            var id = setInterval(function () {
                event.sender.send('update.reply', {
                    type: 'info',
                    what: 'Downloading',
                    version: version,
                    msg: '正在下载Patch中...',
                    downloadedBytes: info.downloadedBytes
                });
                if (info.done) {
                    clearInterval(id);
                    event.sender.send('update.reply', {
                        type: 'info',
                        what: 'Verifying',
                        version: version,
                        msg: '校验Patch中...'
                    });
                    verify_1.checkPatch(meta, function (res) {
                        if (res) {
                            event.sender.send('update.reply', {
                                type: 'info',
                                what: 'Patching',
                                version: version,
                                msg: '正在打包Patch中...'
                            });
                            patch_1.patchClient(meta, function () {
                                event.sender.send('update.reply', {
                                    type: 'info',
                                    what: 'Done',
                                    version: version
                                });
                                patchVersion(versions);
                            });
                        }
                    });
                }
            }, 1000);
        });
    };
    version_1.getToUpdateVersions(function (versions) {
        if (!versions) {
            event.sender.send('update.reply', {
                type: 'info',
                what: 'None'
            });
            return;
        }
        patchVersion(versions.values());
    });
});
//# sourceMappingURL=update.js.map