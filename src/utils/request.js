import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    config.headers.Authorization = 'Bearer' + getToken()
    return config
  },
  error => {
    // do something with request error

    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 401:
          store.dispatch('user/resetToken').then(() => {
            location.reload()
            Message({
              message: '超时，重新登录',
              type: 'error',
              duration: 5 * 1000
            })
          })
          break
      }
    }

    // return Promise.reject(error)
    return Promise.reject(err)
  }
)

export default service
