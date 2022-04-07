console.log("Cargo el core");

const { ipcMain } = require('electron')
const searchObject = require('./search');


ipcMain.on('run-init', (event, arg) => {
    //execute tasks on behalf of renderer process 
    console.log("event", arg) // prints "ping"
    console.log("arg", arg) // prints "ping"
    event.reply('run-init:response', ['data', 'data-2', 'data-3'])
})

ipcMain.on('search', (event, arg) => {
    console.log("********arg********", arg) // prints "ping"
    const { directories, searchParam, options } = arg;
    // directories, searchParam = '', options = { hiddenFiles: false, levels: null }, event
    searchObject.search(directories || null, searchParam || '', options || {}, event);
    searchObject.setStopped(false);
    event.reply('finish', {})
})

// eslint-disable-next-line no-unused-vars
ipcMain.on('stop-current-search', (event, arg) => {
    //execute tasks on behalf of renderer process 
    searchObject.setStopped(false);
    event.reply('finish', {})
})