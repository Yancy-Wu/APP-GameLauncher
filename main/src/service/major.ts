import { ipcMain, Event } from 'electron';
import Install from '../logic/install';
import Update from '../logic/update';

ipcMain.on('install', (event: Event) => new Install(event.sender, 'install'));

ipcMain.on('update', (event: Event) => new Update(event.sender, 'update'));