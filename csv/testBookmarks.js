/*
 * @Author: suben 18565641627@163.com
 * @Date: 2022-12-26 11:08:48
 * @LastEditors: suben 18565641627@163.com
 * @LastEditTime: 2022-12-26 16:03:25
 * @FilePath: \terminal-node-tool\csv\testBookmarks.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const csv = require('csvtojson')
const jschardet = require('jschardet')
const iconv = require('iconv-lite')
const fs = require('fs')

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

const converter = csv()
    .fromFile('./csv/书签历史记录.csv', { encoding: 'binary' })
    .then((json) => {
        //binary和fromFile中的文件读取方式要一致
        let buf = Buffer.from(JSON.stringify(json), 'binary') //第一个参数格式是字符串
        let bufferString = jschardet.detect(buf) // big5
        let bookmarks = iconv.decode(buf, bufferString.encoding)
        fs.writeFileSync('./csv/书签.json', bookmarks, 'utf8')
    })
