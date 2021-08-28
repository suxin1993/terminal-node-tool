/*
 * @Author: your name
 * @Date: 2021-08-28 18:03:23
 * @LastEditTime: 2021-08-28 18:57:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /terminal-node-tool/utils/svgo.js
 */

const { optimize } = require('svgo');
const { resolvePath } = require("./node-operate-folder.js")
let filepath = resolvePath('./svg')

function svgo() {
    console.log("zhixing")
}

module.exports = svgo

// const result = optimize(data, {
//     // optional but recommended field
//     path: filedir,
//     // all config fields are also available here
//     multipass: true,
// });
// fs.writeFile(filedir, result.data, function(err) {
//     if (err) {
//         throw err;
//     }
// })