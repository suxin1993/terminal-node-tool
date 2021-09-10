/*
 * @Author: your name
 * @Date: 2021-09-07 15:29:58
 * @LastEditTime: 2021-09-08 21:00:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /terminal-node-tool/server/koa.js
 */

const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
const { getIPAdress } = require('./ip')
const port = 3050
const fs = require('fs');
app.use(async (ctx, next) => {
    if (ctx.request.path === '/views') {
        ctx.type = 'text/html';
        ctx.body = fs.createReadStream('./views/index.html');
    } else if (ctx.request.path === '/post') {
        let html = `
        <h1>Koa2 request post demo</h1>
        <form method="POST"  action="/">
            <p>userName</p>
            <input name="userName" /> <br/>
            <p>age</p>
            <input name="age" /> <br/>
            <p>webSite</p>
            <input name='webSite' /><br/>
            <button type="submit">submit</button>
        </form>
    `;
        ctx.body = html;
    } else if (ctx.url === '/' && ctx.method === 'POST') {
        console.error("验证post请求")
        ctx.body = '接收到请求';
    } else {
        await next();
    }
});


// add url-route:
router.get('/hello/:name', async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
});

router.get('/', async (ctx, next) => {
    ctx.response.body = '<h1>Index</h1>';
});

// add router middleware:
app.use(router.routes());

app.listen(port);
console.log(`${getIPAdress()}:${port}`)