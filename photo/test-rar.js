/*
 * @Author: suben 18565641627@163.com
 * @Date: 2022-12-06 14:04:27
 * @LastEditors: suben 18565641627@163.com
 * @LastEditTime: 2022-12-06 14:41:24
 * @FilePath: \terminal-node-tool\photo\test-rar.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// // import { unrar, list } from 'unrar-promise'
// const { unrar } = require('unrar-promise')

// async function unrarMethod() {
//     await unrar('./wd.rar', './output')
// }

// unrarMethod()

const fs = require('fs')
const unrar = require('node-unrar-js')

async function main() {
    // Read the archive file into a typedArray

    const buf = Uint8Array.from(fs.readFileSync('./photo/wd.rar')).buffer
    const extractor = await unrar.createExtractorFromData({ data: buf })

    const list = extractor.getFileList()
    console.error(list)
    const listArcHeader = list.arcHeader // archive header
    const fileHeaders = [...list.fileHeaders] // load the file headers

    const extracted = extractor.extract({ files: ['1.txt'] })
}
main()
