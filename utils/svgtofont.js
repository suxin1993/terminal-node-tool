const svgtofont = require("svgtofont");
require("colors");
const { pathJoinDir, exitsFolder, getbaseFiles, findSync, writeFileAsync, readFile } = require("./node-operate-folder.js")
let filepath = pathJoinDir(__dirname, '../svg')
let FontPath = pathJoinDir(__dirname, '../font')


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



async function svgfont() {
    await isPathSure()
    let list = getbaseFiles(filepath, "svg")
    if (list.length == 0) {
        console.log(`路径下不存在svg文件`.bold.red);
        return '路径下不存在svg文件'
    } else {
        for (let index = 0; index < list.length; index++) {
            const e = list[index];
            svgtofont({
                src: filepath, // svg 图标目录路径
                dist: FontPath, // 输出到指定目录中
                fontName: "svgtofont", // 设置字体名称
                css: true, // 生成字体文件
            }).then(() => {
                console.log('done!');
            });
            // console.log(`${e}文件已经转化`.bold.blue);
        }
        return '路径下的svg文件已经开始转化'
    }
}
svgfont()
// module.exports = svgfont