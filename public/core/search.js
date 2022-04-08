
const fs = require('fs');
const path = require('path');



class Search {
    constructor() {
        this.stopped = false;
    }

    search(directories, searchParam = '', options = { hiddenFiles: false, levels: null, reportFound: true }, event) {
        if (this.stopped) return;
        let onlyRoot = false;

        if (!directories || !directories?.length) {
            directories = ['/', '/media'];
            onlyRoot = true;
        }

        if (!searchParam)
            onlyRoot = true;

        directories = directories instanceof Array ? directories : [directories];
        directories = directories.map((el) => ({ link: el, level: 0 }));
        let level = 0;

        try {
            let result = [];
            let queue = [...directories];
            for (let dir of queue) {
                if (this.stopped) return;
                let output;
                level = dir.level;
                try {
                    output = fs.readdirSync(dir.link, { withFileTypes: true });
                } catch (e) {
                    continue;
                }
                let re = /^(?!\.).*$/;
                for (let element of output) {
                    if (this.stopped) return;
                    if (!options.hiddenFiles && !re.test(element.name))
                        continue;

                    let isDirectory = false;
                    try {
                        isDirectory = fs.lstatSync(path.join(dir.link, element.name)).isDirectory();
                    } catch (e) {
                        continue
                    }
                    const found = this.filterElement(searchParam, element, dir.link, isDirectory);
                    if (found) {
                        // console.log("🚀 ~ file: search.js ~ line 59 ~ filterElement ~ found", found);
                        result.push(found);
                        if (options.reportFound)
                            event.reply('found-result', { data: found })
                    }

                    if (!onlyRoot && level <= options.levels) {
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

    getMedataFile(res, fullPath, isDirectory) {
        const meta = { name: res.name, path: fullPath, isDirectory };
        try {
            if (!isDirectory) {
                let data = fs.statSync(fullPath);
                var fileSizeInMegabytes = data.size / (1024 * 1024);
                if (fileSizeInMegabytes > 1) {
                    meta.size = fileSizeInMegabytes.toPrecision(2) + ' mB';
                }
                if (fileSizeInMegabytes > 1e-3) {
                    meta.size = (1024 * fileSizeInMegabytes).toFixed(2) + ' kB';
                } else {
                    meta.size = (1024 * 1024 * fileSizeInMegabytes).toFixed(2) + ' bytes';
                }
                meta.mimetype = path.extname(fullPath).split('.')[1];
            }
            return meta;
        } catch (e) {
            return null;
        }
    }

    filterElement(searchParam, element, parentDir, isDirectory) {
        const elementName = element.name.toLowerCase();
        const searchItem = searchParam.toLowerCase().trim();
        let indexSearch = null;
        if (searchParam instanceof RegExp) {
            indexSearch = elementName.search(searchItem);
        } else {
            indexSearch = elementName.includes(searchItem);
        }
        if (indexSearch > -1 && indexSearch) {
            let found = this.getMedataFile(element, path.join(parentDir, element.name), isDirectory)
            return found
        }
        return null

    }
    setStopped(state) {
        this.stopped = state;
    }
}


module.exports = new Search();
