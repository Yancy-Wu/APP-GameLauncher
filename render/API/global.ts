export let StoreConstructor : any;
export let child_process: any;
export let fs: any;
export let os: any;
export let path: any;
export let mainWindow: any;
export let electron: any;
export let ftp: any;
export let crypto: any;
export let store: any;

document.onreadystatechange = () => {
    StoreConstructor = (window as any).require('electron-store');
    child_process = (window as any).require('child_process');
    fs = (window as any).require('fs');
    os = (window as any).require('os');
    path = (window as any).require('path');
    mainWindow = (window as any).mainWindow;
    electron = (window as any).require('electron');
    ftp = (window as any).require('ftp');
    crypto = (window as any).require('crypto');
    store = new StoreConstructor();
}