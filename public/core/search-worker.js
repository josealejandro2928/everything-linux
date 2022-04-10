

const fs = require('fs');
const path = require('path');

const { parentPort, workerData } = require('worker_threads');

const { directories, searchParam = '', options } = workerData;

let stopped = false;

function search(
    directories,
    searchParam = '',
    options = {
        hiddenFiles: false,
        levels: null,
        reportFound: true
    },) {
    console.log("********ENTRE EN EL SEARCH WORKER********", { directories, searchParam, options }) // prints "ping"
    if (stopped) return;
    let onlyRoot = false;

    if (!directories || !directories?.length) {
        directories = ['/', '/media'];
        onlyRoot = true;
    }

    if (!searchParam) {
        onlyRoot = true;
    }

    directories = directories instanceof Array ? directories : [directories];
    directories = directories.map((el) => ({ link: el, level: 0 }));

    let level = 0;

    try {
        let result = [];
        let queue = [...directories];
        for (let dir of queue) {
            if (stopped) return;
            let output;
            level = dir.level;
            try {
                output = fs.readdirSync(dir.link, { withFileTypes: true });
            } catch (e) {
                continue;
            }
            let re = /^(?!\.).*$/;
            for (let element of output) {
                if (stopped) return;
                if (!options.hiddenFiles && !re.test(element.name))
                    continue;

                let isDirectory = false;
                try {
                    isDirectory = fs.lstatSync(path.join(dir.link, element.name)).isDirectory();
                } catch (e) {
                    continue
                }
                const found = filterElement(searchParam, element, dir.link, isDirectory);
                if (found) {
                    // console.log("🚀 ~ file: search.js ~ line 59 ~ filterElement ~ found", found);
                    result.push(found);
                    if (options.reportFound) {
                        parentPort.postMessage(found);
                    }
                }

                if (!onlyRoot && (options.levels == null || level <= options.levels)) {
                    try {
                        if (isDirectory) {
                            queue.push({ link: path.join(dir.link, element.name), level: dir.level + 1 })
                        }
                    } catch (e) {
                        continue
                    }
                }
            }
        }
        return result;
    } catch (e) {
        console.log(e.message);
    }

}

function getMedataFile(res, fullPath, isDirectory) {
    const meta = { name: res.name, path: fullPath, isDirectory };
    try {
        if (!isDirectory) {
            let data = fs.statSync(fullPath);
            meta.size = data.size;
            meta.mimetype = path.extname(fullPath).split('.')[1];
        }
        return meta;
    } catch (e) {
        return null;
    }
}

function filterElement(searchParam, element, parentDir, isDirectory) {

    const elementName = element.name.toLowerCase().trim();
    let searchItem = searchParam.toLowerCase().trim();
    let indexSearch = null;

    if (searchItem[0] == '/' && searchItem[searchItem.length - 1] == '/') {
        indexSearch = elementName.search(searchItem);
    } else {
        indexSearch = elementName.includes(searchItem);
    }
    if (indexSearch > -1 && indexSearch) {
        let found = getMedataFile(element, path.join(parentDir, element.name), isDirectory)
        return found
    }
    return null

}

search(directories, searchParam, options, null);
process.exit(1);