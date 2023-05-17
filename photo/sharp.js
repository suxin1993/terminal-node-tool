/*
 * @Author: your name
 * @Date: 2021-09-10 21:30:34
 * @LastEditTime: 2021-09-10 21:35:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /terminal-node-tool/photo/sharp.js
 */
const sharp = require('sharp')

const {
    pathJoinDir,
    exitsFolder,
    getbaseTypeFiles,
    writeFileAsync,
    readFile,
    getStat,
    renamePath,
    pathExtname,
    pathBasefilename,
    parsePath,
} = require('../utils/node-operate-folder.js')
let filepath = pathJoinDir(__dirname, './photo.jpeg')
let filepathNew = pathJoinDir(__dirname, './photo_sharp.jpeg')
let filepathNewTow = pathJoinDir(__dirname, './photo_sharp2.jpeg')
sharp(filepath)
    .resize(300, 200)
    .toFile(filepathNew, (err) => {
        if (err) console.log(err)
    })
sharp(filepath)
    .threshold(128)
    .toFile(filepathNewTow, (err) => {
        if (err) console.log(err)
    })
const TextToSVG = require('text-to-svg')
const textToSVG = TextToSVG.loadSync()

const svgOptions = { x: 0, y: 0, fontSize: 150, anchor: 'top', attributes: { fill: 'red', stroke: 'black' } }

const svg = textToSVG.getSVG('格式', svgOptions)

sharp(filepath)
    // 注意这里不能直接传svg，要传Buffer
    .composite([
        {
            input: Buffer.from(svg),
            top: 0,
            left: 0,
        },
    ])
    .png()
    .toFile(filepathNew)

async function go() {
    const semiTransparentRedPng = Buffer.from('<svg><rect x="0" y="0" width="200" height="200" rx="50" ry="50"/></svg>')

    const semiTransparentRedPngs = await sharp({
        create: {
            width: 48,
            height: 48,
            channels: 4,
            background: { r: 0, g: 45, b: 65, alpha: 1 },
        },
    })
        .png()
        .toBuffer()

    const roundedCornerResizer = sharp(filepath)
        .composite([
            {
                input: semiTransparentRedPng,
                top: 0,
                left: 0,
            },
        ])
        .toFile(filepathNew, (err) => {
            if (err) console.log(err)
        })
    // .threshold(128) 偏移
}
// go()
