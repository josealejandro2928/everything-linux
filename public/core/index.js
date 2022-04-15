console.log("Cargo el core");

const path = require('path');
const { ipcMain, Menu, BrowserWindow } = require('electron')
const { searchDir } = require('./helpers')
const { Worker } = require('worker_threads');
const { shell } = require('electron')

let worker;

ipcMain.on('search', async (event, arg) => {
    // console.log("********ENTRE EN EL SEARCH********", arg) // prints "ping"
    let { directories, searchParam, options } = arg;
    options = { ...options, reportFound: true };

    try {
        if (worker) {
            worker.removeAllListeners();
            await worker?.terminate();
        }

        worker = new Worker(path.join(__dirname, 'search-worker.js'), {
            execArgv: [...process.execArgv, '--unhandled-rejections=strict'],
            workerData: {
                directories,
                searchParam,
                options,
            }
        });


        worker.on('message', (found) => {
            event.reply('found-result', { data: found })
        })

        worker.on("error", (error) => {
            console.log("🚀 ~ file: index.js ~ line 38 ~ worker.on ~ error", error)
            event.reply('finish', {})
        })

        worker.on("exit", (code) => {
            console.log("EXIT CODE OF WORKER:", code);
            if (code) {
                console.log("*****WORKER FINISH***********");
                event.reply('finish', {})

            } else {
                console.log("*****WORKER FINISH WITH ERRORS***********");
                event.reply('finish', {})
            }
        })



    } catch (e) {
        console.log("🚀 ~ file: index.js ~ line 35 ~ ipcMain.on ~ e", e)
    }
})

ipcMain.on('root-dir', (event, _) => {
    let results = searchDir();
    event.reply('root-dir-result', { data: results })
})

// eslint-disable-next-line no-unused-vars
ipcMain.on('stop-current-search', async (event, _) => {
    console.log("Entre en el Stop");
    if (worker) {
        worker.removeAllListeners();
        await worker?.terminate();
    }
})

ipcMain.on('show-context-menu', (event, file) => {
    const template = [
        {
            id: 'open',
            label: 'Open',
            type: 'normal',
            click: () => { shell.openPath(file.path) }
        },
        {
            id: 'open-select',
            label: 'Open Path',
            type: 'normal',
            click: () => { shell.showItemInFolder(file.path) }
        },
        {
            id: 'copy-name',
            label: 'Copy Name to Clipboard',
            type: 'normal',
            click: () => { shell.showItemInFolder(file.path) }
        },
        {
            id: 'copy-path',
            label: 'Copy Path to Clipboard',
            type: 'normal',
            click: () => { shell.showItemInFolder(file.path) }
        },
        { type: 'separator' },
        { label: 'Menu Item 2', type: 'checkbox', checked: true }
    ]
    const menu = Menu.buildFromTemplate(template);
    const browserWindow = BrowserWindow.fromWebContents(event.sender);
    menu.popup(browserWindow);
})

ipcMain.on('open-file', (event, file) => {
    shell.openPath(file.path);
})