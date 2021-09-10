/*
 * @Author: your name
 * @Date: 2021-09-07 16:58:57
 * @LastEditTime: 2021-09-07 19:34:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /terminal-node-tool/server/express.js
 */

let http = require('http');

let express = require('express');

let app = express();

let server = http.createServer(app);

let path = require('path');

let root = path.join(__dirname, './views');

let fs = require('fs');

let url = require('url');

const { getIPAdress } = require('./ip')
const port = 3031

app.use(function(req, res, next) {
    createWatcher(file, mode);
    next();
});

app.use(express.static(root));

server.listen(port, function() {
    console.log(`${getIPAdress()}:${port}`)
});