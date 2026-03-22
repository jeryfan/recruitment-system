import request from '@/utils/request'
import { useUserStore } from '@/stores/user'

// 后端面试数据结构
interface BackendInterview {
  id: number
  resume_id: number
  user_id: number
  company_id: number
  hr_id: number
  position_id: number
  time: string | null
  address: string | null
  memo: string | null
  comments: string | null
  status: number
  // 关联数据
  nickname: string
  email: string
  tel: string
  title: string        // 职位名称
  name: string         // 公司名称
  city: string         // 城市
  create_time: string
}

// 后端申请数据结构（HR视角）
interface BackendApplication {
  id: number
  user_id: number
  position_id: number
  resume_id: number
  hr_id: number
  company_id: number
  state: number
  apply_time: string | null
  create_time: string
  // 关联数据
  nickname: string
  email: string
  tel: string
  title: string        // 职位名称
  name: string         // 公司名称
  position_city: string
  salary_down: number
  salary_up: number
}

interface BackendPageResponse<T> {
  items: T[]
  total: number
  page: number
  count: number
}

// 获取HR的面试列表（state 不传时查全部）
export function getHrInterviews(params: { page?: number; size?: number; state?: number | '' } = {}) {
  const userStore = useUserStore()
  const hrId = userStore.userInfo?.id
  if (!hrId) return Promise.reject(new Error('用户未登录'))

  const { page = 1, size = 10, state } = params
  const queryParams: any = { page: page - 1, count: size }
  if (state !== '' && state !== undefined) queryParams.state = state
  return request.get<BackendPageResponse<BackendInterview>>(`/recruit/interview/page/${hrId}`, {
    params: queryParams
  })
}

// 发送面试通知（同时更新地址、时间、备注，status 置为 1）
export function sendInterviewNotify(data: {
  id: number
  time: string
  address: string
  memo?: string
}) {
  return request.post('/recruit/interview/sendInterviewNotify', data)
}

// 更新面试结果（status + comments）
export function updateInterviewResult(data: {
  id: number
  status: number
  comments?: string
}) {
  return request.post('/recruit/interview/updateInterviewResult', data)
}

// 获取HR的申请列表（state 不传时查全部）
export function getHrApplications(params: { page?: number; size?: number; state?: number | '' } = {}) {
  const userStore = useUserStore()
  const hrId = userStore.userInfo?.id
  if (!hrId) return Promise.reject(new Error('用户未登录'))

  const { page = 1, size = 10, state } = params
  const queryParams: any = { page: page - 1, count: size }
  if (state !== '' && state !== undefined) queryParams.state = state
  return request.get<BackendPageResponse<BackendApplication>>(`/recruit/application/page/${hrId}`, {
    params: queryParams
  })
}

// 更新申请状态（0待处理 1感兴趣→创建面试记录 2不合适）
export function updateApplicationState(id: number, state: number) {
  return request.put(`/recruit/application/state/${id}`, {}, { params: { state } })
}
