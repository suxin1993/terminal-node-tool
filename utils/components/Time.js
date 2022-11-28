/**
 * Name:            Time.js
 * Desc:            时间操作类，实例化一个Date类，并对此进行操作
 * Author:          BulletYuan
 * Create-Time:     2018.09.21
 * Last-Time:       
 */
const
    DateUtil = (function () {
        //初始化时间，将传入的参数解构赋值给new Date()，并返回一个Date对象
        function initDate(...args) {
            let DateObj = null;
            if (args && args.length > 0) DateObj = new Date(...args);
            else DateObj = new Date();
            return DateObj;
        };
        //格式化日期，传入时间字符串或Date对象和格式化字符串，并对其进行正则匹配，格式化默认为 yyyy-MM-dd hh:mm:ss
        //格式化字符  y：年份 ， M：月份 ， q：季度 ， d：日 ， h：小时 ， m：分钟 ， s：秒钟 ， S：毫秒
        function formatDate(timeStr, formatStr) {
            formatStr = formatStr || 'yyyy.MM.dd hh:mm';
            let format = {
                "y+": timeStr.getFullYear(), //年份 
                "q+": Math.floor((timeStr.getMonth() + 3) / 3), //季度 
                "M+": timeStr.getMonth() + 1, //月份 
                "d+": timeStr.getDate(), //日 
                "h+": timeStr.getHours(), //小时 
                "m+": timeStr.getMinutes(), //分 
                "s+": timeStr.getSeconds(), //秒 
                "S": timeStr.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(formatStr)) formatStr = formatStr.replace(RegExp.$1, (format['y+'] + "").substr(4 - RegExp.$1.length));
            for (var k in format)
                if (new RegExp("(" + k + ")").test(formatStr)) formatStr = formatStr.replace(RegExp.$1, (RegExp.$1.length == 1) ? (format[k]) : (("00" + format[k]).substr(("" + format[k]).length)));
            return formatStr;
        }

        function A(...args) {
            this.DateObj = initDate(...args);
        }
        A.prototype.timestamp = function (...args) {
            if (args && args.length > 0) return initDate(...args).getTime();
            return this.DateObj.getTime();
        };
        A.prototype.timestamp10 = function (...args) {
            if (args && args.length > 0) return Math.floor(initDate(...args).getTime() / 1000);
            return Math.floor(this.DateObj.getTime() / 1000);
        };
        A.prototype.dateFormat = function (...args) {
            let timeStr = this.DateObj,
                formatStr = "yyyy-MM-dd hh:mm:ss";
            if (args && args.length > 0) {
                if (args.length === 1) {
                    if (args[0].indexOf("-") > 0 || args[0].indexOf(":") > 0) {
                        formatStr = args[0];
                    } else {
                        timeStr = initDate(args[0]);
                    }
                } else {
                    timeStr = initDate(args[0]);
                    formatStr = args[1];
                }

                return formatDate(timeStr, formatStr);
            } else {
                return formatDate(timeStr, formatStr);
            }
        };
        A.prototype.timeFormat = function (ts) {
            const _y = 60 * 60 * 24 * 30 * 12,
                _m = 60 * 60 * 24 * 30,
                _d = 60 * 60 * 24,
                _H = 60 * 60,
                _M = 60;

            // 格式化时间, 传入时间戳数值, 进行格式化时间值
            function timeReduce(s = 0) {
                if (s > _y) {
                    return Math.floor(s / _y) + ' 年 ' + (s % _y > 0 ? timeReduce(s % _y) : '');
                } else if (s > _m) {
                    return Math.floor(s / _m) + ' 月 ' + (s % _m > 0 ? timeReduce(s % _m) : '');
                } else if (s > _d) {
                    return Math.floor(s / _d) + ' 天 ' + (s % _d > 0 ? timeReduce(s % _d) : '');
                } else if (s > _H) {
                    return Math.floor(s / _H) + ' 时 ' + (s % _H > 0 ? timeReduce(s % _H) : '');
                } else if (s > _M) {
                    return Math.floor(s / _M) + ' 分 ' + (s % _M > 0 ? timeReduce(s % _M) : '');
                } else {
                    return Math.floor(s) + ' 秒';
                }
            }
            return timeReduce(ts);
        };

        return A;
    })();

module.exports = DateUtil;