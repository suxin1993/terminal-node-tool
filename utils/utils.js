/*
 * @Author: your name
 * @Date: 2021-08-28 15:52:26
 * @LastEditTime: 2021-08-28 16:08:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ding-trans/lib/utils.js
 */

class LogStoreClass {
    constructor(name) {
        this.quere = new Promise((res, rej) => {
            res()
        })
    }
    sleep(time) {
        console.time("start")
        this.quere = this.quere.then(() => {
            return new Promise((res) => {
                setTimeout(() => {
                    console.timeEnd("start")
                    res()
                }, time * 1000)
            })
        })
        return this
    }
    // 转换时间时间戳 
    formatTime(value, type) {
        let time = value ? new Date(parseInt(+value * 1000)) : new Date()
        if (value.toString().length == 13) {
            time = value ? new Date(parseInt(+value)) : new Date()
        }
        let formatTime = type ? type : 'yyyy-MM-dd hh:mm:ss'
        let date = {
            // "Y+": time.getFullYear(),
            "M+": time.getMonth() + 1,
            "d+": time.getDate(),
            "h+": time.getHours(),
            "m+": time.getMinutes(),
            "s+": time.getSeconds(),
            "q+": Math.floor((time.getMonth() + 3) / 3),
            "S+": time.getMilliseconds()
        };
        if (/(y+)/i.test(formatTime)) {
            formatTime = formatTime.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (let k in date) {
            if (new RegExp("(" + k + ")").test(formatTime)) {
                formatTime = formatTime.replace(RegExp.$1, RegExp.$1.length == 1 ?
                    date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return formatTime;
    }
    // LocalStorageList
    localStorageList(time) {
        this.quere = this.quere.then(() => {
            let localLength = localStorage.length; // 获取长度
            let storeList = new Array(); // 定义数据集
            for (let i = 0; i < localLength; i++) {
                // 获取key 索引从0开始
                let getKey = localStorage.key(i);
                // 获取key对应的值
                let getVal = localStorage.getItem(getKey);
                // 放进数组
                storeList[i] = {
                    'key': getKey,
                    'val': getVal,
                }
            }
            console.error(storeList);
        })
        return this
    }
    /**
     *冻结对象
     * @param param 对象
     * @param lev 密封对象等级,0-不可扩展,1-密封对象,2-冻结对象
     * @returns {Object}
     */
    deepFreeze(param, lev) {
        const levMap = ['preventExtensions', 'seal', 'freeze']
        let propNames = Object.getOwnPropertyNames(param);
        propNames.forEach((name) => {
            let prop = param[name];
            if (typeof prop == 'object' && prop !== null) {
                this.deepFreeze(prop, lev);
            }
        });
        return Object[levMap[lev]](param)
    }
    /**
     * @param fn 方法
     * @param wait 节流秒数
     * 减少发送请求，降低请求频率,减少函数执行次数
     */
    endThrottle(fn, wait = 1000, throttleTime) {
        if (throttleTime) {
            clearTimeout(throttleTime)
            throttleTime = null
        }
        throttleTime = setTimeout(fn, wait);
        return throttleTime
    }
    /**
     * @param fn 方法
     * @param wait 节流秒数
     * 减少发送请求，降低请求频率,减少函数执行次数 ,TODO:还存在问题
     */
    startThrottle(fn, wait = 1000, noFnTime) {
        if (!noFnTime) {
            return new Promise((res, rej) => {
                fn(); //使用技能
                noFnTime = true; //进入冷却时间
                res(noFnTime)
            })
        } else {
            return new Promise((res, rej) => {
                let timerId = setTimeout(() => {
                    noFnTime = false
                    clearTimeout(timerId)
                    res(noFnTime)
                }, wait)
            })
        }
    }
    // TODO:debounce ,加强版debounce
    /**
     *克隆对象
     * @param param 对象
     * @param lev 克隆对象等级,0-浅克隆,1-JSON克隆,2-深克隆
     * JSON克隆会忽略function和undefined的字段，对date类型支持貌似也不友好。而且只能克隆原始对象自身的值，不能克隆它继承的值,不能序列化函数,不能解决循环引用的对象
     * @returns {Object}
     */
    deepClone(param, lev) {
        const levMap = ['assign', 'JSON', 'deep']
        if (levMap[lev] == 'assign') {
            return Objec.assign({}, param)
        } else if (levMap[lev] == 'JSON') {
            return JSON.parse(JSON.stringify(param))
        } else if (levMap[lev] == 'deep') {
            if (param === null) {
                return null;
            } else if (param instanceof Array) {
                let newArray = [];
                for (let i = 0, ilen = param.length; i < ilen; i += 1) {
                    newArray[i] = param[i];
                }
                return newArray;
            } else if (param instanceof Date || param instanceof RegExp || param instanceof Function) {
                return param;
            } else if (param instanceof Object) {
                let newObject = {};
                for (let i in param) {
                    if (param.hasOwnProperty(i)) {
                        newObject[i] = this.deepClone(param[i], lev);
                    }
                }
                return newObject;
            } else {
                return param
            }
        }
    }
    deepFind(param, text) {
        let firstPrint = true
        if (param === null) {
            return null;
        } else if (param instanceof Array) {
            return param;
        } else if (param instanceof Date || param instanceof RegExp || param instanceof Function) {
            return param;
        } else if (param instanceof Object) {
            for (let i in param) {
                if (i.toLowerCase().indexOf(text.toLowerCase()) !== -1 && firstPrint) {
                    console.error(`打印输入对应的值${i }`)
                    firstPrint = false
                    console.error(param[i])
                }
                this.deepFind(param[i], text);
            }
            return param;
        } else {
            return param
        }
    }
    //创建自定义事件
    creatEvent(eventInfo) {
        /* 创建一个事件对象，名字为newEvent，类型为build */
        let newEvent = new CustomEvent('devtool-notice-testButton', { bubbles: true, cancelable: true, detail: eventInfo });
        /* 将自定义事件绑定在document对象上，这里绑定的事件要和我们创建的事件类型相同，不然无法触发 */
        return newEvent
    }
    /**
     *轮询
     * @param validate 校验
     * @param interval 数字或者字符串random
     * @param scope 随机才有这个参数,限定随机范围
     * @param stopfn 停止函数
     * @returns {string}
     */
    poll(fn, validate, stopfn, interval, scope) {
        const resolver = async (resolve, reject) => {
            try {
                if (!stopfn()) {
                    resolve();
                    return
                }
                const result = await fn();
                const valid = validate(result);
                if (valid) {
                    resolve(result);
                } else {
                    if (interval == 'random') {
                        setTimeout(resolver, Math.floor(Math.random() * scope.max + scope.min), resolve, reject);
                    } else {
                        setTimeout(resolver, interval, resolve, reject);
                    }
                }
            } catch (e) {
                reject(e);
            }
        };
        return new Promise(resolver);
    }
    /**
     *色值hex转rgba
     * @param hex 例如:"#23ff45"
     * @param opacity 透明度
     * @returns {string}
     */
    hexToRgbaToDev(hex, opacity) {
        return "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + opacity + ")";
    }
}

const LogStore = new LogStoreClass()
module.exports = LogStore