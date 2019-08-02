import { downloadMeta } from '../controller/meta';
import { downloadClient } from '../controller/download';
import { checkClient, unzipClient } from '../controller/verify';
import { getNewestClientVersion } from '../controller/version';
import { ipcMain, Event } from 'electron';

ipcMain.on('install', (event: Event) => {
    getNewestClientVersion(version => {
        event.sender.send('install.reply', {
            type: 'info',
            what: 'Indexing',
            version: version,
            msg: '正在获取元数据, 请等待...'
        });
        downloadMeta(version, meta => {
            event.sender.send('install.reply', {
                type: 'info',
                what: 'Connecting',
                msg: '正在连接服务器, 请等待...'
            });
            let info = downloadClient(meta);
            let id = setInterval(() => {
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
                    checkClient(meta, res => {
                        if (res) {
                            event.sender.send('install.reply', {
                                type: 'info',
                                what: 'Installing',
                                msg: '安装客户端中...'
                            });
                            unzipClient(meta, () => {
                                event.sender.send('install.reply', {
                                    what: 'Done',
                                    type: 'info',
                                    msg: '完成'
                                });
                            })
                        }
                    })
                }
            }, 1000);
        });
    })
})