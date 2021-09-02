require("colors");
const { pathJoinDir, exitsFolder, getbaseFiles, writeFileAsync, readFile } = require("../utils/node-operate-folder.js")
let filepath = pathJoinDir(__dirname,'./')

const {getGaodeAdress} =require("./gaodeLocation")




async function isPathSure() {
    if (process.argv[3]) {
        filepath = process.argv[3]
        //判断路径是否存在
        if (await exitsFolder(filepath)) {
            console.log(`路径存在:${filepath}`.bold.blue);
        } else {
            console.log(`路径不存在:${filepath}`.bold.red);
            throw "路径不存在"
        }
    } else {
        console.log(`无参数，选择默认${filepath}文件夹下的文件`.bold.blue);
    }
}



async function photo() {
    await isPathSure()
    
    let list = getbaseFiles(filepath, "jpg")
    if (list.length == 0) {
        console.log(`路径下不存在jpg文件`.bold.red);
        return '路径下不存在jpg文件'
    } else {
        for (let index = 0; index < list.length; index++) {
            const e = list[index];
            console.log(`${e}文件已经转化`.bold.blue);
        }
        //获取exif信息


        // 获取地理位置
        getGaodeAdress(110.4512,28.4578)
        return '路径下的jpg文件已经开始转化'
    }
}

module.exports = photo