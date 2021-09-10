/*
 * @Author: your name
 * @Date: 2021-09-10 19:51:56
 * @LastEditTime: 2021-09-10 21:07:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /terminal-node-tool/photo/canvas.js
 */

const { createWriteStream } = require("fs");
// 获取文件名
const { basename, dirname } = require("path");

// 导入canvas库，用于裁剪图片
const { createCanvas, loadImage } = require("canvas");



const { pathJoinDir, exitsFolder, getbaseTypeFiles, writeFileAsync, readFile, getStat, renamePath, pathExtname, pathBasefilename, parsePath } = require("../utils/node-operate-folder.js")
let filepath = pathJoinDir(__dirname, './photo.jpeg')
async function picture() {
    const image = await loadImage(filepath);
    const { width, height } = image;
    const options = [width, height].map((item) => item / 4);
    const canvas = createCanvas(...options);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, ...options);

    // // test
    // const canvas = createCanvas(300, 300)
    // const ctx = canvas.getContext('2d')

    // // Write "Awesome!"
    // ctx.font = '30px Impact'
    // ctx.rotate(0.1)
    // ctx.fillText('Awesome!', 50, 100)

    // // Draw line under text
    // var text = ctx.measureText('Awesome!')
    // ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    // ctx.beginPath()
    // ctx.lineTo(50, 102)
    // ctx.lineTo(50 + text.width, 102)
    // ctx.stroke()

    // // Draw cat with lime helmet
    // const image = await loadImage(filepath)
    // ctx.drawImage(image, 0, 100, 200, 200)
    // 缩小图片的大小
    await writeFileAsync('./photo2.jpeg', canvas.toBuffer())

}

picture()
// archive.append(canvas.toBuffer(), { name: `${basename(path)}` });