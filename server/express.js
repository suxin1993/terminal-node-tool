/*
 * @Author: your name
 * @Date: 2021-09-07 16:58:57
 * @LastEditTime: 2023-05-06 20:10:12
 * @LastEditors: suxin 18565641627@.163com
 * @Description: In User Settings Edit
 * @FilePath: /terminal-node-tool/server/express.js
 */

let http = require('http')

let express = require('express')

let app = express()

let server = http.createServer(app)

let path = require('path')

let root = path.join(__dirname, './views')
let ImagePath = path.join(__dirname, './uploads')
let updateImagePath = 'D://uploads'

let fs = require('fs')

let url = require('url')

// 路由模块
let router = express.Router()

const { getIPAdress } = require('./ip')
const { json } = require('express')
const port = 3000
let baseLoction = '/ocr' //自己代理的服务的frpc.ini文件
// [web2]
// type = http
// local_port = 3000
// # 服务器ip
// custom_domains = jijiandsu.store
// # eg：http://xxx.xxx.xxx.xxx/yolo/ocr
// locations = /ocr

app.use(function (req, res, next) {
    // // createWatcher(file, mode)
    // console.error(req)
    next()
})

//中间件
app.use(baseLoction, router)

//处理图片
const multer = require('multer')
const storage = multer.diskStorage({
    limits: { fileSize: 10000 * 1024 },
    destination: function (req, file, cb) {
        cb(null, updateImagePath)
    },
    filename: function (req, file, cb) {
        let originalname = file.originalname
        console.error(req.body.name)
        console.error(originalname)
        cb(null, req.body.name)
    },
})

const upload = multer({ storage: storage })
router.post(
    '/upload',
    upload.fields([
        { name: 'img', maxCount: 1 },
        { name: 'name', maxCount: 1 },
    ]),
    (req, res, next) => {
        console.log(req.body)
        res.send('文件上传成功')
    }
)
router.get(`/updateLocaltion`, function (req, res) {
    console.error(req.query)

    res.send('请求成功')
})

router.get(`/time`, function (req, res) {
    let time = new Date().valueOf()
    console.error(new Date().valueOf())
    let body = { name: 'zhangsan', age: '24', time: time, express: 'express' }
    body = JSON.stringify(body)
    res.send(body)
})
router.get(`/`, function (req, res) {
    res.send('hello world express')
})
// app.use(function(req, res, next) {
//     createWatcher(file, mode);
//     next();
// });

// app.get(`${baseLoction}/time`, function (req, res) {
//     console.error(req)
//     let time = new Date().valueOf()
//     console.error(new Date().valueOf())
//     let body = { name: 'zhangsan', age: '24', time: time }
//     body = JSON.stringify(body)
//     res.send(body)
// })
// app.get(`${baseLoction}`, function (req, res) {
//     res.send('hello world')
// })

app.use(express.static(root))

//配置图片静态资源
app.use('/uploads', express.static('uploads'))

server.listen(port, function () {
    console.log(`${getIPAdress()}:${port}`)
})
