// Modules to control application life and create native browser window
import { app } from 'electron'
import mainWindow, { init } from './base/global';

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', init)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) init()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
import './service/info'
import './service/major'
import './service/ui'