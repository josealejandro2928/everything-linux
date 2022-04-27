const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const setCommunicationTunnel = require('./core/index');
console.log("🚀 ~ file: electron.js ~ line 6 ~ isDev", isDev)

let mainWindow;
function createWindow() {
    const iconPath = path.join(__dirname, 'icon.png');
    // console.log("🚀 ~ file: electron.js ~ line 12 ~ createWindow ~ iconPath", iconPath)
    mainWindow = new BrowserWindow({
        width: 1360,
        height: 720,
        minWidth: 900,
        minHeight: 600,
        title: 'Linux Search Everything',
        icon: iconPath,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegrationInWorker: true,
            webSecurity: true
        },
    });

    //load the index.html from a url
    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "index.html")}`
    );
    // Open the DevTools.
    (isDev && mainWindow.webContents.openDevTools());


    setCommunicationTunnel(mainWindow, isDev, __dirname);

}

app.whenReady().then(() => {
    createWindow();
})


app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});


app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});
