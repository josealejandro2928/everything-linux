

const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const { getIcon } = require('./helpers');

const { parentPort, workerData } = require('worker_threads');
const { directories, searchParam = '', options } = workerData;

/** 
options: {
     hiddenFiles: true,
     levels: 8,
     selectedFileTypes: [ 'image', 'video' ],
     avoidFiles: [ 'node_modules', 'env', '$Recycle.Bin', '.pyc', 'Windows' ],
     reportFound: true
}
*/
function search(
    directories,
    searchParam = '',
    options = {
        hiddenFiles: false,
        levels: null,
        reportFound: true,
        avoidFiles: [],
        selectedFileTypes: [],
    },) {
    console.log("//////////////////********ENTRE EN EL SEARCH WORKER********////////////////////////", { directories, searchParam, options }) // prints "pin
    let onlyRoot = false;


    if (!directories || !directories?.length) {
        directories = ['/', '/media'];
        onlyRoot = true;
    }

    if (!searchParam && !options?.selectedFileTypes?.length) {
        onlyRoot = true;
    }

    directories = directories instanceof Array ? directories : [directories];
    directories = directories.map((el) => ({ link: el, level: 0 }));

    let level = 0;

    try {
        let result = [];
        let queue = [...directories];
        for (let dir of queue) {
            let output;
            level = dir.level;
            try {
                output = fs.readdirSync(dir.link, { withFileTypes: true });
            } catch (e) {
                continue;
            }
            let re = /^(?!\.).*$/;
            for (let element of output) {

                if (!options.hiddenFiles && !re.test(element.name))
                    continue;

                if (options?.avoidFiles?.length && options.avoidFiles.includes(element.name))
                    continue;

                let isDirectory = false;
                let fileStats;
                try {
                    fileStats = fs.lstatSync(path.join(dir.link, element.name));
                    isDirectory = fileStats.isDirectory();
                } catch (e) {
                    continue
                }
                const found = filterElement(searchParam, element, dir.link, isDirectory, fileStats, options);
                if (found) {
                    // console.log("🚀 ~ file: search-worker.js ~ line 79 ~ found", found)
                    result.push(found);
                    if (options.reportFound) {
                        parentPort.postMessage(found);
                    }
                }

                if (!onlyRoot && (options.levels == 0 || level <= options.levels)) {
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

function getMedataFile(res, fullPath, isDirectory, fileStats) {
    const meta = { name: res.name, path: fullPath, isDirectory };
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

        meta.id = `${meta.name}_${meta.path}_${meta.mimetype}_${meta.size}_${fileStats.ino}`;
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
options: {
     hiddenFiles: true,
     levels: 8,
     selectedFileTypes: [ 'image', 'video' ],
     avoidFiles: [ 'node_modules', 'env', '$Recycle.Bin', '.pyc', 'Windows' ],
     reportFound: true
}
*/
function filterElement(searchParam, element, parentDir, isDirectory, fileStats, options) {

    const elementName = element.name.toLowerCase().trim();
    let searchItem = searchParam.toLowerCase().trim();
    let indexSearch = null;

    if (options.isRegex) {
        let re = new RegExp(searchItem);
        indexSearch = elementName.search(re);
    } else {
        indexSearch = elementName.includes(searchItem);
    }

    if (indexSearch > -1 && indexSearch) {
        if (options?.selectedFileTypes?.length) {
            let found = filterTypes(options?.selectedFileTypes, elementName)
            return found ? getMedataFile(element, path.join(parentDir, element.name), isDirectory, fileStats) : null;
        }
        else
            return getMedataFile(element, path.join(parentDir, element.name), isDirectory, fileStats)
    }
    return null
}

function filterTypes(types, name = '') {
    let cacheRegex = {
        "image": (/\.(apng|gif|jpe?g|tiff?|png|webp|bmp|avif|svg|ico|cur)$/i),
        "video": (/\.(mov|avi|mpeg|mkv|mp4|wmv|avchd|flv|f4v|swf|webm|mpeg-2)$/i)
    }
    let result = false;
    for (let type of types) {
        let re = cacheRegex[type]
        if (!re) continue;
        result = re.test(name);
    }
    return result;
}


try {
    search(directories, searchParam, options);
    process.exit(1);
} catch (err) {
    process.exit(0);

}

// search('/media/jose/DATA', '', {
//     hiddenFiles: false,
//     levels: 8,
//     selectedFileTypes: ['video'],
//     avoidFiles: ['node_modules', 'env', '$Recycle.Bin', '.pyc', 'Windows'],
//     reportFound: true
// });