
const fs = require('fs');
const path = require('path');
const os = require('os');
const icons = require('./icon-data.json');
const mime = require('mime-types');

function searchDir() {
    try {
        let result = [];
        result = result.concat(getDir('/'));
        let osname = os.hostname().split('-')[0];
        result = result.concat(getDir(path.join('/', 'home')));
        result = result.concat(getDir(path.join('/', 'media', osname)));
        result = result.concat(getDir(path.join('/', 'mnt')));
        result = result.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        })
        result.unshift({ name: 'Computer', path: '/', isDirectory: true, icon: '/icons/folder.svg' });
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
                    let item = { name: el.name, path: path.join(uri, el.name), isDirectory, mimetype: 'folder' };
                    item.icon = '/icons/folder.svg';
                    result.push(item);
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

/**
 * Gets the icon of the material corresponding to the file information.
 * @param {*} meta Custom object of a file
 * @returns 
 */
function getIcon(meta) {
    const cache = {
        "ts": "typescript",
        "tsx": "react_ts",
        "jsx": "react",
        "py": "python",
        "pyc": "python",
        "ppt": "powerpoint",
        "PPT": "powerpoint",
        "pptx": "powerpoint",
        "pps": "powerpoint",
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
        "7z": "zip",
        "rpm": "zip",
        "deb": "folder-components",
        "pkg": "folder-components",
        "rar": "zip",
        "xlsx": "table",
        "xlsm": "table",
        "xlsb": "table",
        "csv": "table",
        "ods": "table",
        "xls": "table",
        "rb": "ruby",
        "db": "database",
        "sql": "database",
        "log": "log",
        "iso": "disc",
        "dmg": "disc",
        "bin": "hex",
        "apk": "android",
        "sh": "console",
        "php": "php",
        "class": "java",
        "srt": "text",
        "swf": "video",
        "dat": "hex"

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


async function copy(path) {
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    await exec(`xclip-copyfile ${path}`);
}


/**
 * 
 * @param {*} cmd Linux command to execute.
 * @param {*} path Global path of the file.
 */
async function openExternalApp(cmd, path) {
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    await exec(`${cmd} ${path}`);
}

/**
 * 
 * @param {*} types Array of file types extension to be filtered. example: [ 'image', 'video' ]
 * @param {*} name Name of the file to be processed. example: my_presentation.pptx 
 * @returns 
 */
function filterTypes(types, name = '') {
    let cacheRegex = {
        "image": (/\.(apng|gif|jpe?g|tiff?|png|webp|bmp|avif|svg|ico|cur)$/i),
        "video": (/\.(mov|avi|mpeg|mkv|mp4|wmv|avchd|flv|f4v|swf|webm|mpeg-2)$/i),
        "audio": (/\.(aif|cda|mid|mp3|mpa|ogg|wav|wma|wpl)$/i),
        "compressed": (/\.(7z|arj|deb|pkg|rar|rpm|gz|zip|z)$/i),
        "disc": (/\.(bin|dmg|iso|toast|vcd)$/i),
        "database": (/\.(csv|dat|db|dbf|log|mdb|sav|sql|tar)$/i),
        "programming": (/\.(bat|sh|py|js|ts|c|cgi|class|cpp|cs|h|java|php|swift|vb|rb)$/i),
        "executable": (/\.(apk|bat|bin|cgi|com|exe|gadget|jar|msi|wsf)$/i),
        "presentation": (/\.(odp|pps|ppt|pptx)$/i),
        "spreadsheet": (/\.(ods|xls|xlsm|xlsx)$/i),
        "word-processor": (/\.(doc|docx|odt|rtf|tex|wpd)$/i),
        "pdf": (/\.(pdf)$/i)
    }
    let result = false;
    for (let type of types) {
        let re = cacheRegex[type]
        if (!re) continue;
        result = result || re.test(name);
    }
    return result;
}


/**
 * 
 * @param {*} element Element for the file system to be processed.
 * @param {*} fullPath Full path.
 * @param {*} isDirectory Boolean indicating if the current element is a file or a directory.
 * @param {*} fileStats Object data from fs.stats form a file.
 * @returns 
 */
function getMedataFile(element, fullPath, isDirectory, fileStats) {
    const meta = { name: element.name, path: fullPath, isDirectory };
    try {
        if (!isDirectory) {
            meta.size = fileStats.size;
            meta.mimetype = mime.lookup(fullPath);

            let sizeKb = meta.size / 1000;
            meta.sizeLabel = meta.size.toFixed(1) + ' bytes';

            if (sizeKb >= 1 && sizeKb <= 1000) {
                meta.sizeLabel = sizeKb.toFixed(1) + ' Kb';
            }
            if (sizeKb > 1000 && sizeKb < 1e+6) {
                sizeKb = sizeKb / 1000;
                meta.sizeLabel = sizeKb.toFixed(1) + ' Mb';
            }
            if (sizeKb > 1e+6) {
                sizeKb = sizeKb / 1000 / 1000;
                meta.sizeLabel = sizeKb.toFixed(1) + ' Gb';
            }
        } else {
            let result = fs.readdirSync(fullPath)
            meta.size = result.length;
            meta.sizeLabel = `${result.length} items`;
            meta.mimetype = 'folder'
        }

        // meta.id = `${meta.name}_${meta.path}_${meta.mimetype}_${meta.size}_${fileStats.ino}_${process.pid}`;
        meta.id = `${meta.name}_${meta.path}_${meta.mimetype}_${meta.size}`;
        meta.lastDateModified = getDateModified(fileStats.mtime);
        meta.mtime = fileStats.mtime;
        let icon = getIcon(meta);
        meta.icon = icon?.path || '';
        return meta;
    } catch (e) {
        return null;
    }
    //////////////HELPERS///////////////////////
    function getDateModified(date) {
        date = new Date(date);
        let dd = parseTwoDigits(date.getDate());
        let mm = parseTwoDigits(date.getMonth() + 1);
        let yyyy = parseTwoDigits(date.getFullYear());
        let hh = parseTwoDigits(date.getHours());
        let mmm = parseTwoDigits(date.getMinutes());
        function parseTwoDigits(x) {
            return x < 10 ? `0${x}` : x;
        }
        return `${dd}/${mm}/${yyyy} ${hh}:${mmm}`;
    }
    ////////////////////////////////////////////
}


/**
 * 
 * @param {*} searchParam String from the user to search. 
 * @param {*} element Element for the file system to be processed.
 * @param {*} parentDir Parent directory. example: /home/user/
 * @param {*} isDirectory Boolean indicating if the current element is a file or a directory.
 * @param {*} fileStats Object data from fs.stats form a file.
 * @param {*} options Option object. exampe: options: {
     hiddenFiles: true,
     levels: 8,
     selectedFileTypes: [ 'image', 'video' ],
     avoidFiles: [ 'node_modules', 'env', '$Recycle.Bin', '.pyc', 'Windows' ],
     matchCase: false,
     matchExaclyWord: false,
     regularExpression: false,
}
 * @returns 
 */
function filterElement(searchParam, element, pathDir, isDirectory, fileStats, options) {

    /// Search part
    let elementName = element.name || ''
    let searchItem = searchParam || ''
    let indexSearch = null;
    try {
        if (options.regularExpression) {
            if (options.matchExaclyWord) {
                searchItem = '^' + searchItem + '$';
            }
            let re = new RegExp(searchItem, 'i');
            if (options.matchCase) re = new RegExp(searchItem);
            indexSearch = re.test(elementName) ? 1 : -1;
        } else {
            elementName = options.matchCase ? elementName.trim() : elementName.toLowerCase().trim()
            searchItem = options.matchCase ? searchItem.trim() : searchItem.toLowerCase().trim();
            if (options.matchExaclyWord) {
                indexSearch = searchItem == elementName ? 1 : -1;
            } else {
                indexSearch = elementName.includes(searchItem);
            }
        }
    } catch (e) {
        console.log(e.message);
    }

    ///// Search also for data types ///////
    if (indexSearch > -1 && indexSearch) {
        if (options?.selectedFileTypes?.length) {
            let found = filterTypes(options?.selectedFileTypes, elementName)
            return found ? getMedataFile(element, pathDir, isDirectory, fileStats) : null;
        }
        else
            return getMedataFile(element, pathDir, isDirectory, fileStats)
    }
    return null
}



module.exports = {
    searchDir,
    getIcon,
    copy,
    openExternalApp,
    filterElement,
}

// bindIcons();