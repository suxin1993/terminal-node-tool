/*
 * @Author: your name
 * @Date: 2021-09-02 11:29:17
 * @LastEditTime: 2021-09-07 12:38:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /terminal-node-tool/photo/exif.js
 */

let ExifImage = require('exif').ExifImage;


/**
 * 获取exif信息
 * @param  {string} filPath 路径
 */

let getExifInfo = async function(filPath) {
    return new Promise((res, rej) => {

        ExifImage({ image: filPath }, function(error, exifData) {
            if (error) {
                rej(error)
            }
            res(exifData)
        });
    })
}
exports.getExifInfo = getExifInfo