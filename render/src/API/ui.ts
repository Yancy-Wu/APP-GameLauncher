import ErrorInfo from './error';

let ipcRender = (window as any).require('electron').ipcRenderer;

export function openDirDialog(onInfo: (path: string) => void) {
    ipcRender.send('ui.openDirDialog');
    ipcRender.on('ui.openDirDialog.reply', (_: any, args: any) => {
        onInfo(args);
    })
}