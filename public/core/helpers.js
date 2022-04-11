
const fs = require('fs');
const path = require('path');
const os = require('os');
const icons = require('./icon-data.json');

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

function bindIcons() {
    try {
        let uri = '/media/jose/DATA/03-CODING/Electron/everything-linux/public/icons';
        let icons = fs.readdirSync(uri, { withFileTypes: true });
        let data = []
        for (let icon of icons) {
            data.push({ name: icon.name, path: `/icons/${icon.name}` })
        }
        fs.writeFileSync(path.join(__dirname, 'icon-data.json'), JSON.stringify(data), { encoding: 'utf-8' });
    } catch (e) {
        console.log(e);
    }
}

function getIcon(meta) {
    const cache = {
        "ts": "typescript",
        "tsx": "react_ts",
        "jsx": "react",
        "py": "python",
        "pyc": "python",
        "ppt": "powerpoint",
        "pptx": "powerpoint",
        "doc": "word",
        "docx": "word",
        "c": "c",
        "h": "c",
        "cpp": "cpp",
        "jar": "jar",
        "m": "matlab",
        "hbs": "handlebars",
        "tex": "tex",
        "txt": "document",
        "MD": "document",
        "md": "document",
        "gz": "zip",
        "z": "zip",
        "rpm": "zip",
        "deb": "folder-components",
        "pkg": "folder-components",
        "rar": "zar",
        "xlsx": "table",
        "xlsm": "table",
        "xlsb": "table",
        "csv": "table",
        "rb": "ruby",
        "db": "database",
        "sql": "database",
        "log": "log",
        "iso": "disc",
        "dmg": "disc",
        "bin": "hex",
        "apk": "android",
        "sh": "console",
        "php":"php",
        "class":"java"

    }


    let icon = icons.find((e) => {
        let name = e.name.split('.')[0];
        try {
            let temp = meta.name.split('.');
            let extention = temp[temp.length - 1];
            if (meta.mimetype == 'folder') {
                return meta.mimetype == name;
            }
            if (extention in cache) {
                return name == cache[extention]
            }
            let part1 = meta.mimetype.split('/')?.[0];
            if (!part1) return name == 'file';
            let part2 = meta.mimetype.split('/')?.[1];
            return part1 == name || part2 == name;
        } catch (e) {
            return name == 'file';
        }
    })

    if (!icon)
        icons.find((e) => e.name == 'file.svg');
    return icon;

}

module.exports = {
    searchDir,
    getIcon

}
// bindIcons();