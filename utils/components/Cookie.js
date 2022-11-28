/**
 * Name:            Cookie.js
 * Desc:            Cookie操作类，转换cookie字符串，对本地cookie的增删改查
 * Author:          BulletYuan
 * Create-Time:     2018.09.22
 * Lastset-Time:    2019.07.28
 */
const
	Cookie = (function () {
		function A() {
			this.Cookie = {};
		}
		A.prototype.toCookieString = function () {
			if (typeof document !== 'object' || document.cookie === undefined) throw new Error("浏览器不支持Cookie功能！");
			let c = this.Cookie || this.getCookies();
			c = JSON.stringify(c).replace(/:/g, '=').replace(/,/g, ';')
			c = c.substring(1, c.length - 1).toString();
			let b = "";
			for (let a of c.split(';')) {
				b += a.substring(1, a.indexOf('=') - 1) + "=" + a.substring(a.indexOf('=') + 2, a.length - 1) + "; ";
			}
			b = b.substr(0, b.length - 2);
			return b;
		};
		A.prototype.getCookies = function () {
			if (typeof document !== 'object' || document.cookie === undefined) throw new Error("浏览器不支持Cookie功能！");
			let cstr = document.cookie.replace(/=/g, '@@@@').replace(/;/g, '~~~~').toString();
			let b = "";
			for (let c of cstr.split('~~~~')) {
				if (c && c.indexOf('@@@@') >= 0) b += "\"" + c.split('@@@@')[0].trim() + "\":\"" + c.split('@@@@')[1].trim() + "\",";
			}
			this.Cookie = JSON.parse('{' + b.substr(0, b.length - 1).replace(/@@@@/g, ':').replace(/~~~~/g, ',') + '}')
			return this.Cookie;
		};
		A.prototype.getCookie = function (name) {
			if (typeof document !== 'object' || document.cookie === undefined) throw new Error("浏览器不支持Cookie功能！");
			let c = this.Cookie || this.getCookies();
			return c[name] || "";
		};
		A.prototype.setCookie = function (k, v, exdays) {
			if (typeof document !== 'object' || document.cookie === undefined) throw new Error("浏览器不支持Cookie功能！");
			let d = new Date();
			d.setTime(d.getTime() + ((exdays || 1) * 24 * 60 * 60 * 1000));
			let expires = "expires=" + d.toUTCString();
			document.cookie = k + '=' + escape(v) + ';' + expires;
			return this.getCookies();
		};
		A.prototype.deleteCookie = function (name) {
			if (typeof document !== 'object' || document.cookie === undefined) throw new Error("浏览器不支持Cookie功能！");
			return name ? this.setCookie(name, '', -1) : false;
		}

		return A;
	})();

module.exports = Cookie;