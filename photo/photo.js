require("colors");
const { pathJoinDir, exitsFolder, getbaseTypeFiles, writeFileAsync, readFile } = require("../utils/node-operate-folder.js")
let filepath = pathJoinDir(__dirname, './')

const { getGaodeAdress, ToDigital, GPS } = require("./gaodeLocation")
const { getExifInfo } = require("./exif")
const utils = require("../utils/utils")

/*
 * @Author: your name
 * @Date: 2021-02-26 16:18:04
 * @LastEditTime: 2021-09-06 21:24:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \getPictureLocation\main.js
 */

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

// exif信息中特殊的时间转换
function reBackTime(vale) {
    // yyyy-MM-dd HH:mm:ss
    const Times = vale.split(' ')
    return `${Times[0].replace(/:/, "-")} ${Times[1]}`
}
//正则去掉字符串中的特殊字符
function clearString(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    rs = rs.replace(/\s+/g, "");
    rs = rs.replace(/\u0000/g, "");
    return rs;
}
// 判断是否为微信,并且进行截取
function fomtWexin(value, types) {

    for (let index = 0; index < types.length; index++) {
        const type = types[index];
        console.log(type)
        if (value.indexOf(type) != -1) {
            let time = value.substring(type.length, value.length)
            let sTime = utils.formatTime(time.valueOf(), 'yyyy.MM.dd-hh时mm分ss秒')
            console.log(value + '微信名字时间' + sTime)
            return sTime
        }
    }
    return false
}
let addInforesp = 'noAddress'
let Make = 'noDevice'
let incident = '无事件'
let Stime = "无时间"
async function photo() {
    await isPathSure()

    let list = getbaseTypeFiles(filepath, [".jpg", ".jpeg"])
    if (list.length == 0) {
        console.log(`路径下不存在jpg文件`.bold.red);
        return '路径下不存在jpg文件'
    } else {
        for (let index = 0; index < list.length; index++) {
            const e = list[index];
            try {
                //获取exif信息
                let exifFileDate = await getExifInfo(e)
                try {
                    console.error(typeof(exifFileDate))
                    console.error(exifFileDate.image)
                    if (exifFileDate.image.ModifyDate) {
                        const TimesT = new Date(reBackTime(exifFileDate.image.ModifyDate))
                        Stime = utils.formatTime(TimesT.valueOf(), 'yyyy.MM.dd-hh时mm分ss秒')
                        console.log('拍摄时间:' + Stime)
                    } else if (exifFileDate.exif.DateTimeOriginal) {
                        const TimesT = new Date(reBackTime(exifFileDate.exif.DateTimeOriginal))
                        Stime = utils.formatTime(TimesT.valueOf(), 'yyyy.MM.dd-hh时mm分ss秒')
                        console.log('拍摄时间:' + Stime)
                    }
                    if (exifFileDate.image.Make) {
                        exifFileDate.image.Make = clearString(exifFileDate.image.Make);
                        exifFileDate.image.Model = clearString(exifFileDate.image.Model)
                        Make = `${exifFileDate.image.Make}-${exifFileDate.image.Model}`
                        console.log(Make)
                    }
                    exifFileDate.gps.lat = ToDigital(exifFileDate.gps.GPSLatitude[0], exifFileDate.gps.GPSLatitude[1], exifFileDate.gps.GPSLatitude[2])
                    exifFileDate.gps.lon = ToDigital(exifFileDate.gps.GPSLongitude[0], exifFileDate.gps.GPSLongitude[1], exifFileDate.gps.GPSLongitude[2])
                    // exifFileDate.image.ModifyDate
                    ret = GPS.gcj_encrypt(+exifFileDate.gps.lat, +exifFileDate.gps.lon); // 函数返回转换后的高德坐标
                    console.error(ret)
                    // 获取地理位置
                    await getGaodeAdress(ret.lon, ret.lat)
                } catch (error) {
                    addInforesp = '无GPS'
                    console.log(error)
                    console.log(`${e}文件不存在GPS信息`.bold.red);
                }
            } catch (error) {
                console.log(`${e}文件不存在exif信息`.bold.red);
            }
            console.log(`${e}文件已经转化`.bold.blue);
        }
        // 判断是否重复
        return '路径下的jpg文件已经开始转化'
    }
}

module.exports = photo