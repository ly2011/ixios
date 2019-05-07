/*!
 * ixios.js v1.0.0
 * (c) 2018-2019 ly2011
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('axios'), require('qs')) :
  typeof define === 'function' && define.amd ? define(['axios', 'qs'], factory) :
  (global = global || self, global.ixios = factory(global.axios, global.qs));
}(this, function (axios, qs) { 'use strict';

  axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;
  qs = qs && qs.hasOwnProperty('default') ? qs['default'] : qs;

  var Axios = axios.create({
    baseURL: '/',
    timeout: 0,
    // 永不超时
    withCredentials: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  });
  var CancelToken = axios.CancelToken;
  var requestMap = new Map(); // 请求前置拦截器

  Axios.interceptors.request.use(function (config) {
    // 兼容没有设置参数，导致解析报错
    config.params = config.params || {};
    config.data = config.data || {}; // 防止重复提交(即当前正在进行的相同请求)

    var keyString = qs.stringify(Object.assign({}, {
      url: config.url,
      method: config.method
    }, config.data, config.params));

    if (requestMap.get(keyString)) {
      // 请求缓存中还存在该请求，则取消当前请求
      // 取消当前请求
      config.cancelToken = new CancelToken(function (cancel) {
        cancel('Please slow down a little');
      });
    }

    requestMap.set(keyString, true);
    Object.assign(config, {
      _keyString: keyString
    });

    if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
      // 序列化数据
      config.data = qs.stringify(config.data);
    }

    return config;
  }, function (error) {
    return Promise.reject(error);
  }); // 返回响应拦截器

  Axios.interceptors.response.use(function (res) {
    // 重置requestMap
    var config = res.config; // 把已经完成的请求从 requestMap 中移除

    requestMap.set(config._keyString, false); // if (res.status === 200) {
    //   return res.data
    // }

    return res;
  }, function (error) {
    return Promise.reject(error);
  });

  var request = function request(url) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'post';
    return Axios({
      method: method,
      url: url,
      data: data,
      params: method.toUpperCase() === 'GET' && data
    });
  };

  return request;

}));
//# sourceMappingURL=ixios.js.map
