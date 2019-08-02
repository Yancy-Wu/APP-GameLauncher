import { downloadMeta } from '../controller/meta';
import { downloadPatch } from '../controller/download';
import { checkPatch } from '../controller/verify';
import { getToUpdateVersions } from '../controller/version';
import { patchClient } from '../controller/patch';
import { ipcMain, Event } from 'electron';

ipcMain.on('update', (event: Event) => {
    const patchVersion = (versions: IterableIterator<string>) => {
        const versionIter = versions.next();
        const version = versionIter.value;
        if (versionIter.done) return;
        event.sender.send('update.reply', {
            type: 'info',
            what: 'Indexing',
            version: version,
            msg: '正在获取元数据, 请等待...'
        });
        downloadMeta(version, meta => {
            event.sender.send('update.reply', {
                type: 'info',
                what: 'Connecting',
                msg: '正在连接服务器, 请等待...'
            });
            let info = downloadPatch(meta);
            let id = setInterval(() => {
                event.sender.send('update.reply', {
                    type: 'info',
                    what: 'Downloading',
                    msg: '正在下载Patch中...',
                    downloadedBytes: info.downloadedBytes
                });
                if (info.done) {
                    clearInterval(id);
                    event.sender.send('update.reply', {
                        type: 'info',
                        what: 'Verifying',
                        msg: '校验Patch中...'
                    });
                    checkPatch(meta, res => {
                        if (res) {
                            event.sender.send('update.reply', {
                                type: 'info',
                                what: 'Patching',
                                msg: '正在打包Patch中...'
                            });
                            patchClient(meta, () => {
                                event.sender.send('update.reply', {
                                    type: 'info',
                                    what: 'Done',
                                });
                                patchVersion(versions);
                            })
                        }
                    })
                }
            }, 1000);
        });
    }
    getToUpdateVersions(versions => {
        if (!versions) {
            event.sender.send('update.reply', {
                type: 'info',
                what: 'None',
            });
            return;
        }
        event.sender.send('update.reply', {
            type: 'info',
            what: 'Overall',
            newestVersion: versions[versions.length - 1]
        });
        patchVersion(versions.values());
    })
})