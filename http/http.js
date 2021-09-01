const https = require("https");



async function getHttp(url) {
    return new Promise((resolve, reject) => {
        https.get(url, resp => {
            let data = {}
            resp.on("data", function(chunk) {
                data += chunk;
            });
            resp.on("end", () => {
                resolve(data)
            });
            resp.on("error", err => {
                reject(err.message);
            });
        });
    })
}

exports.getHttp=getHttp


/**
 * JS对象转URL字符串参数
 * @param {Object} obj - 待转换的对象
 * @returns {string} - 转换成的请求字符串
 */
 function addUrlParams(url,obj) {
    const params = [];
    Object.keys(obj).forEach((key) => {
      let value = obj[key]
      // 如果值为undefined我们将其置空
      if (typeof value === 'undefined') {
        value = ''
      }
      // 对于需要编码的文本（比如说中文）我们要进行编码
      params.push([key, encodeURIComponent(value)].join('='))
    })
    return `${url}?${params.join('&')}`
  }
  exports.addUrlParams=addUrlParams

  