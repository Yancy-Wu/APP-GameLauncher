import EXCEPTIONS from '../exceptions/define';

export interface BaseMsg {
    type: 'error' | 'debug' | 'abstract' | 'info' | 'done',
    msg?: string
}

export interface ProgressMsg extends BaseMsg {
    type: 'info',
    progressCur: number,
    progressTotal: number,
}

export let debugMsg: {[key: string]: string};
debugMsg[EXCEPTIONS.connectFailed] = '连接服务器失败，自动重试中，重试次数: ';

export let errorMsg: {[key: string]: string};
errorMsg[EXCEPTIONS.unknow] = '未知错误，终止执行';
errorMsg[EXCEPTIONS.noRemoteFile] = '远程服务器找不到指定的文件';
errorMsg[EXCEPTIONS.noDiskSpace] = '磁盘空间不足，请重试';
errorMsg[EXCEPTIONS.noMemSpace] = '内存空间不足，请重试';
errorMsg[EXCEPTIONS.md5CheckFailed] = '文件MD5校验未通过';