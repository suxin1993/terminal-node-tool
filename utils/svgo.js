/*
 * @Author: your name
 * @Date: 2021-08-28 18:03:23
 * @LastEditTime: 2021-08-30 16:26:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /terminal-node-tool/utils/svgo.js
 */

const { optimize } = require('svgo');
require("colors");
const { pathJoinDir, exitsFolder, getbaseFiles, findSync, writeFileAsync, readFile } = require("./node-operate-folder.js")
let filepath = pathJoinDir(__dirname,'../svg')



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



async function svgo() {
    await isPathSure()
    let list = getbaseFiles(filepath, "svg")
    if (list.length == 0) {
        console.log(`路径下不存在svg文件`.bold.red);
        return '路径下不存在svg文件'
    } else {
        for (let index = 0; index < list.length; index++) {
            const e = list[index];
            let data = await readFile(e)
            const result = optimize(data, {
                // optional but recommended field
                path: e,
                // all config fields are also available here
                multipass: true,
            });
            await writeFileAsync(e, result.data)
            console.log(`${e}文件已经转化`.bold.blue);
        }
        return '路径下的svg文件已经开始转化'
    }
}

module.exports = svgo