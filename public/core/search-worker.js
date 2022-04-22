

const fs = require('fs');
const path = require('path');
const { filterElement } = require('./helpers');
const { cpus } = require('os');
const { fork } = require("child_process");
const numCPUs = cpus().length;

const { parentPort, workerData } = require('worker_threads');
const { directories, searchParam = '', options } = workerData;

/** 
options: {
     hiddenFiles: true,
     levels: 8,
     selectedFileTypes: [ 'image', 'video' ],
     avoidFiles: [ 'node_modules', 'env', '$Recycle.Bin', '.pyc', 'Windows' ],
     multicores: true
     reportFound: true
}
*/
async function search(
    directories,
    searchParam = '',
    options = {
        hiddenFiles: false,
        levels: null,
        reportFound: true,
        avoidFiles: [],
        multicores: false,
        selectedFileTypes: [],
    },) {
    console.log("//////////////////********ENTRE EN EL SEARCH WORKER********////////////////////////", { directories, searchParam, options }) // prints "pin
    let onlyRoot = false;
    try {

        if (!directories || !directories?.length) {
            directories = ['/', '/media'];
            onlyRoot = true;
        }
        if (!searchParam && !options?.selectedFileTypes?.length) {
            onlyRoot = true;
        }
        directories = directories instanceof Array ? directories : [directories];
        directories = getMoreDirectories(directories, onlyRoot, options.hiddenFiles, options.avoidFiles);
        let result = [];

        if (!onlyRoot && options.multicores)
            return await distributeInMultipleCores(directories, result);
        else
            return singleCoreSearch(directories, searchParam, options, result, onlyRoot);
    } catch (e) {
        console.log(e);
    }

}

function getMoreDirectories(directories = [], onlyRoot, hiddenFiles = false, avoidFiles = []) {
    if (onlyRoot) return directories;
    for (let dir of directories) {
        if (directories.length >= numCPUs) break;
        let output = null;
        try {
            output = fs.readdirSync(dir);
        } catch (e) {
            continue;
        }
        let re = /^(?!\.).*$/;
        for (let element of output) {
            if (!hiddenFiles && !re.test(element))
                continue;
            if (avoidFiles?.length && avoidFiles.includes(element))
                continue;

            directories.push(path.join(dir, element));
        }
    }
    directories.shift();
    return [...directories];
}

function distributeInMultipleCores(directories, result) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, _) => {
        let distrib = []
        while (directories.length) {
            for (let i = 0; i < numCPUs && directories.length > 0; i++) {
                if (!distrib[i]) distrib[i] = []
                distrib[i].push(directories.shift());
            }
        }
        let childsProcess = [];
        let onLive = [];

        for (let coreData of distrib) {
            const child = fork(path.join(__dirname, 'search-child.js'), [JSON.stringify(coreData), searchParam, JSON.stringify(options)]);
            childsProcess.push(child);
            onLive.push(child.pid);
        }


        for (let child of childsProcess) {
            child.on("error", (err) => {
                console.log(`Error from child: ${err}`);
            });

            child.on("message", (data) => {
                data = JSON.parse(data);
                if (data?.message == "found") {
                    // console.log("🚀 ~ file: search-worker.js ~ line 72 ~ child.on ~ data", data.data);
                    result.push(data.data);
                    if (options.reportFound) {
                        parentPort.postMessage(data.data);
                    }
                }

                if (data?.message == "finish") {
                    console.log("Finish", child.pid);
                    child.kill();
                    onLive = onLive.filter((el) => el !== child.pid);
                    resolve(true);
                    !onLive.length ? process.exit(1) : null;
                }
            });
            child.send("start");

        }

        parentPort.on("message", (data) => {
            if (data.message == "kill") {
                console.log("Entre en el corte de todos los procesos", data)
                for (let child of childsProcess) {
                    child.kill();
                }
                onLive = [];
                resolve(true);
                process.exit(1);
            }
        })
    })
}



function singleCoreSearch(directories, searchParam, options, result, onlyRoot) {

    parentPort.on("message", (data) => {
        if (data.message == "kill") {
            process.exit(1);
        }
    })

    directories = directories.map((el) => ({ link: el, level: 0 }));

    let level = 0;
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
            const found = filterElement(searchParam, element, path.join(dir.link, element.name), isDirectory, fileStats, options);
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
    process.exit(1);
}


try {
    search(directories, searchParam, options);

} catch (err) {
    console.log("***************ERROR************", err);
    process.exit(0);
}

// console.time("time");
// const result = search('/', 'dgrid.rights', {
//     hiddenFiles: false,
//     levels: 10,
//     selectedFileTypes: [],
//     avoidFiles: ['node_modules', 'env', '$Recycle.Bin', '.pyc', 'Windows', '$RECYCLE.BIN'],
//     reportFound: true
// });
// console.timeEnd("time");
// console.log("result:", result.length)