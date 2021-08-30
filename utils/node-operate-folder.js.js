let fs = require('fs')
let paths = require('path')
let os = require('os')
let readline = require('readline')


// 同步写入磁盘
exports.writeFileAsync = async function(_path, data) {
    return new Promise((res, rej) => {
        fs.writeFile(_path, data, (err) => {
            if (err) {
                // myApp.log.error('[writeFileAsync] 失败')
                // myApp.log.error(err)
                rej(err)
            }
            res()
        })
    })
}

// 追加写入磁盘
exports.appendFileAsync = async function(_path, data) {
    return new Promise((res, rej) => {
        fs.appendFile(_path, data, (err) => {
            if (err) {
                // myApp.log.error('[writeFileAsync] 失败')
                // myApp.log.error(err)
                rej(err)
            }
            res()
        })
    })
}


// 逐行读取


/**
 * 删除文件
 * @param  {string} fileName 文件名 file.mtl
 */
exports.delFile = async function(dir, fileName) {
    return new Promise((res, rej) => {
        fs.unlink(getFullFileName(dir, fileName), function(err) {
            if (err) {
                rej(err)
                console.log('删除文件失败：' + file);
            }
        });
        res()
    })
}

/**
 * 获取完整文件路径
 * @param  {string} fileName 文件名 file.mtl
 */
exports.getFullFileName = function(dir, fileName) {
    return paths.join(dir, fileName);
}

/**
 * 相对路径获取绝对路径
 * @param  {string} dir 路径
 */
exports.getDirname = function(dirname, dir) {
    return paths.join(__dirname, `../../../${dir}`)
}





exports.readFile = async function(fileName) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fileName, function(err, data) {
            if (err) reject(err);
            resolve(data);
        });
    });
}


//读取文件夹,获得文件夹中的文件列表
let findSync = function(startPath) {
    const result = {};

    function finder(path) {
        const files = fs.readdirSync(path);
        files.forEach((val) => {
            const fPath = paths.join(path, val);
            const stats = fs.statSync(fPath);
            if (stats.isDirectory()) finder(fPath);
            if (stats.isFile()) result[fPath] = new Date(stats.mtime).valueOf()
        });
    }
    finder(startPath);
    return result;
}
exports.findSync = findSync

/* 判断文件存在 */
exports.isFileExisted = async function(path_way) {
    return new Promise((resolve, reject) => {
        fs.access(path_way, (err) => {
            if (err) {
                reject(false); //"不存在"
            } else {
                resolve(true); //"存在"
            }
        })
    })
}

exports.awaitAll = async function(filePath, fileDatas) {
    filePath.forEach(async (item) => {
        const allfileDate = await readFile(item)
    })
}


// 循环下异步转化为同步
exports.asyncAlls = async function(filePath, fileDatas) {
    try {
        for (let index = 0; index < filePath.length; index++) {
            fileDatas[paths.basename(filePath[index])] = await readFile(filePath[index])
        }
        return fileDatas
    } catch (error) {
        throw new Error(error)
    }
}
//创建文件夹
let mkdirAsync = async function(_path) {
    return new Promise((res, rej) => {
        fs.mkdir(_path, (err) => {
            if (err) rej(err)
            res()
        })
    })
}
exports.mkdirAsync = mkdirAsync

/**
 * 读取路径信息
 * @param {string} path 路径
 */
let getStat = async function(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) {
                resolve(false);
            } else {
                resolve(stats);
            }
        })
    })
}
exports.getStat = getStat



/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
let dirExists = async function(dir) {
    let isExists = await getStat(dir);
    //如果该路径且不是文件，返回true
    if (isExists && isExists.isDirectory()) {
        return true;
    } else if (isExists) { //如果该路径存在但是文件，返回false
        return false;
    }
    //如果该路径不存在
    let tempDir = paths.parse(dir).dir; //拿到上级路径
    //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
    let status = await dirExists(tempDir);
    let mkdirStatus;
    if (status) {
        mkdirStatus = await mkdirAsync(dir);
    }
    return mkdirStatus;
}
exports.dirExists = dirExists

/**
 * 获取相对路径的文件名
 * @param {string} dir 路径
 */
let pathBasename = function(dir) {
    return paths.basename(dir)
}
exports.pathBasename = pathBasename

/**
 * 获取文件名除了后缀名以外名字
 * @param {string} dir 路径
 */
exports.pathBasefilename = function(dir) {
    let ext = paths.extname(paths.basename(dir))
    return paths.basename(dir, ext)
}
/**
 * 拼接路径
 * @param {string} dir 路径
 */
exports.pathJoinDir = function(dir, dirTwo) {
    return paths.join(dir, dirTwo)
}




/**
 * 文件扩展名
 * @param {string} flleName 文件名
 */
let pathExtname = function(flleName) {
    return paths.extname(flleName)
}
exports.pathExtname = pathExtname

/**
 * 获取某个相对路径下所有为某种扩展名的文件名
 * getbaseFiles('./', '.vue')
 * @param {string} dir 路径
 */

exports.getbaseFiles = function(url, ext) {
    let list = findSync(url)
    let extList = []
    for (const key in list) {
        if (pathExtname(pathBasename(key)) == `.${ext}`) {
            extList.push(key)
        }
    }
    return extList
}

/**
 * 逐行读取
 * @param {string} dir 路径
 */
exports.linCreateObjetc = async function(dir) {
    const rl = readline.createInterface({
        input: fs.createReadStream(dir),
        output: process.stdout,
        terminal: false
    });
    return new Promise((resolve, reject) => {
        let CMDObject = {}
        let index = 0
        rl.on('line', (line) => {
            if (line.indexOf("=") !== -1) {
                let lineCmd = parseInt(line.substr(line.indexOf("=") + 1))
                if (!isNaN(lineCmd)) {
                    index++
                    CMDObject[lineCmd] = {}
                    CMDObject[lineCmd].desc = line.substr(line.indexOf("//") + 2)
                    CMDObject[lineCmd].EnglishDesc = line.substring(line.indexOf("CMD"), line.indexOf("=")).replace(/\s*/g, "")
                }
            }
        });
        setTimeout(() => {
            console.error(index)
            resolve(CMDObject);
        }, 1000)
    })
}


// 传入文件夹的路径看是否存在，存在不用管，不存在则直接创建文件夹
/**
 * 判断文件夹是否存在，不存在可以直接创建
 * @param reaPath {String} 文件路径
 * @returns {Promise<boolean>}
 */
exports.exitsFolder = async function(reaPath) {
    try {
        let abc = await fs.promises.stat(reaPath)
        return true
    } catch (e) {
        return false
        // 不存在文件夹，直接创建 {recursive: true} 这个配置项是配置自动创建多个文件夹
        // await fs.promises.mkdir(absPath, {recursive: true})
    }
}


/**
 * 获取路径
 * @param reaPath {String} 文件路径
 */
exports.parsePath = function(reaPath) {
    let abc = paths.join(reaPath, '../')
    return abc
}

/**
 * 获取绝对路径
 * @param reaPath {String} 文件路径
 */
exports.resolvePath = function(reaPath) {
    let abc = paths.resolve(reaPath)
    return abc
}