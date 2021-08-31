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
const NmFs = require('fs')
// 引用 path 路径处理模块
const NmPath = require('path');
// 安装并引用 exif 图像元数据处理模块
const NmExif = require('exif')
// 安装并引用 ffprobe 视频元数据处理模块
const NmFfprobe = require('ffprobe')
const NmFfprobeStatic = require('ffprobe-static');
// 安装并引用 Promise 自动转换回调方法模块
const NmPify = require('pify');

// 配置信息
const config = {
    image_exts: ['jpg', 'png', 'gif', 'jpeg', 'webp', 'tiff'],
    video_exts: ['mp4', 'mov'],

}

/**
 * 移动照片和视频到日期目录
 * @param {String} fromDir 来源目录
 * @param {String} toDir 目标目录
 * @param {Boolean} isDebug 是否调试模式。调试模式只会在控制台输出信息，不会真正操作文件
 * @param {Boolean} isSkipExists 是否跳过已存在的目标文件
 */
async function movePhotos(fromDir, toDir, isDebug = true, isSkipExists = true) {
    if (!NmFs.existsSync(fromDir)) {
        console.log('path not exists: ', fromDir);
        return;
    }
    // 自动补齐路径符
    const SEP = NmPath.sep;
    if (!fromDir.endsWith(SEP)) {
        fromDir += SEP;
    }
    if (!toDir.endsWith(SEP)) {
        toDir += SEP;
    }
    // 打开目录
    const dir = await NmFs.promises.opendir(fromDir);
    // 声明变量，优化内存
    let ext = '',
        prefix = '',
        newDir = '',
        newPath = '',
        currentPath = '',
        stat = null,
        datestr = '',
        time = 0,
        date = null,
        exifData = null;
    for await (const dirent of dir) {
        // 当前路径
        currentPath = fromDir + dirent.name;
        // 处理目录
        if (dirent.isDirectory()) {
            // 如果当前路径是目录，则进入递归模式
            movePhotos(currentPath + SEP, toDir, isDebug, isSkipExists);
            continue;
        }
        // 处理文件
        ext = NmPath.extname(dirent.name); // .jpg
        if (!ext) {
            continue;
        }
        date = null;
        ext = ext.substring(1).toLowerCase();
        if (config.image_exts.includes(ext)) {
            prefix = 'IMG-';
        } else if (config.video_exts.includes(ext)) {
            prefix = 'MOV-';
        } else {
            // 过滤非图片和视频格式的文件
            continue;
        }
        if (ext == 'jpg' || ext == 'jpeg') {
            exifData = await NmPify(NmExif.ExifImage)({
                image: currentPath
            });
            // 2020:04:04 08:34:33
            datestr = exifData.exif.CreateDate.replace(':', '-').replace(':', '-').replace(' ', 'T') + 'Z';
            date = new Date(datestr); // 注意，时间后面要带字符Z，否则会差8小时，详见：https://segmentfault.com/q/1010000011751536
            // console.log('jpeg===', currentPath, datestr);
        }
        if (ext == 'mov' || ext == 'mp4') {
            exifData = await NmFfprobe(currentPath, {
                path: NmFfprobeStatic.path
            })
            // creation_time: '2020-04-04T00:34:32.000000Z'
            datestr = exifData.streams[0].tags.creation_time.substring(0, 19) + 'Z';
            date = new Date(datestr);
            // console.log('video===', currentPath, datestr);
        }
        if (!date) {
            stat = NmFs.statSync(currentPath);
            time = stat.birthtime > stat.ctime ? stat.ctime : stat.birthtime;
            if (time > stat.mtime) {
                time = stat.mtime;
            }
            // 时间后面要加字符'Z'，否则会少8小时
            date = new Date(time + 'Z');
            // console.log('other===', currentPath, date.toISOString());
        }
        // 自动创建目标目录
        newDir = toDir + date.toISOString().substring(0, 10);
        if (!isDebug && !NmFs.existsSync(newDir)) {
            NmFs.mkdirSync(newDir, {
                recursive: true
            });
        }
        newPath = date.toISOString().replace(/-/g, '').replace(/:/g, '').substring(0, 15);
        newPath = newDir + '/' + prefix + newPath + '.' + ext; // IMG-20210117113520.jpg

        // 判断是否过滤已存在的目标文件
        if (isSkipExists && NmFs.existsSync(newPath)) {
            console.log(currentPath, '已存在', newPath);
            continue;
        }
        // 文件重命名
        if (!isDebug) {
            NmFs.renameSync(currentPath, newPath);
        }
        console.log(currentPath, '移动到', newPath);
    }
}

// 执行批量照片和视频归档功能
movePhotos('./a/', './b/', true).catch(err => console.log(err))

// 文件时间调试
function debugFileTime(stat) {
    let options = {
        birthtime: '',
        ctime: '',
        mtime: '',
        atime: ''
    }
    for (let key in options) {
        if (stat[key]) {
            options[key] = new Date(stat[key] + 'Z').toISOString();
        }
    }
    console.log('debugFileTime', options);
}