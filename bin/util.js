#! /usr/bin/env node


const yargs = require("yargs")
const argv = require("yargs").argv;


const utils = require("../utils/utils")
const svgo = require("../utils/svgo")
const photo =require("../photo/photo")
let method = process.argv[2]
let parame = process.argv[3]
let parameTwo
if (process.argv[4]) {
    parameTwo = process.argv[4]
}
utils.svgo = svgo
utils.photo = photo
async function performUtils() {
    let res = await utils[method](parame, parameTwo)
    console.log(res)
}
performUtils()