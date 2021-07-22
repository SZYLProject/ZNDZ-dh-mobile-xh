import axios from 'axios'
// import QS from 'qs'
import { Toast } from 'vant'
import router from '../router'
import currentScience from '../config'
axios.defaults.timeout = 200000
axios.defaults.baseURL = currentScience.baseUrl
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.post['Content-type'] = 'application/x-www-form-urlcode;chatset=UTF-8'
axios.interceptors.request.use(
  config => {
    // const token = localStorage.getItem('token')
    // token && (config.headers.Authorization = token)
    return config
  },
  error => {
    return Promise.error(error)
  }
)

axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    if ((JSON.stringify(error.Toast)).includes('timeout')) {
      Toast.fail('请求超时，请稍后再试！')
    } else {
      if (error.response === undefined) {
        Toast.fail('请求失败，请联系管理员！')
      } else {
        if (error.response.status) {
          switch (error.response.status) {
            case 400:
              Toast.fail('错误请求!')
              break
            case 401:
              router.replace({
                path: '/login',
                query: { redirect: router.currentRoute.fullPath }
              })
              break
            case 403:
              Toast.fail('登录过期，请重新登录！')
              localStorage.removeItem('token')
              setTimeout(() => {
                router.replace({
                  path: '/login',
                  query: {
                    redirect: router.currentRoute.fullPath
                  }
                })
              }, 1000)
              break
            case 404:
              Toast.fail('请求错误,未找到该资源!')
              break
            case 405:
              Toast.error('请求方法未允许!')
              break
            case 408:
              Toast.error('请求超时!')
              break
            case 500:
              Toast.error('服务器端出错')
              break
            case 501:
              Toast.error('网络未实现')
              break
            case 502:
              Toast.error('网络错误')
              break
            case 503:
              Toast.error('服务不可用')
              break
            case 504:
              Toast.error('网络超时')
              break
            default:
              Toast.fail(error.response.data.Toast)
              break
          }
          return Promise.reject(error.response)
        } else {
          Toast.fail('请求失败，请稍后再试！')
        }
      }
    }
  }
)

/**
 * get方法，对应get请求
 * @param {String} url 请求的url地址
 * @param {Object} params 请求时携带的参数
*/

export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url  请求的url地址
 * @param {Object} params 请求时携带的参数  json
*/

export function post (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}
