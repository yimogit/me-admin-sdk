import axios from 'axios'
import { warn } from './pages'
// import qs from 'qs'
const instance =
  axios &&
  axios.create({
    // baseURL: '', // api的base_url
    timeout: 10000 // 请求超时时间
    // transformRequest: data => qs.stringify(data)
  })
// request拦截器
instance &&
  instance.interceptors.request.use(
    e => {
      e.url = e.url
      e.params = e.params || {}
      e.headers = e.headers || {}
      return e
    },
    error => ({ status: 0, msg: error.message })
  )
// respone拦截器

instance &&
  instance.interceptors.response.use(
    response => {
      const resp = response.data
      if (resp && resp.status === 0 && resp.msg) {
        warn(resp.msg)
      }
      if (response.status === 200) {
        return resp
      }
      return response
    },
    error => {
      const err = { status: 0, msg: '服务器异常' }
      if (
        error.message &&
        (error.message.indexOf('403') > -1 || error.message.indexOf('401') > -1)
      ) {
        err.msg = '权限校验失败，请重新登录'
      }
      warn(err.msg)
      console.log('err' + error) // for debug
      return Promise.reject(err)
    }
  )

export default instance

export function get(url, params, opt) {
  if (!instance) {
    throw new Error('axios not found')
  }
  return instance(
    Object.assign(
      {
        url: url,
        method: 'GET',
        params: params
      },
      opt
    )
  )
}
export function post(url, data, opt) {
  if (!instance) {
    throw new Error('axios not found')
  }
  return instance(
    Object.assign(
      {
        url: url,
        method: 'POST',
        data: data
      },
      opt
    )
  )
}
