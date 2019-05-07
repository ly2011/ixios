import axios from 'axios'
import qs from 'qs'

const Axios = axios.create({
  // baseURL: '/',
  timeout: 0, // 永不超时
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
})

const { CancelToken } = axios
const requestMap = new Map()

// 请求前置拦截器
Axios.interceptors.request.use(
  config => {
    // 兼容没有设置参数，导致解析报错
    config.params = config.params || {}
    config.data = config.data || {}

    // 防止重复提交(即当前正在进行的相同请求)
    const keyString = qs.stringify(
      Object.assign({}, { url: config.url, method: config.method }, config.data, config.params)
    )

    if (requestMap.get(keyString)) {
      // 请求缓存中还存在该请求，则取消当前请求
      // 取消当前请求
      config.cancelToken = new CancelToken(cancel => {
        cancel('Please slow down a little')
      })
    }

    requestMap.set(keyString, true)
    Object.assign(config, { _keyString: keyString })

    if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
      // 序列化数据
      config.data = qs.stringify(config.data)
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

    // if (res.status === 200) {
    //   return res.data
    // }

    return res
  },
  error => {
    return Promise.reject(error)
  }
)

const request = (options = {}) => {
  return Axios(options)
}

export default request
