export default interface MetaInfo {
    clientSizeBytes: number,
    patchSizeBytes: number,
    patchMd5: string,
    patchFileUrl: string,
    exeSizeBytes: number,
    exeFileUrl: string,
    exeMd5: string,
    md5ListFileUrl: string
    version: string,
    exePath: string
}