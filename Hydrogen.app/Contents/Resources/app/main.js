/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
const electron = require('electron');
const fs = require("fs");
// // Module to control application life.
// // Module to create native browser window.
// const BrowserWindow = electron.BrowserWindow
// const app = electron.app

var {app, BrowserWindow, ipcMain} = electron;
const MenuBuilder = require("./menu")
let mainWindow = null, landingWindow = null, locale;
/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

var forceQuit = false;

app.on('before-quit', (ev) => {
  forceQuit = true;
})

app.on("quit", (ev) => {
  app.exit(0);
})

app.on('activate', (ev, hasVisibleWindows) => {
  if (mainWindow) {
    mainWindow.show()
  } else {
    createWindow();
  }
});

app.on('ready', createWindow);

const isDev = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

function createWindow () {
  locale = app.getLocale();
  landingWindow = new BrowserWindow({
    show: false,
    frame: isDev,
    width: 490,
    height: 400
  })

  landingWindow.once("show", () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1100,
      height: 740,
      titleBarStyle: isDev ? "show" : 'hidden',
      icon: `file://${__dirname}/assets/imgs/logo.png`,
      show: false
    })

    mainWindow.once("show", () => {
      landingWindow.hide()
      landingWindow.close()
      landingWindow.removeAllListeners();
      mainWindow.show()
      landingWindow = null
    })

    mainWindow.webContents.on("will-navigate", (ev) => {
      ev.preventDefault();
    })

    mainWindow.webContents.on('did-finish-load', () => {
      if (!mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      mainWindow.show();
      mainWindow.focus();
    });

    mainWindow.on("close", function(event) {
      if (process.platform === "darwin" && !forceQuit) {
        event.preventDefault();
        mainWindow.hide();
      }
    })

     // Emitted when the window is closed.
    mainWindow.on('closed', function (event) {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow.removeAllListeners();
      mainWindow = null;
      app.exit(0);
    })

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/app.html`);

    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu(locale);
  })

  landingWindow.loadURL(`file://${__dirname}/landing.html`)
  landingWindow.once('ready-to-show', () => {
    landingWindow.show()
  })
}

ipcMain.on("reload", () => {
  mainWindow.webContents.reloadIgnoringCache()
})
