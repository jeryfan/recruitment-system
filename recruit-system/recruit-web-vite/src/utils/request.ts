import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// token过期/无效相关错误码（Lin CMS）
const AUTH_ERROR_CODES = [401, 10000, 10001, 10040, 10051, 10052]

// 防止并发请求同时触发多次跳转和多次 toast
let isAuthRedirecting = false

function clearAuthAndRedirect(message?: string) {
  if (isAuthRedirecting) return
  isAuthRedirecting = true
  localStorage.removeItem('token')
  localStorage.removeItem('user-store')
  ElMessage.warning(message || '登录已过期，请重新登录')
  router.replace('/login').finally(() => {
    // 跳转完成后重置标志，允许下次正常检测
    setTimeout(() => { isAuthRedirecting = false }, 1000)
  })
}

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 如果没有 code 字段，直接返回数据（兼容后端直接返回数据的接口）
    if (res.code === undefined) {
      return res
    }
    // 成功状态码：0, 200, 1000-2000（Lin CMS 状态码范围）
    const successCodes = [0, 200, 1000, 1010, 1100, 1600, 2100, 2200, 4000, 4100, 7000, 7100, 7200]
    if (!successCodes.includes(res.code)) {
      // token过期或无效 —— 清除并跳转（避免多个并发请求弹多次，由 clearAuthAndRedirect 去重）
      if (AUTH_ERROR_CODES.includes(res.code)) {
        clearAuthAndRedirect(res.message)
        return Promise.reject(new Error(res.message))
      }
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message))
    }
    return res.data || res
  },
  (error) => {
    const status = error.response?.status
    const code = error.response?.data?.code

    // HTTP 401 或 body 里的认证错误码 —— token过期/无效
    if (status === 401 || AUTH_ERROR_CODES.includes(code)) {
      const msg = error.response?.data?.message || 'token已过期，请重新登录'
      clearAuthAndRedirect(msg)
      return Promise.reject(error)
    }

    // 其他网络/服务端错误
    const msg = error.response?.data?.message || error.message || '网络错误，请稍后重试'
    ElMessage.error(msg)
    return Promise.reject(error)
  }
)

export default request
