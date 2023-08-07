// main.js

// https://www.electronforge.io/config/makers/squirrel.windows
if (require('electron-squirrel-startup')) return;

const { app, BrowserWindow, Menu, MenuItem, Tray, nativeImage, dialog } = require('electron')
const prompt = require('electron-prompt')
const { getURL, setURL, delURL, getHA, setHA } = require('./settings.js')

// Disable Hardware Acceleration
// https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering
//console.log('Hardware Accelleration is ' + getHA())
if (!getHA()) {
    app.disableHardwareAcceleration()
}

createWindow = () => {
    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        title: 'Amcrest Desktop',
        icon: __dirname + '/images/Amcrest.ico',
        autoHideMenuBar: true,
        webPreferences: {
            spellcheck: true,
            nativeWindowOpen: true
        }
    })

    const url = getURL();
    if (url) {
        window.loadURL(url);
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
                window.loadURL(r);
                console.log('result', r);
            }
        })
        .catch(console.error);
    }

    window.webContents.on('context-menu', (event, params) => {
        const menu = new Menu()

        // Add each spelling suggestion
        for (const suggestion of params.dictionarySuggestions) {
            menu.append(
                new MenuItem({
                    label: suggestion,
                    click: () => window.webContents.replaceMisspelling(suggestion)
                })
            )
        }

        // Allow users to add the misspelled word to the dictionary
        if (params.misspelledWord) {
            menu.append(
                new MenuItem({
                    label: 'Add to dictionary',
                    click: () => window.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
                })
            )
        }

        menu.popup()
    })

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
            click: () => window.reload()
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