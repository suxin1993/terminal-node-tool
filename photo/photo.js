require("colors");
const { pathJoinDir, exitsFolder, getbaseTypeFiles, writeFileAsync, readFile, getStat, renamePath, pathExtname, pathBasefilename, parsePath } = require("../utils/node-operate-folder.js")
let filepath = pathJoinDir(__dirname, './')

const { getGaodeAdress, ToDigital, GPS } = require("./gaodeLocation")
const { getExifInfo } = require("./exif")
const utils = require("../utils/utils")

/*
 * @Author: your name
 * @Date: 2021-02-26 16:18:04
 * @LastEditTime: 2021-09-07 15:02:54
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
        if (value.indexOf(type) != -1) {
            let time = value.substring(type.length, value.length)
            return time
        }
    }
    return false
}
// remove 删除 removeold
async function removeold(e) {
    let ext = pathExtname(e)
    let parePath = parsePath(e)
    let oldName = pathBasefilename(e)
    if (oldName.indexOf('oldname') !== -1) {
        let newFileName = oldName.substring(oldName.indexOf('oldname') + 8, oldName.length)
        let newFile = pathJoinDir(parePath, `${newFileName}${ext}`)
        await renamePath(e, newFile)
    }
}

// reback 还原 reback 
async function reback(e) {
    let ext = pathExtname(e)
    let parePath = parsePath(e)
    let oldName = pathBasefilename(e)
    if (oldName.indexOf('oldname') !== -1) {
        let newFileName = oldName.substring(0, oldName.indexOf('oldname') - 1)
        let newFile = pathJoinDir(parePath, `${newFileName}${ext}`)
        await renamePath(e, newFile)
    }
}
// replace 替换名字 replace
async function replace(e) {
    let ext = pathExtname(e)
    let parePath = parsePath(e)
    let oldName = pathBasefilename(e)
    if (oldName.indexOf(process.argv[5]) !== -1) {
        let newFileName = oldName.replace(process.argv[5], process.argv[6])
        let newFile = pathJoinDir(parePath, `${newFileName}${ext}`)
        await renamePath(e, newFile)
    }
}

let mapName = {}
async function photo() {
    await isPathSure()
    let list = getbaseTypeFiles(filepath, [".jpg", ".jpeg", ".JPG",".JPEG"])
    if (list.length == 0) {
        console.log(`路径下不存在jpg文件`.bold.red);
        return '路径下不存在jpg文件'
    } else {
        for (let index = 0; index < list.length; index++) {
            let addInforesp = 'noAddress'
            let Make = 'noDevice'
            let incident = 'noPeople'
            let Stime = "无时间"
            let Shooting = 0
            const e = list[index];
            let exifFileDate = {}
            let ext = pathExtname(e)
            let parePath = parsePath(e)
            let oldName = pathBasefilename(e)
            if (process.argv[4]) {
                // 并且是汉字
                if (process.argv[4] == 'removeold') {
                    removeold(e)
                    continue
                }
                if (process.argv[4] == 'reback') {
                    reback(e)
                    continue
                }
                if (process.argv[4] == 'replace') {
                    replace(e)
                    continue
                }
                incident = process.argv[4]
            }
            if (Shooting == 0) {
                Shooting = await getStat(e)
                Shooting = new Date(Shooting.mtime).valueOf()
                console.log('文件的修改时间:' + utils.formatTime(Shooting, 'yyyy.MM.dd-hh时mm分ss秒').bold.blue)
            }
            let wexinTime = fomtWexin(oldName, ['mmexport', 'wx_camera_', ])
            if (wexinTime) {
                Shooting = wexinTime
                console.log(oldName + '微信名字中的时间' + utils.formatTime(Shooting, 'yyyy.MM.dd-hh时mm分ss秒').bold.blue)
            }
            try {
                //获取exif信息
                exifFileDate = await getExifInfo(e)
            } catch (error) {
                console.log(`${e}文件不存在exif信息`.bold.red);
            }
            try {

                if (exifFileDate.image.ModifyDate) {
                    Shooting = new Date(reBackTime(exifFileDate.image.ModifyDate)).valueOf()
                    console.log('拍摄时间:' + utils.formatTime(Shooting, 'yyyy.MM.dd-hh时mm分ss秒').bold.blue)
                } else if (exifFileDate.exif.DateTimeOriginal) {
                    Shooting = new Date(reBackTime(exifFileDate.exif.DateTimeOriginal)).valueOf()
                    console.log('拍摄时间:' + utils.formatTime(Shooting, 'yyyy.MM.dd-hh时mm分ss秒').bold.blue)
                }
                if (exifFileDate.image.Make) {
                    exifFileDate.image.Make = clearString(exifFileDate.image.Make);
                    exifFileDate.image.Model = clearString(exifFileDate.image.Model)
                    Make = `${exifFileDate.image.Make}-${exifFileDate.image.Model}`
                }
                exifFileDate.gps.lat = ToDigital(exifFileDate.gps.GPSLatitude[0], exifFileDate.gps.GPSLatitude[1], exifFileDate.gps.GPSLatitude[2])
                exifFileDate.gps.lon = ToDigital(exifFileDate.gps.GPSLongitude[0], exifFileDate.gps.GPSLongitude[1], exifFileDate.gps.GPSLongitude[2])
                // exifFileDate.image.ModifyDate
                ret = GPS.gcj_encrypt(+exifFileDate.gps.lat, +exifFileDate.gps.lon); // 函数返回转换后的高德坐标
                // 获取地理位置
                let JsonString = await getGaodeAdress(ret.lon, ret.lat)
                addInforesp = JsonString.regeocode.formatted_address
                console.error(addInforesp)

            } catch (error) {
                addInforesp = '无GPS'
                console.log(`${e}文件不存在GPS信息`.bold.red);
            }
            Stime = utils.formatTime(Shooting, 'yyyy.MM.dd-hh时mm分ss秒')
            let newFileRamaparsed = `${Stime}-pe[${incident}]-ad[${addInforesp}]-[${Make}]`
            if (mapName.hasOwnProperty(newFileRamaparsed)) {
                console.log(`重复的时间: ${ Stime }`.bold.red)
                const randomEntryTime = Math.floor(Math.random() * 45000 + 15000)
                Shooting = Shooting + randomEntryTime
                Stime = utils.formatTime(Shooting, 'yyyy.MM.dd-hh时mm分ss秒')
                console.log(`修改后的时间: ${ Stime }`.bold.red)
                newFileRamaparsed = `${Stime}-pe[${incident}]-ad[${addInforesp}]-[${Make}]`
                mapName[newFileRamaparsed] = true
            } else {
                mapName[newFileRamaparsed] = true
            }
            let addOldnewFileRamaparsed = `${oldName}]oldname-${newFileRamaparsed}`
            // // 修改名字
            let newFileName = pathJoinDir(parePath, `${addOldnewFileRamaparsed}${ext}`)
            console.error(newFileName)
            if (oldName.indexOf('oldname') !== -1) {
                console.log(`${e}文件名存在oldname，不修改`.bold.red);
            } else {
                await renamePath(e, newFileName)
            }
        }
        // 判断是否重复
        return '路径下的jpg文件已经开始转化'
    }
}

module.exports = photo