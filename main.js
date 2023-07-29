// main.js

// https://www.electronforge.io/config/makers/squirrel.windows
//if (require('electron-squirrel-startup')) return;

const { app, session, BrowserWindow, Tray, Menu, nativeImage, dialog } = require('electron');
//const { app, BrowserWindow } = require('electron');
const prompt = require('electron-prompt');
const { getURL, setURL, delURL, getHA, setHA } = require('./settings.js');
//const { getURL, setURL, getHA } = require('./settings.js');
//const Tray = require('./tray');

// Disable Hardware Acceleration
// https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering
//console.log('Hardware Accelleration is ' + getHA())
if (!getHA()) {
    app.disableHardwareAcceleration()
}

//let tray

createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        title: 'Amcrest Desktop',
        icon: __dirname + '/images/Amcrest.ico',
        autoHideMenuBar: true,
        webPreferences: {
            nativeWindowOpen: true
        }
    })

    const url = getURL();
    if (url) {
        win.loadURL(url);
    } else {
        prompt({
            title: 'Amcrest NVR Website',
            label: 'URL:',
            value: 'https://dvr.example.org',
            inputAttrs: {
                type: 'url'
            },
            type: 'input',
            resizable: true
        })
        .then((r) => {
            if(r === null) {
                console.log('user cancelled');
            } else {
                setURL(r);
                win.loadURL(r);
                console.log('result', r);
            }
        })
        .catch(console.error);
    }

    const icon = nativeImage.createFromPath(__dirname + '/images/Amcrest.ico')
    tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Hardware Acceleration',
            type: 'checkbox',
            checked: getHA(),
            click({ checked }) {
                setHA(checked)
                dialog.showMessageBox(
                    null,
                    {
                        type: 'info',
                        title: 'info',
                        message: 'Exiting Applicatiom, as Hardware Acceleration setting has been changed...'

                    })
                    .then(result => {
                      if (result.response === 0) {
                        app.relaunch();
                        app.exit()
                      }
                    }
                );
            }
        },
        {
            label: 'Delete Stored URL',
            click: () => {
                delURL();
                app.relaunch();
                app.exit();
            }
        },
        {
            label: 'Clear Cache',
            click: () => {
                session.defaultSession.clearStorageData()
                app.relaunch();
                app.exit();
            }
        },
        {
            label: 'Reload',
            click: () => win.reload()
        },
        {
            label: 'Quit',
            type: 'normal',
            role: 'quit'
        }
    ])

    tray.setToolTip('Amcrest Desktop')
    tray.setTitle('Amcrest Desktop')
    tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})