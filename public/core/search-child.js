const fs = require('fs');
const path = require('path');
const { filterElement } = require('./helpers');

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
    console.log(`/////********ENTRE EN EL SEARCH PID ${process.pid}********///////////`) // prints "pin
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
                    result.push(found);
                    if (process?.send) {
                        process.send(JSON.stringify({ message: 'found', data: found }), undefined, undefined, (e) => {
                            if (e) {
                                console.log('!!!!!!!got err!!!!!!!!!!', e);
                                process.kill(process.pid);
                                process.exit(1);
                            }

                        });
                    } else {
                        process.exit(0);
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
        console.log("******Error graveeeeee: ", e.message);
    }

}



// const { directories, searchParam = '', options } = workerData;

const directories = JSON.parse(process.argv[2]);
const searchParam = process.argv[3];
const options = JSON.parse(process.argv[4]);

process.on("message", (message) => {
    // console.log(`MEssage on PID:${process.pid} is: ${message}`);
    switch (message) {
        case "start":
            search(directories, searchParam, options);
            process.send(JSON.stringify({ message: 'finish' }), undefined, undefined, (e) => {
                if (e) {
                    console.log('!!!!!!!got err!!!!!!!!!!', e);
                    process.kill(process.pid);
                    process.exit(1);
                }
            });

            break;
        default:
            break;

    }
})

