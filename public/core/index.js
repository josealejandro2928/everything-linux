
const path = require('path');
const { ipcMain, Menu, BrowserWindow } = require('electron')
const { searchDir, openExternalApp, getFileInfo } = require('./helpers')
const { Worker } = require('worker_threads');
const { shell, clipboard, dialog } = require('electron')

let worker;



module.exports = function setCommunicationTunnel(mainWindow, isDev, rootPath) {
    console.log("Cargo el core");

    ipcMain.on('search', async (event, arg) => {
        // console.log("********ENTRE EN EL SEARCH********", arg) // prints "ping"
        let { directories, searchParam, options } = arg;
        options = { ...options, reportFound: true };

        try {
            if (worker) {
                worker.postMessage({ message: "kill" });
                worker.removeAllListeners();
                await worker?.terminate();
            }

            worker = new Worker(path.join(__dirname, 'search-worker.js'), {
                execArgv: [...process.execArgv, '--unhandled-rejections=strict'],
                workerData: {
                    directories,
                    searchParam: searchParam || '',
                    options,
                }
            });


            worker.on('message', (found) => {
                // console.log("path.join(path.resolve('/'), found.icon)", path.join(path.resolve(), found.icon))
                found.icon = isDev ? found.icon : path.join(rootPath, found.icon);
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
        results.map((item) => {
            item.icon = isDev ? item.icon : path.join(rootPath, item.icon);
            return item;
        })
        event.reply('root-dir-result', { data: results })
    })

    // eslint-disable-next-line no-unused-vars
    ipcMain.on('stop-current-search', async (event, _) => {
        console.log("Entre en el Stop");
        if (worker) {
            worker.postMessage({ message: "kill" });
            // worker.removeAllListeners();
            // await worker?.terminate();
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
                click: () => {
                    clipboard.writeText(file.name);
                    event.sender.send('clipboard', "name");
                }
            },
            {
                id: 'copy-path',
                label: 'Copy Path to Clipboard',
                type: 'normal',
                click: () => {
                    clipboard.writeText(file.path);
                    event.sender.send('clipboard', "path");
                }
            },
            { type: 'separator' },
            {
                id: 'open-vscode',
                label: 'Open with vscode',
                type: 'normal',
                click: async () => {
                    try {
                        await openExternalApp('code -n', file.path)
                    } catch (e) {
                        event.sender.send('error', e.message || 'Error')
                    }
                }
            },
            {
                id: 'compress',
                label: 'Compres file',
                type: 'normal',
                click: async () => {
                    try {
                        let name = `"${file.path}"`
                        await openExternalApp(`zip -r -j ${name}.zip`, `"${file.path}"`);
                        event.sender.send("refresh");
                    } catch (e) {
                        console.log("*********ERROR***********", e);
                        event.sender.send('error', e.message || 'Error')
                    }
                }
            },
            // { type: 'separator' },
            // {
            //     id: 'delete-item',
            //     label: 'Delete file',
            //     type: 'normal',
            //     click: () => {
            //         shell.trashItem(file.path);
            //         event.sender.send("refresh");
            //     }
            // },
        ]
        const menu = Menu.buildFromTemplate(template);
        const browserWindow = BrowserWindow.fromWebContents(event.sender);
        menu.popup(browserWindow);
    })

    ipcMain.on('open-file', (_, file) => {
        shell.openPath(file.path);
    })

    ipcMain.on('open-dialog', async (event) => {
        try {
            console.log("ENtre aqui en este evento")
            const { canceled, filePaths } = await dialog.showOpenDialog({ title: 'Select directories', properties: ['openDirectory', 'multiSelections'] })
            if (canceled) return;
            let data = filePaths.map((item) => {
                let el = getFileInfo(item);
                el.icon = isDev ? el.icon : path.join(rootPath, el.icon);
                return el;
            }).filter((x) => (x != null));
            event.sender.send("open-dialog-response", data)
        } catch (e) {
            console.log(e)
        }

    })

}
