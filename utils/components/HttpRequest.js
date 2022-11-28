/**
 * Name:            HttpRequest.js
 * Desc:            基于xmlhttprequest技术的http请求，默认是get方式
 * Author:          BulletYuan
 * Create-Time:     2018.09.22
 * Lastset-Time:    2019.08.02
 */
const HttpRequest = (function () {
  const common = {
    nodeEnv: false,
    https: false,
  }
  function contentTypeAdapter(type) {
    type = type ? type.toString().toLowerCase() : 'json';
    let dType = 'application/x-www-form-urlencoded';
    if (type === 'json') {
      dType = 'application/json';
    } else if (type === 'text') {
      dType = 'text/plain';
    } else if (type === 'blob' || type === 'arraybuffer') {
      dType = 'application/octet-stream';
    } else if (type.toString().indexOf('/') > 0) {
      dType = type;
    }
    return dType;
  }
  function requestOptionsAdapter(opts) {
    var nOpts = {};
    if (common.nodeEnv) {
      nOpts = {
        protocol: '',
        hostname: '',
        port: opts.url.indexOf('https') >= 0 ? 443 : 80,
        path: '',
        method: 'GET',
        headers: {
          // 'Accept': '*/*;',
          // 'Accept-Encoding': 'gzip,deflate,compress,*',
        },
      };
      var data = opts.data || null;
      nOpts.method = opts.type;
      nOpts.headers = Object.assign({}, nOpts.headers, opts.headers);
      nOpts.headers.Host = nOpts.hostname;
      if (opts.dataType) {
        nOpts.headers['Content-Type'] = contentTypeAdapter(opts.dataType);
      }
      data && data.length > 0 ? nOpts.headers['Content-Length'] = Buffer.byteLength(data) : '';
      var _url = new URL(opts.url || '');
      nOpts.protocol = _url.protocol;
      nOpts.hostname = _url.hostname;
      nOpts.port = _url.port;
      nOpts.path = _url.pathname + _url.search;
    } else {
      nOpts = {
        url: '',            // 请求地址
        type: 'GET',        // 请求类型 [get|post|put|delete]
        dataType: '',   // 请求数据类型 [arraybuffer|blob|document|json|text|'']
        data: null,           // 请求数据
        headers: {},         // 请求头数据
      };
      nOpts = Object.assign({}, nOpts, opts);
    }
    return nOpts;
  }
  function dataTypeFilter(data, type = 'json') {
    type = type.toString().toLowerCase();
    switch (type) {
      case 'text':
        data = data.toString();
        break;
      case 'json':
        data = JSON.parse(data);
        break;
    }
    return data;
  }
  function A() {
    this.req = null;

    var http = null;
    if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
      http = require("http");
    }

    common.nodeEnv = false;
    if (typeof ActiveXObject !== 'undefined') {
      this.req = new ActiveXObject('Microsoft.XMLHTTP');
    } else if (typeof XMLHttpRequest !== 'undefined') {
      this.req = new XMLHttpRequest();
    } else if (http && typeof http !== 'undefined') {
      common.nodeEnv = true;
      this.req = http;
    } else {
      throw (new Error('not http request object can use at current environment.'));
    }
  }
  A.prototype.request = function (opts) {
    opts = requestOptionsAdapter(opts);
    if (common.nodeEnv) {
      if (opts.protocol && opts.protocol.indexOf('https') >= 0) {
        common.https = true;
        const https = require("https");
        if (typeof https !== 'undefined') {
          this.req = https;
        }
      }
      if (common.https) {
        return new Promise((res, rej) => {
          let _data = '',
            _req = this.req.request(opts, _obj => {
              _obj.setEncoding('utf8');
              _obj.on('data', chunk => {
                _data += chunk;
              });
              _obj.on('end', () => {
                try {
                  _data = dataTypeFilter(_data, this.req.dataType);
                  res(_data);
                } catch (e) {
                  res(_data);
                }
              });
            });
          _req.on('error', err => {
            rej(err.Error);
          });
          opts.data ? _req.write(opts.dataType.toLowerCase() === 'json' ? JSON.stringify(opts.data) : opts.data) : '';
          _req.end();
        });
      } else {
        return new Promise((res, rej) => {
          let _data = '',
            _req = this.req.request(opts, _obj => {
              _obj.setEncoding('utf8');
              _obj.on('data', chunk => {
                _data += chunk;
              });
              _obj.on('end', () => {
                try {
                  _data = dataTypeFilter(_data, this.req.dataType);
                  res(_data);
                } catch (e) {
                  res(_data);
                }
              });
            });
          _req.on('error', err => {
            rej(err.Error);
          });
          opts.data ? _req.write(opts.dataType.toLowerCase() === 'json' ? JSON.stringify(opts.data) : opts.data) : '';
          _req.end();
        });
      }
    } else {
      function setResponseType(type) {
        type = type.toUpperCase() || '';
        switch (type) {
          case 'TEXT': return 'text';
          case 'JSON': return 'json';
          case 'DOCUMENT': return 'document';
          case 'BLOB': return 'blob';
          case 'ARRAYBUFFER': return 'arraybuffer';
          default: return 'json';
        }
      }
      this.req.responseType = setResponseType(opts.dataType.toString());

      return new Promise((res, rej) => {
        this.req.onreadystatechange = () => {
          if (this.req.readyState === 4) {
            if (this.req.status === 200) {
              res(this.req.response);
            } else {
              rej({
                error: this.req.statusText,
                status: this.req.status,
                readyState: this.req.readyState
              });
            }
          }
        };
        try {
          this.req.open(opts.type.toUpperCase(), opts.url);
        } catch (e) {
          rej({
            error: e,
            status: 0,
            readyState: 0
          });
        }
        if (opts.headers) {
          const self = this,
            hkarr = Object.keys(opts.headers);
          for (let i = 0; i < hkarr.length; i++) {
            const hk = hkarr[i];
            self.req.setRequestHeader(hk, opts.headers[hk]);
          }
        }
        opts.data ? this.req.send(opts.dataType.toLowerCase() === 'json' ? JSON.stringify(opts.data) : opts.data) : this.req.send();
      });
    }
  }
  return A;
})();

module.exports = HttpRequest;