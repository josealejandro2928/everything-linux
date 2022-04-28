const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const setCommunicationTunnel = require('./core/index');
const defaultMenu = require('electron-default-menu');
const storeUserPreferences = require('./core/models/StoreUserPreferences.class');


let mainWindow;
function createWindow() {
    const iconPath = path.join(__dirname, 'icon.png');
    let { width, height } = storeUserPreferences.get('windowSizes');

    mainWindow = new BrowserWindow({
        width,
        height,
        minWidth: 900,
        minHeight: 600,
        title: 'Linux Search Everything',
        icon: iconPath,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegrationInWorker: true,
            webSecurity: true,
            devTools: isDev ? true : false
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

    mainWindow.on('resize', () => {
        let { width, height } = mainWindow.getBounds();
        // Now that we have them, save them using the `set` method.
        storeUserPreferences.set('windowSizes', { width, height });
    });

}

app.whenReady().then(() => {
    const menu = defaultMenu(app, electron.shell);
    editDefaultMenu(menu);
    electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate(menu));
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


function editDefaultMenu(menu = []) {
    ////Editing View ///////
    let viewMenuIndex = menu.findIndex(el => el.label == "View");
    if (viewMenuIndex > -1) {
        let viewMenu = menu[viewMenuIndex];
        viewMenu.submenu = viewMenu?.submenu?.filter((e) => (!e.label.includes("Toggle Developer")));
        menu[viewMenuIndex] = viewMenu;
    }
    ////Editing Help ///////
    let helpMenuIndex = menu.findIndex(el => el.label == "Help");
    if (helpMenuIndex > -1) {
        //ToDo
    }
}