const { app, BrowserWindow, screen } = require('electron')
const path = require('path')

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize

    const win = new BrowserWindow({
        width,
        height,
        center: true,
        frame: false,
        transparent: true,
        // alwaysOnTop: true,
        icon: path.join('app', 'favicon.png'),
        webPreferences: {
            nodeIntegration: true,
        },
    })

    win.loadFile(path.join('app', 'index.html'))

    // win.setIgnoreMouseEvents(true)
    // win.webContents.openDevTools();
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
