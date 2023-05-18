/*
 * @Author: suben 18565641627@163.com
 * @Date: 2023-05-09 21:19:50
 * @LastEditors: suben 18565641627@163.com
 * @LastEditTime: 2023-05-15 22:27:04
 * @FilePath: \terminal-node-tool\csv\testJson.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const csv = require('csvtojson')
const jschardet = require('jschardet')
const iconv = require('iconv-lite')
const fs = require('fs')



// const converter = csv()
//     .fromFile('./csv/小程序事件-城市_location_address_20210927-20211111.csv', { encoding: 'binary' })
//     .then((json) => {
//         //binary和fromFile中的文件读取方式要一致
//         let buf = Buffer.from(JSON.stringify(json), 'binary') //第一个参数格式是字符串
//         let bufferString = jschardet.detect(buf) // big5
//         let bookmarks = iconv.decode(buf, bufferString.encoding)
//         fs.writeFileSync('./csv/my.json', bookmarks, 'utf8')
//     })

//获取分类参数
//  let  obj= fs.readFileSync('./csv/my.json','utf8')

 
//  let tt= []
//  tt=JSON.parse(obj).map((item)=>{
//     return  item['分类参数']
//  })
// console.error(tt)
// let bb =JSON.stringify(tt)
// fs.writeFileSync('./csv/mys.json', bb, 'utf8')

 let  objx= fs.readFileSync('./csv/mys.json','utf8')
 let xxxs= JSON.parse(objx)
 let tt= []
 let zz =[]
 let other =[]
 let indexs =0
 let indexsss =0
for (let index = 0; index < xxxs.length; index++) {
    const element = xxxs[index];
  
    if(typeof(element)=='string'){
    const inputString = element
    // console.error(inputString)
  
    let a =inputString.split('-')
    const regex = /\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]time-\[(.*?)\]user-\[(.*?)\]system-\[(.*?)\]model-\[(.*?)\]networkType-(.*)/;
    try {
       xx = regex.exec(element);
        const [_, datetime, time, user, system, model, networkType] =xx
        const obj = {
          time:new Date(datetime).toLocaleString(),
          nick_name:time,
          model:`${user}-${system}-${model}`,
          userName:'suxin',
          location:networkType,
          timeV:new Date(datetime).valueOf()
        };
        if(time!=='粟斌'){
          console.error(time)
          other.push(obj)
          
        }
        if(time=='粟斌'){
       
          
          tt.push(obj)
        }


      
        
    } catch (error) {
        // console.error(error)
        // console.log(element)
        zz.push(inputString)
        
    }
    
    }else {
        console.error(element)
    }
   
    indexsss++
    
}

console.error(indexsss)
//时间排序
//prop：对象数组排序的键，
//align：排序方式，"positive"正序，"inverted"倒序。

tt.sort(function(a, b){
  console.error(a.timeV)
  return a.timeV - b.timeV
});


for (let index = 0; index < tt.length; index++) {
  const timeV = tt[index];
  timeV.timeV=undefined
  
}

// console.error(tt)
let bb =JSON.stringify(tt)
fs.writeFileSync('./csv/myss.json', bb, 'utf8')







let jjz =zz.join('\n')
console.error(tt.length)
console.error(zz.length)
console.error(other.length)
console.error(tt.length+zz.length+other.length)
let otherJson =JSON.stringify(other)


fs.writeFileSync('./csv/mysst.json', jjz, 'utf8')
fs.writeFileSync('./csv/otherJson.json', otherJson, 'utf8')
