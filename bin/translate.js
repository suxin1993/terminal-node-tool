#! /usr/bin/env node

require("colors");
const say = require("say");
const querystring = require("querystring");
const argv = require("yargs").argv;
const queryStr = encodeURI(argv._.join(" "));

// 无参数,或帮助
if (!queryStr || argv.help == true || argv.H == true || argv.h == true) {
    console.log("translate-------------------------------");
    console.log("查单词: ".bold.blue);
    console.log("translate [单词] 或者 [短句]", "\n");
    console.log("汉译英: ".bold.red);
    console.log("translate [文本]", "\n");
    console.log("单词/短句发音: ".bold.yellow);
    console.log("translate [单词] [短句] --say");
    console.log("translate [单词] [短句] -S");
    console.log("-------------------------------");
    console.log("请在'translate'命令后输入单词或断句!");
    console.log("word or sentence required...");
} else {
    //播放
    if (argv.say == true || argv.S == true) {
        console.log("播放中...".rainbow);
        say.speak(querystring.unescape(queryStr));
        return;
    }
    //查词
    sendInfo(queryStr);
}

//格式化
function format(json) {
    let data = JSON.parse(json),
        pron = data.basic ? data.basic.phonetic : "无",
        mainTrans = "",
        machineTrans = data.translation || "",
        webTrans = "",
        template = "",
        basic = data.basic,
        web = data.web;
    if (basic) {
        for (let i = 0; i < basic.explains.length; i++) {
            mainTrans += "\n" + basic.explains[i];
        }
    }
    if (web) {
        for (let i = 0; i < web.length; i++) {
            webTrans +=
                "\n" +
                (i + 1) +
                ": " +
                web[i].key.red.bold +
                "\n" +
                web[i].value.join(",");
        }
    }
    template = `${"发音：".red.bold}${pron}
${"翻译：".green.bold}${mainTrans}
${"网络释义：".blue.bold}${webTrans}
${"机器翻译：".yellow.bold}${machineTrans}
`;
    console.log(template);
}

//发送请求
function sendInfo(query) {
    //发送翻译请求
    let http = require("http");

    // 1.用于请求的选项
    let options = {
        host: "fanyi.youdao.com",
        port: "80",
        path: "/openapi.do?keyfrom=ShanaTool&key=303727991&type=data&doctype=json&version=1.1&q=" +
            query,
    };
    // 处理响应的回调函数
    let callback = function(response) {
        // 不断更新数据
        response.on("data", function(data) {
            format(data);
        });
        response.on("end", function() {
            console.log("----------------translate-trans----------------");
        });
    };
    // 向服务端发送请求
    let req = http.request(options, callback);
    req.end();
}