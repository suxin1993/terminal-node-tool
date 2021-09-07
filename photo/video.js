/*
 * @Author: your name
 * @Date: 2021-09-07 15:08:53
 * @LastEditTime: 2021-09-07 15:08:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /terminal-node-tool/photo/video.js
 */
const NmFfprobe = require('ffprobe')
const NmFfprobeStatic = require('ffprobe-static');

exifData = await NmFfprobe(currentPath, {
    path: NmFfprobeStatic.path
})