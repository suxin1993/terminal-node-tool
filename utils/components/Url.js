/**
 * Name:            Url.js
 * Desc:            url路径操作类，对url的get参数进行json序列化与字符串转换
 * Author:          BulletYuan
 * Create-Time:     2018.09.22
 * Last-Time:       2019.03.17
 */
const
	UrlUtil = (function () {
		function A() {
			this.Params = {};
		}
		A.prototype.getParams = function (path) {
			path = path || (typeof window !== 'undefined' ? window.location.href : '');
			const match = /(\w+):\/\/([^/:]+)(:\d*)?(.*)+/g;
			if (path) {
				const arr = match.exec(path);
				this.Params = {
					protocol: arr[0] || "",
					host: arr[1] || "",
					port: arr[2] ? arr[2].split(":")[1] : "",
					path: "",
					search: "",
					hash: "",
					searchParams: {},
				};
				const param = arr[3];
				const search = /(\/.*)+?(\?.*)+?/g.exec(param);
				const hash = /(\/.*)+?(\?.*)+?/g.exec(param);
				if (search) {
					this.Params['path'] = search[0] || "";
					this.Params['search'] = search[1] || "";
					if (this.Params['search'].split('?')) {
						this.Params['search'].split('?')[1].split('&').forEach(el => {
							this.Params['searchParams'][el.split('=')[0]] = el.split('=')[1];
						});
					}
				} else {
					this.Params['path'] = hash[0] || "";
					this.Params['hash'] = hash[1] || "";
				}
			} else return {};
		};
		A.prototype.toUrl = function (obj) {
			obj = obj || {};
			let a = "";
			Object.keys(obj).forEach((el, i) => {
				a += `${el}=${obj[el]}`;
				if (i < Object.keys(obj).length) {
					a += "&";
				}
			});
			return a;
		}

		return A;
	})();

module.exports = UrlUtil;