import axios from 'axios'
import Qs from 'qs'

const Axios = axios.create({
  // baseURL: '/',
  timeout: 0, // 永不超时
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache, no-store'
  }
})

const { CancelToken } = axios
// 请求列表
export const requestMap = new Map()
// 3.导出cancel token列表供全局路由守卫使用
export const sources = {}

// 请求前置拦截器
Axios.interceptors.request.use(
  config => {
    // 兼容没有设置参数，导致解析报错
    config.params = config.params || {}
    config.data = config.data || {}

    // 防止重复提交(即当前正在进行的相同请求)
    const keyString = Qs.stringify(
      Object.assign({}, { url: config.url, method: config.method }, config.data, config.params)
    )
    config.cancelToken = new CancelToken(cancel => {
      sources[keyString] = cancel
    })

    // 请求缓存中还存在该请求，则取消当前请求
    if (requestMap.get(keyString)) {
      // 取消当前请求
      sources[keyString]('取消重复请求')
    } else {
      requestMap.set(keyString, true)
    }

    Object.assign(config, { _keyString: keyString })

    const { method, useQs } = config

    if (!useQs && useQs !== undefined) {
    } else if (['post', 'put', 'delete'].includes(method)) {
      // 序列化数据
      config.data = Qs.stringify(config.data, { allowDots: true })
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 返回响应拦截器
Axios.interceptors.response.use(
  res => {
    // 重置requestMap
    const { config } = res
    // 把已经完成的请求从 requestMap 中移除
    requestMap.set(config._keyString, false)

    return res
  },
  error => {
    // console.info('请求错误: ', error)
    if (axios.isCancel(error)) {
      // throw new axios.Cancel('取消当前请求')
    }
    return Promise.reject(error)
  }
)

const request = (options = {}) => {
  return Axios(options)
}

export default request
