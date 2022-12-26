/*
 * @Author: suben 18565641627@163.com
 * @Date: 2022-12-26 14:52:44
 * @LastEditors: suben 18565641627@163.com
 * @LastEditTime: 2022-12-26 22:08:34
 * @FilePath: \terminal-node-tool\csv\testJson.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const fs = require('fs')

let data = fs.readFileSync('./csv/书签.json', 'utf8')

let bookmarks = JSON.parse(data)
/**
 * @name:
 * @description: 书签默认模板
 * @param {string} 书签名
 * @return {*}
 */
const createHtmlTemp = (name) => `<!DOCTYPE NETSCAPE-Bookmark-file-1>
 <!-- This is an automatically generated file.
      It will be read and overwritten.
      DO NOT EDIT! -->
 <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
 <TITLE>${name}</TITLE>
 <H1>${name}</H1>
 `

/**
 * @name:
 * @description: 列表格式的Dom
 * @return {*}
 */
const createBaseStartTemp = `
 <DL><p>
 `

const createBaseEndTemp = `
 </DL><p>
 `

/**
 * @name:
 * @description: 生成文件格式的Dom
 * @param {File} file 文件格式数据
 * @return {*}
 */
const createHtmlFileAll = (list) => {
    console.error(list.length)
    let strMain = ''
    for (let index = 0; index < list.length; index++) {
        const element = list[index]
        strMain =
            strMain +
            `<DT>
        <A HREF="${element['网址']}"  ADD_DATE="${new Date(element['访问事件']).valueOf() / 1000}">${element['访问事件']}-${element['标题']}</A>
        `
    }
    return strMain
}

let header = createHtmlTemp('Bookmarks')
let main = createHtmlFileAll(bookmarks)

let str = header + createBaseStartTemp + main + createBaseEndTemp
fs.writeFileSync('./csv/bookmarsk.html', str, 'utf8')
