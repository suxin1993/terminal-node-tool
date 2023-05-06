/*
 * @Author: your name
 * @Date: 2021-09-07 16:58:57
 * @LastEditTime: 2023-05-06 22:20:39
 * @LastEditors: suben 18565641627@163.com
 * @Description: In User Settings Edit
 * @FilePath: /terminal-node-tool/server/express.js
 */

let http = require('http')

let express = require('express')

let radb = require('./radb')

let app = express()
const database = 'db'

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

/*
 * @Author: suxin 18565641627@.163com
 * @Date: 2022-11-26 21:29:25
 * @LastEditors: suben 18565641627@163.com
 * @LastEditTime: 2023-04-28 14:45:19
 * @FilePath: \code-server\server.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */



let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// //上传逻辑
// const upload = multer({ dest: "uploads/" });
// app.post("/upload", upload.single("image"), (req, res) => {
//   res.json({ url: `/uploads/${req.file.filename}` });
// });
// app.get("/:filename", (req, res) => {
//   res.sendFile(`${__dirname}/uploads/${req.params.filename}`);
// });


//配置
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})
//  /severcollectip/getAll
// 查询所有的ip地址
app.get('/ip/getAll', function (req, res) {
    let result = radb.get('db', 'user.suxin')
    res.send(result)
})
// 插入ip地址
app.get('/ip/address', function (req, res) {
    let dbName = `user.${req.query.userName}` || 'user.未知'
    let userName = req.query.userName
    try {
        let ab = radb.get(database, dbName)
        if (ab) {
            let result = radb.insertValue(database, dbName, req.query)
            res.send(result)
        }
    } catch (e) {
        let results = radb.insertField(database, dbName, userName, req.query)
        res.send(results)
    }
})
//  /severcollectphoto/getAll
//查询所有的照片地址
app.get('/photo/getAll', function (req, res) {
    let result = radb.get('photo', 'user.photo')
    res.send(result)
})

//  /severcollectdays/getAll
// 查询所有的纪念日
app.get('/days/getAll', function (req, res) {
    let result = radb.get('days', 'user.suxin')
    res.send(result)
})
//  /severcollectdays/add
// 插入纪念日
app.get('/days/add', function (req, res) {
    let dbName = 'user.suxin'
    let userName = req.query.userName

    try {
        let ab = radb.get('days', dbName)
        if (ab) {
            let result = radb.insertValue('days', dbName, req.query)
            res.send(result)
        }
    } catch (e) {
        let results = radb.insertField('days', dbName, userName, req.query)
        res.send(results)
    }
})
//  /severcollectdays/edit
// 修改纪念日
app.get('/days/edit', function (req, res) {
    let dbName = 'user.suxin'
    let ab = radb.get('days', dbName)
    if(req.query.Index){
        const Index = req.query.Index
        req.query.Index=undefined
        ab[Index]=  req.query
        console.error(ab[Index])
        let results = radb.coverField('days', dbName, ab)
        res.send(results)
    }  
})


// post请求
app.post('/myApp/delete', function (req, res) {
    console.log(req.body.data)
    let result = radb.insertValue('db', 'user.types', req.body.data)
})


