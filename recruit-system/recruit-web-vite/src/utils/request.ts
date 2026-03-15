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
      ElMessage.error(res.message || '请求失败')
      if (res.code === 401) {
        localStorage.removeItem('token')
        router.push('/login')
      }
      return Promise.reject(new Error(res.message))
    }
    return res.data || res
  },
  (error) => {
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request
