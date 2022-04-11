console.log("Cargo el core");

const path = require('path');
const { ipcMain } = require('electron')
const { searchDir } = require('./helpers')
const { Worker } = require('worker_threads');

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