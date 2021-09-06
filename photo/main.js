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