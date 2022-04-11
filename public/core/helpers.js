
const fs = require('fs');
const path = require('path');
const os = require('os');

function searchDir() {
    try {
        let result = [];
        result = result.concat(getDir('/'));
        let osname = os.hostname().split('-')[0];
        result = result.concat(getDir(path.join('/', 'home')));
        result = result.concat(getDir(path.join('/', 'media', osname)));
        result = result.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        })
        result.unshift({ name: 'Computer', path: '/', isDirectory: true });
        return result;
    } catch (e) {
        console.log("Error", e);
    }

    function getDir(uri) {
        let result = [];
        let output = fs.readdirSync(uri, { withFileTypes: true });
        for (let el of output) {
            let isDirectory = true
            try {
                isDirectory = fs.lstatSync(path.join(uri, el.name)).isDirectory();
                if (isDirectory) {
                    result.push({ name: el.name, path: path.join(uri, el.name), isDirectory })
                }
            } catch (e) {
                continue
            }
        }
        return result;
    }

}

module.exports = {
    searchDir
}