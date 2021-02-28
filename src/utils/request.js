import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'

const request = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn/',
  baseURL: 'http://api-toutiao-web.itheima.net/',
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // console.log(user)
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 所有响应码为 2xx 的响应都会进入这里

  // response 是响应处理
  // 注意 一定要把响应结果 return 否则真正发送请求的位置拿不到数据
  return response
}, function (error) {
  // 任何超出 2xx 的响应码都会进入这里
  console.log('状态码异常')
  console.dir(error)
  // 跳转到登录页面
  // 清楚本地存储中的用户登录状态
  window.localStorage.removeItem('user')
  router.push('/login')
  return Promise.reject(error)
})

export default request
