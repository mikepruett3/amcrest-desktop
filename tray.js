const { Tray, Menu, nativeImage } = require('electron');
const { getHA, setHA } = require('./settings.js');

let tray

const icon = nativeImage.createFromPath(__dirname + '/images/Amcrest.ico')
tray = new Tray(icon)

const contextMenu = Menu.buildFromTemplate([
    {
        label: 'Hardware Acceleration',
        type: 'checkbox',
        checked: getHA(),
        click({ checked }) {
            setHA(checked)
            console.log(checked)
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

//return tray