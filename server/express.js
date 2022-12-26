/*
 * @Author: your name
 * @Date: 2021-09-07 16:58:57
 * @LastEditTime: 2022-12-26 16:05:55
 * @LastEditors: suben 18565641627@163.com
 * @Description: In User Settings Edit
 * @FilePath: /terminal-node-tool/server/express.js
 */

let http = require('http')

let express = require('express')

let app = express()

let server = http.createServer(app)

let path = require('path')

let root = path.join(__dirname, './views')

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

server.listen(port, function () {
    console.log(`${getIPAdress()}:${port}`)
})
