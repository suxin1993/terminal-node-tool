/*
 * @Author: your name
 * @Date: 2021-02-26 16:18:04
 * @LastEditTime: 2021-08-31 15:10:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \getPictureLocation\main.js
 */
// 文件路径：photo-archives.js
/**
 * NodeJs 获取照片拍摄日期和视频拍摄日期，并按日期目录存档
 * 功能：NodeJs 获取照片拍摄日期和视频拍摄日期，并按日期目录存档
 * 使用：node photo-archives.js
 * 扩展包：
 *     npm install exif
 *     npm install ffprobe
 *     npm install ffprobe-static
 *     npm install pify
 */

// 引用 fs 文件系统模块
const fs = require('fs')

const fsPromise = require('fs').promises
// 引用 path 路径处理模块
const path = require('path');
// 安装并引用 exif 图像元数据处理模块
const NmExif = require('exif')
// 安装并引用 ffprobe 视频元数据处理模块
const NmFfprobe = require('ffprobe')
const NmFfprobeStatic = require('ffprobe-static');
// 安装并引用 Promise 自动转换回调方法模块
const NmPify = require('pify');
const https = require("https");
const piexif = require("piexifjs");
// 配置信息
const config = require('../lib/lib-photo.json');

// 先获取图片文件exif信息

// 获取文件夹下的目录信息
function getdir(startPath) {
    let result = [];

    function finder(paths) {
        let files = fs.readdirSync(paths);
        files.forEach((val, index) => {
            let fPath = path.join(paths, val);
            let stats = fs.statSync(fPath);
            if (stats.isDirectory()) finder(fPath);
            if (stats.isFile()) {
                result.push(fPath);
                rebackName(fPath)
            }
        });
    }
    finder(startPath);
    return result;
}
async function rebackName(filePath) {

    // 获取绝对路径
    const FileRamaPath = path.join(__dirname, filePath)
    // 获取文件名字
    let FileRamaPathBaseName = path.basename(FileRamaPath)
    // 获取文件扩张名
    let FileRamaPathExtName = path.extname(FileRamaPath)
    // 获取文件的路径
    let FileRamaPathdirName = path.dirname(FileRamaPath)
    // 去掉扩展名
    let FileRamaparsed = path.parse(FileRamaPath).name
    let newFileRamaparsed = FileRamaparsed
    if (FileRamaparsed.indexOf('oldname') !== -1) {
        console.error(FileRamaparsed.indexOf('oldname'))
        newFileRamaparsed = FileRamaparsed.substring(0, FileRamaparsed.indexOf('oldname') - 1)
        console.error(FileRamaparsed.substring(0, FileRamaparsed.indexOf('oldname') - 1))
        fsPromise.rename(FileRamaPath, `${__dirname}//${'test/'}${newFileRamaparsed}${FileRamaPathExtName}`)
    } else if (FileRamaparsed.indexOf('ad') !== -1) {
        console.error(FileRamaparsed.indexOf('ad'))
        newFileRamaparsed = FileRamaparsed.substring(0, FileRamaparsed.indexOf('ad') - 1)
        console.error(FileRamaparsed.substring(0, FileRamaparsed.indexOf('ad') - 1))
        fsPromise.rename(FileRamaPath, `${__dirname}//${'test/'}${newFileRamaparsed}${FileRamaPathExtName}`)
    }

}
let reslute = getdir('./reBack');