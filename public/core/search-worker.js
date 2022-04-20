

const fs = require('fs');
const path = require('path');

const { filterElement } = require('./helpers');

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