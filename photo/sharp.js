/*
 * @Author: your name
 * @Date: 2021-09-10 21:30:34
 * @LastEditTime: 2021-09-10 21:35:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /terminal-node-tool/photo/sharp.js
 */
const sharp = require("sharp");

const { pathJoinDir, exitsFolder, getbaseTypeFiles, writeFileAsync, readFile, getStat, renamePath, pathExtname, pathBasefilename, parsePath } = require("../utils/node-operate-folder.js")
let filepath = pathJoinDir(__dirname, './photo.jpeg')
let filepathNew = pathJoinDir(__dirname, './photo_sharp.jpeg')
let filepathNewTow = pathJoinDir(__dirname, './photo_sharp2.jpeg')
sharp(filepath)
    .resize(300, 200)
    .toFile(filepathNew, err => {
        if (err) console.log(err)
    })
sharp(filepath)
    .threshold(128)
    .toFile(filepathNewTow, err => {
        if (err) console.log(err);
    })