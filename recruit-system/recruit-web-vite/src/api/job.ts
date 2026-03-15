import request from '@/utils/request'
import type { Job } from '@/types'
import { useUserStore } from '@/stores/user'

export interface JobQuery {
  page?: number
  size?: number
  keyword?: string
  city?: string
  categoryId?: number
}

// 后端返回的职位数据结构（下划线命名 - 来自职位列表接口）
interface BackendJob {
  id: number
  title: string
  requirement: string
  quantity: number
  city: string
  salary_up: number
  salary_down: number
  release_date: string
  state: number
  hits: number
  category_id: number
  hr_id: number
  company_id: number
  logo: string | null
  category_name: string
  company_name: string
  company_desc: string
}

// 后端返回的收藏职位数据结构（下划线命名 - 来自收藏接口）
interface BackendFavoriteJob {
  id: number
  title: string
  quantity: number
  city: string
  salary_up: number
  salary_down: number
  release_date: string
  state: number
  hits: number
  category_id: number
  hr_id: number
  company_id: number
}

// 转换后端数据为前端格式（下划线命名）
function convertBackendJob(backendJob: BackendJob): Job {
  return {
    id: backendJob.id,
    title: backendJob.title,
    companyName: backendJob.company_name,
    companyLogo: backendJob.logo || undefined,
    salaryMin: backendJob.salary_down / 1000, // 转换为K
    salaryMax: backendJob.salary_up / 1000,
    city: backendJob.city,
    experience: '', // 后端暂无此字段
    education: '', // 后端暂无此字段
    description: backendJob.company_desc,
    requirement: backendJob.requirement,
    tags: backendJob.category_name ? [backendJob.category_name] : [],
    hits: backendJob.hits,
    state: backendJob.state,
    createTime: backendJob.release_date
  }
}

// 转换后端收藏数据为前端格式（下划线命名）
function convertBackendFavoriteJob(backendJob: BackendFavoriteJob): Job {
  return {
    id: backendJob.id,
    title: backendJob.title,
    companyName: '', // 收藏接口不返回公司名称
    companyLogo: undefined,
    salaryMin: backendJob.salary_down ? backendJob.salary_down / 1000 : 0, // 转换为K
    salaryMax: backendJob.salary_up ? backendJob.salary_up / 1000 : 0,
    city: backendJob.city,
    experience: '', // 后端暂无此字段
    education: '', // 后端暂无此字段
    description: '',
    requirement: '',
    tags: [],
    hits: backendJob.hits,
    state: backendJob.state,
    createTime: backendJob.release_date
  }
}

// 获取职位列表 - 使用后端实际的接口 /recruit/position/page/{state}
export function getJobList(params: JobQuery) {
  const { page = 1, size = 10, keyword } = params
  // 后端page从0开始，前端从1开始
  const pageParam = page - 1

  // 如果有关键词，使用关键词搜索接口
  if (keyword) {
    return request.get<{ list: Job[]; total: number }>('/recruit/position/page/keyword', {
      params: { page: pageParam, count: size, keyword }
    }).then(res => {
      // 转换后端数据格式
      const items = (res as any).items || []
      return {
        list: items.map(convertBackendJob),
        total: (res as any).total || 0
      }
    })
  }

  // 默认查询state=1的职位（招聘中）
  return request.get<any>(`/recruit/position/page/1`, {
    params: { page: pageParam, count: size }
  }).then(res => {
    // 转换后端数据格式
    const items = res.items || []
    return {
      list: items.map(convertBackendJob),
      total: res.total || 0
    }
  })
}

// 获取热门职位（按浏览量排序）
export function getHotJobs() {
  return request.get<BackendJob[]>('/recruit/position/sort').then(items => {
    return items.map(convertBackendJob)
  })
}

export function getJobDetail(id: number) {
  return request.get<Job>(`/recruit/position/${id}`)
}

export function applyJob(positionId: number, resumeId: number) {
  return request.post('/recruit/application', { positionId, resumeId })
}

export function favoriteJob(positionId: number) {
  return request.post('/recruit/favor', { positionId })
}

export function cancelFavorite(positionId: number) {
  const userStore = useUserStore()
  const userId = userStore.userInfo?.id
  if (!userId) {
    return Promise.reject(new Error('用户未登录'))
  }
  // 后端接口: /recruit/favor/cancel?userId=xxx&positionId=xxx
  return request.delete('/recruit/favor/cancel', {
    params: { userId, positionId }
  })
}

export function getFavoriteList(params: { page?: number; size?: number }) {
  const userStore = useUserStore()
  const userId = userStore.userInfo?.id
  if (!userId) {
    return Promise.reject(new Error('用户未登录'))
  }
  // 后端接口: /recruit/favor/{userId} 返回直接数组，非分页格式
  // 注意：收藏接口返回的是 BackendFavoriteJob（驼峰命名，字段较少）
  return request.get<BackendFavoriteJob[]>(`/recruit/favor/${userId}`).then(items => {
    const { page = 1, size = 10 } = params
    // 手动分页（后端返回全部数据）
    const total = items.length
    const start = (page - 1) * size
    const end = start + size
    const paginatedItems = items.slice(start, end)
    return {
      list: paginatedItems.map(convertBackendFavoriteJob),
      total
    }
  })
}
