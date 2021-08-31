/*
 * @Author: your name
 * @Date: 2021-02-26 16:18:04
 * @LastEditTime: 2021-08-31 15:10:08
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





// 时间转换
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

function fomtTime(value, type) {
    const time = new Date(parseInt(value));
    let formatTime = type || 'yyyy-MM-dd';
    const date = {
        // "Y+": time.getFullYear(),
        'M+': time.getMonth() + 1,
        'd+': time.getDate(),
        'h+': time.getHours(),
        'm+': time.getMinutes(),
        's+': time.getSeconds(),
        'q+': Math.floor((time.getMonth() + 3) / 3),
        'S+': time.getMilliseconds(),
    };
    if (/(y+)/i.test(formatTime)) {
        formatTime = formatTime.replace(
            RegExp.$1,
            (`${time.getFullYear()  }`).substr(4 - RegExp.$1.length),
        );
    }
    for (const k in date) {
        if (new RegExp(`(${  k  })`).test(formatTime)) {
            formatTime = formatTime.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ?
                date[k] :
                (`00${  date[k]}`).substr((`${  date[k]}`).length),
            );
        }
    }
    return formatTime;
}

// 坐标转换 度°分′秒″转度
function ToDigital(strDu, strFen, strMiao, len) {
    len = (len > 6 || typeof(len) == "undefined") ? 6 : len; //精确到小数点后最多六位   
    strDu = (typeof(strDu) == "undefined" || strDu == "") ? 0 : parseFloat(strDu);
    strFen = (typeof(strFen) == "undefined" || strFen == "") ? 0 : parseFloat(strFen) / 60;
    strMiao = (typeof(strMiao) == "undefined" || strMiao == "") ? 0 : parseFloat(strMiao) / 3600;
    var digital = strDu + strFen + strMiao;
    if (digital == 0) {
        return "";
    } else {
        return digital.toFixed(len);
    }
}

// 坐标转换 度转度°分′秒″
function ToDegrees(val) {
    if (typeof(val) == "undefined" || val == "") {
        return "";
    }
    var i = val.indexOf('.');
    var strDu = i < 0 ? val : val.substring(0, i); //获取度
    var strFen = 0;
    var strMiao = 0;
    if (i > 0) {
        var strFen = "0" + val.substring(i);
        strFen = strFen * 60 + "";
        i = strFen.indexOf('.');
        if (i > 0) {
            strMiao = "0" + strFen.substring(i);
            strFen = strFen.substring(0, i); //获取分
            strMiao = strMiao * 60 + "";
            i = strMiao.indexOf('.');
            strMiao = strMiao.substring(0, i + 4); //取到小数点后面三位
            strMiao = parseFloat(strMiao).toFixed(2); //精确小数点后面两位
        }
    }
    return strDu + "," + strFen + "," + strMiao;
}

//Gps坐标转为高德坐标(GPS坐标与火星坐标的转换)
var GPS = {
    PI: 3.14159265358979324,
    x_pi: 3.14159265358979324 * 3000.0 / 180.0,
    delta: function(lat, lon) {
        // Krasovsky 1940
        //
        // a = 6378245.0, 1/f = 298.3
        // b = a * (1 - f)
        // ee = (a^2 - b^2) / a^2;
        var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
        var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
        var dLat = this.transformLat(lon - 105.0, lat - 35.0);
        var dLon = this.transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.PI;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
        return { 'lat': dLat, 'lon': dLon };
    },
    //GPS---高德
    gcj_encrypt: function(wgsLat, wgsLon) {
        if (this.outOfChina(wgsLat, wgsLon))
            return { 'lat': wgsLat, 'lon': wgsLon };

        var d = this.delta(wgsLat, wgsLon);
        return { 'lat': wgsLat + d.lat, 'lon': wgsLon + d.lon };
    },
    outOfChina: function(lat, lon) {
        if (lon < 72.004 || lon > 137.8347)
            return true;
        if (lat < 0.8293 || lat > 55.8271)
            return true;
        return false;
    },
    transformLat: function(x, y) {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
        return ret;
    },
    transformLon: function(x, y) {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
        return ret;
    }
};
async function getHttp(url) {
    return new Promise((resolve, reject) => {
        https.get(url, resp => {
            let data = {}
            resp.on("data", function(chunk) {
                data += chunk;
            });
            resp.on("end", () => {
                resolve(data)
            });
            resp.on("error", err => {
                reject(err.message);
            });
        });
    })
}
// 先获取图片文件exif信息
const filePath = './exif/IMG_20180823_092213.jpg'

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
                let sTime = fomtTime(stats.mtime.valueOf(), 'yyyy.MM.dd-hh时mm分ss秒')
                exifFileDateFunction(fPath, sTime)
            }
        });
    }
    finder(startPath);
    return result;
}
// 判断条件,并且进行截取
function fomtWexin(value, types) {

    for (let index = 0; index < types.length; index++) {
        const type = types[index];
        console.log(type)
        if (value.indexOf(type) != -1) {
            let time = value.substring(type.length, value.length)
            let sTime = fomtTime(time.valueOf(), 'yyyy.MM.dd-hh时mm分ss秒')
            console.log(value + '微信名字时间' + sTime)
            return sTime
        }
    }
    return false
}




async function exifFileDateFunction(filePath, startTime) {
    // 判断是否有GPS信息
    let ret = {}
    let addInforesp = 'noAddress'
    let Make = 'noDevice'
    console.error('修改时间' + startTime)
    let Stime = startTime
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
    // 微信导出的文件的
    let wexinTime = fomtWexin(FileRamaparsed, ['mmexport', 'wx_camera_'])
    if (wexinTime) {
        Stime = wexinTime
    }

    try {
        let exifFileDate = await NmPify(NmExif.ExifImage)({
            image: filePath
        });
        // console.log(exifFileDate)
        if (exifFileDate.image.ModifyDate) {
            const TimesT = new Date(reBackTime(exifFileDate.image.ModifyDate))
            Stime = fomtTime(TimesT.valueOf(), 'yyyy.MM.dd-hh时mm分ss秒')
            console.log('拍摄时间:' + Stime)
        } else if (exifFileDate.exif.DateTimeOriginal) {
            const TimesT = new Date(reBackTime(exifFileDate.exif.DateTimeOriginal))
            Stime = fomtTime(TimesT.valueOf(), 'yyyy.MM.dd-hh时mm分ss秒')
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
    } catch (error) {
        addInforesp = '无GPS'
    }
    if (ret.lon) {
        try {
            const resp = await getHttp(`https://restapi.amap.com/v3/geocode/regeo?location=${ret.lon},${ret.lat}&key=${config.GaodeKey}`)
            // 字符串截取
            let JsonString = JSON.parse(resp.substring(resp.indexOf(']') + 1, resp.length))
            console.error(JsonString)
            addInforesp = JsonString.regeocode.formatted_address
        } catch (error) {
            addInforesp = '高德报错'
        }
    }
    // 写入exif信息,发现意义不大,暂时搁置
    // const jpeg = fs.readFileSync(filePath);
    // const data = jpeg.toString("binary");
    // let exifObj = piexif.load(data);
    // const addRes = `${exifObj["Exif"]['36864']}-${JsonString.toString("binary")}`
    // exifObj["Exif"]['36864'] = addRes;
    // const exifbytes = piexif.dump(exifObj);
    // const newData = piexif.insert(exifbytes, data);
    // const newJpeg = new Buffer(newData, "binary");
    // fs.writeFileSync(`${FileRamaPathdirName}//${newFileRamaparsed}-exif.${FileRamaPathExtName}`, newJpeg);



    let newFileRamaparsed = `${FileRamaparsed}]oldname-${Stime}-pe[noPeople]-ad[${addInforesp}]-[${Make}]`
    console.error(newFileRamaparsed)
    //过滤文件
    // if (!FileRamaPathExtName) {
    //     return;
    // }
    // FileRamaPathExtName = FileRamaPathExtName.substring(1).toLowerCase();
    // if (config.image_exts.includes(FileRamaPathExtName)) {
    //     prefix = 'IMG-';
    // } else if (config.video_exts.includes(FileRamaPathExtName)) {
    //     prefix = 'MOV-';
    // } else {
    //     // 过滤非图片和视频格式的文件
    //     return;
    // }
    // 假如是已经包含了的,就可以复制到另外一个文件夹中去
    // console.log(__dirname)
    // 需要判断来自于哪里
    if (FileRamaPathBaseName.indexOf('mmexpor') != -1 || FileRamaPathBaseName.indexOf('wx_camera_') != -1) {
        fsPromise.rename(FileRamaPath, `${__dirname}//${'weiXin/'}${newFileRamaparsed}${FileRamaPathExtName}`)
    } else {
        fsPromise.rename(FileRamaPath, `${__dirname}//${'photos/'}${newFileRamaparsed}${FileRamaPathExtName}`)
    }


}
let reslute = getdir('./test');
console.error(reslute.length)