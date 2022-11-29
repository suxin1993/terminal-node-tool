/*
 * @Author: suxin 18565641627@.163com
 * @Date: 2022-11-29 09:51:38
 * @LastEditors: suxin 18565641627@.163com
 * @LastEditTime: 2022-11-29 09:54:48
 * @FilePath: \terminal-node-tool\photo\changeExif.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
let piexif = require('piexifjs')
let fs = require('fs')

let filename1 = 'photo/photo.jpeg'
let filename2 = 'photo/out.jpg'

let jpeg = fs.readFileSync(filename1)
let data = jpeg.toString('binary')

let zeroth = {}
let exif = {}
let gps = {}
zeroth[piexif.ImageIFD.Make] = 'Make'
zeroth[piexif.ImageIFD.XResolution] = [777, 1]
zeroth[piexif.ImageIFD.YResolution] = [777, 1]
zeroth[piexif.ImageIFD.Software] = 'Piexifjs'
exif[piexif.ExifIFD.DateTimeOriginal] = '2010:10:10 10:10:10'
exif[piexif.ExifIFD.LensMake] = 'LensMake'
exif[piexif.ExifIFD.Sharpness] = 777
exif[piexif.ExifIFD.LensSpecification] = [
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
]
var lat = 23.63553989213321
var lng = 113.23842144012451
gps[piexif.GPSIFD.GPSLatitudeRef] = lat < 0 ? 'S' : 'N'
gps[piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(lat)
gps[piexif.GPSIFD.GPSLongitudeRef] = lng < 0 ? 'W' : 'E'
gps[piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(lng)
gps[piexif.GPSIFD.GPSVersionID] = [7, 7, 7, 7]
gps[piexif.GPSIFD.GPSDateStamp] = '1999:99:99 99:99:99'
var exifObj = { '0th': zeroth, Exif: exif, GPS: gps }
var exifbytes = piexif.dump(exifObj)

var newData = piexif.insert(exifbytes, data)
var newJpeg = Buffer.from(newData, 'binary')
fs.writeFileSync(filename2, newJpeg)
