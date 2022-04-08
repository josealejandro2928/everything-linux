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
    console.log("********search********", arg) // prints "ping"
    let { directories, searchParam, options } = arg;
    options = { ...options, reportFound: true };
    // directories, searchParam = '', options = { hiddenFiles: false, levels: null }, event
    searchObject.search(directories || null, searchParam || '', options, event);
    searchObject.setStopped(false);
    event.reply('finish', {})
})

ipcMain.on('root-dir', (event, arg) => {
    console.log("********root-dir********", arg)
    let result = searchObject.search(null, '', { reportFound: false }, event);
    searchObject.setStopped(false);
    result = result.filter((el) => el.isDirectory);
    result.unshift({ name: 'Computer', path: '/', isDirectory: true })
    event.reply('root-dir-result', { data: result })
})

// eslint-disable-next-line no-unused-vars
ipcMain.on('stop-current-search', (event, arg) => {
    //execute tasks on behalf of renderer process 
    searchObject.setStopped(false);
    event.reply('finish', {})
})