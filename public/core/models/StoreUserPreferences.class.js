const electron = require('electron');
const path = require('path');
const fs = require('fs');

let instance = null;

class StoreUserPreferences {
    constructor(opts) {
        // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
        // app.getPath('userData') will return a string of the user's app data directory path.
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');
        // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
        this.path = path.join(userDataPath, opts.configName + '.json');
        this.data = parseDataFile(this.path, opts.defaults);
    }

    get(key) {
        return this.data[key];
    }

    set(key, val) {
        try {
            this.data[key] = val;
            fs.writeFileSync(this.path, JSON.stringify(this.data));
        } catch (e) {
            console.log("Error savong data", e);
        }

    }
}

function parseDataFile(filePath, defaults) {
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
        console.log("Error:", error)
        return defaults;
    }
}

// expose the class

instance = new StoreUserPreferences({
    configName: 'user-preferences',
    defaults: {
        windowSizes: { width: 1360, height: 720 }
    }
})
module.exports = instance;