/*
 * @Author: suben 18565641627@163.com
 * @Date: 2023-04-26 14:49:27
 * @LastEditors: suben 18565641627@163.com
 * @LastEditTime: 2023-04-26 21:21:51
 * @FilePath: \terminal-node-tool\wordToMd\wordTomd.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

//用了自己魔幻编写的mammoth.js ，不过依旧需要下载mammoth版本的包，有很多依赖mammoth
const mammoth = require("../mammoth.js/lib/index.js");
require("colors");
const { pathJoinDir, exitsFolder, getbaseFiles, findSync, writeFileAsync, readFile,pathBasefilename,parsePath } = require("../utils/node-operate-folder.js")
let filepath = pathJoinDir(__dirname,'../wordToMd')



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



async function wordTomd() {
    await isPathSure()
    console.error(filepath)
    let list = getbaseFiles(filepath, "docx")
    if (list.length == 0) {
        console.log(`路径下不存在docx文件`.bold.red);
        return '路径下不存在docx文件'
    } else {
        for (let index = 0; index < list.length; index++) {
            let e = list[index];
            const result = await mammoth.convertToMarkdown({path: e});
            //获取baseName
            let parePath = parsePath(e)
            let oldName = pathBasefilename(e)
            let newFile = pathJoinDir(parePath, `${oldName}.md`)
            await writeFileAsync(newFile, result.value)     
            console.log(`${e}文件已经转化`.bold.blue);
        }
        return '路径下的docx文件已经开始转化'
    }
}
module.exports = wordTomd






