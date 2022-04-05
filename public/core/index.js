console.log("Cargo el core");

const { ipcMain } = require('electron')

ipcMain.on('run-init', (event, arg) => {
    //execute tasks on behalf of renderer process 
    console.log("event", arg) // prints "ping"
    console.log("arg", arg) // prints "ping"
    event.reply('run-init:response', ['data', 'data-2', 'data-3'])
})