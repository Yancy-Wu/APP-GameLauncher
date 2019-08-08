let EXCEPTIONS = {
    unknow: 'UNKNOW',
    connectFailed: 'CONNECT_FAILED',
    md5CheckFailed: 'MD5_CHECK_FAILED',
    retryFailed: 'CAN_NOOOOOOOOOOOOOT_TAKE_IT_ANYMORE',
    noDiskSpace: 'NO_ENOUGH_DISK',
    noMemSpace: 'NO_ENOUGH_MEMORY',
    noRemoteFile: 'REMOTE_NO_FILE'
}

export let EXIT_CODE_TO_EXCEPTION = {
    downloadException: {
        1: EXCEPTIONS.unknow,
        2: EXCEPTIONS.connectFailed,
        4: EXCEPTIONS.noRemoteFile
    },
    patchException: {
        1: EXCEPTIONS.unknow,
        3: EXCEPTIONS.noDiskSpace,
        4: EXCEPTIONS.noMemSpace
    },
    unzipException: {
        1: EXCEPTIONS.unknow,
        3: EXCEPTIONS.noDiskSpace,
        4: EXCEPTIONS.noMemSpace
    },
}

export default EXCEPTIONS;