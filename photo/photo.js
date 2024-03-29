require('colors')
const {
    pathJoinDir,
    exitsFolder,
    getbaseTypeFiles,
    writeFileAsync,
    readFile,
    getStat,
    renamePath,
    pathExtname,
    pathBasename,
    getParseDir,
    findDirNumber,
    pathBasefilename,
    parsePath,
} = require('../utils/node-operate-folder.js')
let filepath = pathJoinDir(__dirname, './')

const { getGaodeAdress, ToDigital, GPS } = require('./gaodeLocation')
const { getExifInfo } = require('./exif')
const utils = require('../utils/utils')

/*
 * @Author: your name
 * @Date: 2021-02-26 16:18:04
 * @LastEditTime: 2022-09-01 17:03:37
 * @LastEditors: subin 18565641627@163.com
 * @Description: In User Settings Edit
 * @FilePath: \getPictureLocation\main.js
 */

async function isPathSure() {
    if (process.argv[3]) {
        filepath = process.argv[3]
        //判断路径是否存在
        if (await exitsFolder(filepath)) {
            console.log(`路径存在:${filepath}`.bold.blue)
        } else {
            console.log(`路径不存在:${filepath}`.bold.red)
            throw '路径不存在'
        }
    } else {
        console.log(`无参数，选择默认${filepath}文件夹下的文件`.bold.blue)
    }
}

// exif信息中特殊的时间转换
function reBackTime(vale) {
    // yyyy-MM-dd HH:mm:ss
    const Times = vale.split(' ')
    return `${Times[0].replace(/:/, '-')} ${Times[1]}`
}
//正则去掉字符串中的特殊字符
function clearString(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]")
    var rs = ''
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '')
    }
    rs = rs.replace(/\s+/g, '')
    rs = rs.replace(/\u0000/g, '')
    return rs
}
// 判断是否为微信,并且进行截取
function fomtWexin(value, types) {
    for (let index = 0; index < types.length; index++) {
        const type = types[index]
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
        console.log(`替换后: ${newFile}`.bold.blue)
        await renamePath(e, newFile)
    }
}
async function oneStep(e) {}
async function move(e) {
    console.log('move')
    console.log(e)
    const oldNames = pathBasename(e)
    let parePath = parsePath(parsePath(e))
    let myname = e.split('-pe[')[1].split(']-ad')[0]
    if (process.argv[5]) {
        myname = process.argv[5]
    }
    //判断是否存在这个文件夹
    let newPath = pathJoinDir(pathJoinDir(parePath, '人物'), myname)
    console.error(newPath)
    if (await exitsFolder(newPath)) {
        console.error('存在')
        let DirNumber = findDirNumber(newPath)
        console.log(`${newPath}文件夹内文件数量：${DirNumber}`.bold.yellow)
        let newFile = pathJoinDir(newPath, oldNames)
        await renamePath(e, newFile)
        console.error(newFile)
    } else {
        console.error('不存在文件夹')
    }
}
async function moveFolder(e) {
    console.log('moveFolder')
    console.log(e)
    const oldNames = pathBasename(e)
    let parePath = parsePath(parsePath(parsePath(e)))
    let myname = getParseDir(e)

    //判断是否存在这个文件夹
    let newPath = pathJoinDir(pathJoinDir(parePath, '人物'), myname)
    console.error(newPath)
    if (await exitsFolder(newPath)) {
        console.error('存在')
        let DirNumber = findDirNumber(newPath)
        console.log(`${newPath}文件夹内文件数量：${DirNumber}`.bold.yellow)
        let newFile = pathJoinDir(newPath, oldNames)
        await renamePath(e, newFile)
        console.error(newFile)
    } else {
        console.error('不存在文件夹')
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
    let oldName = pathBasename(e) //pathBasefilename
    console.log(`替换前: ${oldName}`.bold.blue)
    if (oldName.indexOf(process.argv[5]) !== -1) {
        if (process.argv[7]) {
            if (oldName.indexOf(process.argv[7]) == -1) {
                return
            }
        }
        let newFileName = oldName.replace(process.argv[5], process.argv[6])
        let newFile = pathJoinDir(parePath, `${newFileName}`)
        console.log(`替换后: ${newFile}`.bold.yellow)
        await renamePath(e, newFile)
    }
}
//抽取oldName中的年月日
function replaceOldName(oldName, Shootings) {
    let Years = '0000'
    let Months = '00'
    let Days = '00'
    if (oldName.indexOf('年') !== -1) {
        Years = oldName.split('年')[0]
        Months = oldName.split('年')[1].split('月')[0]
        Days = oldName.split('年')[1].split('月')[1].split('日')[0]
        if (Number(Months) < 10 && Months.length < 2) {
            Months = 0 + Months
        }
        if (Number(Days) < 10 && Days.length < 2) {
            Days = 0 + Days
        }
    }
    console.log('文件的原本时间:' + utils.formatTime(Shootings, 'yyyy.MM.dd-hh时mm分ss秒').bold.blue)
    console.log('文件的适配后的时间:' + Years + '.' + Months + '.' + Days + '-' + utils.formatTime(Shootings, 'hh时mm分ss秒').bold.blue)
    return Years + '.' + Months + '.' + Days + '-' + utils.formatTime(Shootings, 'hh时mm分ss秒')
}

//changeTimeOne 修改时间多一秒
async function changeTimeOne(e) {
    let ext = pathExtname(e)
    let parePath = parsePath(e)
    let oldName = pathBasename(e) //pathBasefilename
    console.log(`替换前: ${oldName}`.bold.blue)
    let ChangeTime = oldName
    let ChangeTimeTwo = oldName
    let Time = oldName.substring(0, 20)
    Time = Time.replace('-', ' ')
    Time = Time.replace('时', ':')
    Time = Time.replace('分', ':')
    Time = Time.replace('秒', ' ')
    console.log(Time)
    let newTime = new Date(Time).valueOf() + 60000
    let newFileName = ChangeTimeTwo.replace(ChangeTime.substring(0, 20), utils.formatTime(newTime, 'yyyy.MM.dd-hh时mm分ss秒'))
    let newFile = pathJoinDir(parePath, `${newFileName}`)
    console.log(`替换后: ${newFile}`.bold.yellow)
    await renamePath(e, newFile)
}

//movePhone 添加修改时间到名字上面
async function movePhone(e) {
    let ext = pathExtname(e)
    let parePath = parsePath(e)
    let oldName = pathBasename(e) //pathBasefilename
    console.log(`替换前: ${oldName}`.bold.blue)
    //获取修改时间
    let Shootings = await getStat(e)
    Shootings = new Date(Shootings.mtime).valueOf()
    console.log('文件的修改时间:' + utils.formatTime(Shootings, 'yyyy.MM.dd-hh时mm分ss秒').bold.blue)
    if (oldName.match(/\d{13}/)) {
        Shootings = oldName.match(/\d{13}/)[0]
        console.log(oldName + '任意名字中的时间' + utils.formatTime(Shootings, 'yyyy.MM.dd-hh时mm分ss秒').bold.blue)
        return
    }
    let wexinTime = fomtWexin(oldName, ['mmexport', 'wx_camera_'])
    if (wexinTime) {
        Shootings = wexinTime
        console.log(oldName + '微信名字中的时间' + utils.formatTime(Shootings, 'yyyy.MM.dd-hh时mm分ss秒').bold.blue)
        return
    }
    try {
        //获取exif信息
        exifFileDate = await getExifInfo(e)
        console.log(`${oldName}文件存在exif信息`.bold.red)
        return
    } catch (error) {
        console.log(`${oldName}文件不存在exif信息`.bold.red)
    }
    let newFileName = `mmexport${Shootings}`
    let newFile = pathJoinDir(parePath, `${newFileName}${ext}`)
    console.log(`替换后: ${newFile}`.bold.yellow)
    await renamePath(e, newFile)
}

let mapName = {}
async function photo() {
    await isPathSure()
    let list = getbaseTypeFiles(filepath, ['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG'])
    if (list.length == 0) {
        console.log(`路径下不存在jpg文件`.bold.red)
        return '路径下不存在jpg文件'
    } else {
        for (let index = 0; index < list.length; index++) {
            let addInforesp = 'noAddress'
            let lonOrlat = '无经纬度'
            let Make = 'noDevice'
            let incident = 'noPeople'
            let Stime = '无时间'
            let Shooting = 0
            const e = list[index]
            let exifFileDate = {}
            let ext = pathExtname(e)
            let parePath = parsePath(e)
            let oldName = pathBasefilename(e)
            let oneStep = false
            if (process.argv[4]) {
                // 并且是汉字
                if (process.argv[4] == 'removeold') {
                    console.log(`removeold的数量${list.length}`.bold.red)
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
                if (process.argv[4] == 'move') {
                    move(e)
                    continue
                }
                if (process.argv[4] == 'moveFolder') {
                    moveFolder(e)
                    continue
                }
                if (process.argv[4] == 'movePhone') {
                    movePhone(e)
                    continue
                }
                if (process.argv[4] == 'changeTimeOne') {
                    changeTimeOne(e)
                    continue
                }
                incident = process.argv[4]
                if (process.argv[4] == 'oneStep') {
                    incident = process.argv[5]
                    oneStep = true
                }
                if (process.argv[4] == 'folder') {
                    incident = getParseDir(e)
                }
            }
            if (Shooting == 0) {
                Shooting = await getStat(e)
                Shooting = new Date(Shooting.mtime).valueOf()
                console.log('文件的修改时间:' + utils.formatTime(Shooting, 'yyyy.MM.dd-hh时mm分ss秒').bold.blue)
            }
            if (oldName.match(/\d{13}/)) {
                Shooting = oldName.match(/\d{13}/)[0]
                console.log(oldName + '任意名字中的时间' + utils.formatTime(Shooting, 'yyyy.MM.dd-hh时mm分ss秒').bold.blue)
            }
            let wexinTime = fomtWexin(oldName, ['mmexport', 'wx_camera_'])
            if (wexinTime) {
                Shooting = wexinTime
                console.log(oldName + '微信名字中的时间' + utils.formatTime(Shooting, 'yyyy.MM.dd-hh时mm分ss秒').bold.blue)
            }
            try {
                //获取exif信息
                exifFileDate = await getExifInfo(e)
            } catch (error) {
                console.log(`${e}文件不存在exif信息`.bold.red)
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
                    exifFileDate.image.Make = clearString(exifFileDate.image.Make)
                    exifFileDate.image.Model = clearString(exifFileDate.image.Model)
                    Make = `${exifFileDate.image.Make}-${exifFileDate.image.Model}`
                }
                exifFileDate.gps.lat = ToDigital(exifFileDate.gps.GPSLatitude[0], exifFileDate.gps.GPSLatitude[1], exifFileDate.gps.GPSLatitude[2])
                exifFileDate.gps.lon = ToDigital(exifFileDate.gps.GPSLongitude[0], exifFileDate.gps.GPSLongitude[1], exifFileDate.gps.GPSLongitude[2])
                // exifFileDate.image.ModifyDate
                ret = GPS.gcj_encrypt(+exifFileDate.gps.lat, +exifFileDate.gps.lon) // 函数返回转换后的高德坐标
                // 获取地理位置
                let JsonString = await getGaodeAdress(ret.lon, ret.lat)
                addInforesp = JsonString.regeocode.formatted_address
                let JsonLoctions = await getGaodeAdress(null, null, addInforesp)
                console.error(JsonLoctions.geocodes[0].location)
                lonOrlat = `${ret.lon}-${ret.lat}`
                console.error(lonOrlat)
                console.error(addInforesp)
            } catch (error) {
                console.error(error)
                lonOrlat = '无经纬度'
                addInforesp = '无GPS'
                console.log(`${e}文件获取地理位置失败信息`.bold.red)
            }
            Stime = utils.formatTime(Shooting, 'yyyy.MM.dd-hh时mm分ss秒')
            let newFileRamaparsed = `${Stime}-pe[${incident}]-ad[${addInforesp}]-[${Make}]-lon[${lonOrlat}]`
            // TODO:重复获取
            const editName = () => {}
            if (mapName.hasOwnProperty(newFileRamaparsed)) {
                console.log(`重复的时间: ${Stime}`.bold.yellow)
                Shooting = Shooting + Math.floor(Math.random() * 45000 + 15000)
                Stime = utils.formatTime(Shooting, 'yyyy.MM.dd-hh时mm分ss秒')
                console.log(`修改后的时间: ${Stime}`.bold.red)
                newFileRamaparsed = `${Stime}-pe[${incident}]-ad[${addInforesp}]-[${Make}]-lon[${lonOrlat}]`
                mapName[newFileRamaparsed] = true
            } else {
                mapName[newFileRamaparsed] = true
            }
            if (oldName.indexOf('年') !== -1) {
                console.log(`${e}文件名存在年，需要根据文件名修改`.bold.red)
                Stime = replaceOldName(oldName, Shooting)
                newFileRamaparsed = `${Stime}-pe[${incident}]-ad[${addInforesp}]-[${Make}]-lon[${lonOrlat}]`
            }
            let addOldnewFileRamaparsed = `${oldName}]oldname-${newFileRamaparsed}`
            // // 修改名字
            let newFileName = pathJoinDir(parePath, `${addOldnewFileRamaparsed}${ext}`)
            if (oneStep) {
                newFileName = pathJoinDir(parePath, `${newFileRamaparsed}${ext}`)
            }
            console.error(newFileName)
            if (oldName.indexOf('oldname') !== -1) {
                console.log(`${e}文件名存在oldname，不修改`.bold.red)
            } else {
                await renamePath(e, newFileName)
                if (oneStep) {
                    move(newFileName)
                }
            }
        }
        // 判断是否重复
        return '路径下的jpg文件已经开始转化'
    }
}

module.exports = photo
