import request from '@/utils/request'
import type { Resume, Education, Experience } from '@/types'
import { useUserStore } from '@/stores/user'

// 后端返回的简历数据结构
interface BackendResume {
  resumeId: number
  name: string
  avatar: string
  jobIntention: string
  sex: number
  home: string
  age: number
  english: string
  tel: string
  email: string
  ability: string
  personalSummary: string
  educations: BackendEducation[]
  experiences: BackendExperience[]
}

// 后端返回的教育经历数据结构
interface BackendEducation {
  id: number
  resumeId: number
  name: string  // 学校名称
  major: string
  diploma: number
  descriptions: string  // 注意后端是descriptions不是description
  startTime: string
  endTime: string
}

// 后端返回的工作经历数据结构
interface BackendExperience {
  id: number
  resumeId: number
  name: string  // 公司名称
  position: string
  startTime: string
  endTime: string
  performance: string
}

// 转换后端简历数据为前端格式
function convertBackendResume(backend: BackendResume): Resume {
  return {
    id: backend.resumeId,
    userId: 0, // 会在前端填充
    realName: backend.name || '',
    gender: backend.sex,
    phone: backend.tel || '',
    email: backend.email || '',
    birthday: '', // 后端没有
    city: backend.home || '',
    jobIntention: backend.jobIntention || '',
    selfEvaluation: backend.personalSummary || '',
    educations: (backend.educations || []).map(convertBackendEducation),
    experiences: (backend.experiences || []).map(convertBackendExperience)
  }
}

// 转换后端教育经历为前端格式
function convertBackendEducation(backend: BackendEducation): Education {
  return {
    id: backend.id,
    schoolName: backend.name,  // 后端是name，前端是schoolName
    major: backend.major,
    diploma: backend.diploma,
    description: backend.descriptions,  // 后端是descriptions，前端是description
    startTime: backend.startTime,
    endTime: backend.endTime
  }
}

// 转换前端教育经历格式为后端格式（使用下划线命名）
function convertFrontendEducation(frontend: Partial<Education>): any {
  return {
    id: frontend.id,
    name: frontend.schoolName,  // 后端需要name
    major: frontend.major,
    diploma: frontend.diploma,
    descriptions: frontend.description,  // 后端需要descriptions
    start_time: frontend.startTime,
    end_time: frontend.endTime
  }
}

// 转换后端工作经历为前端格式
function convertBackendExperience(backend: BackendExperience): Experience {
  return {
    id: backend.id,
    companyName: backend.name,  // 后端是name，前端是companyName
    position: backend.position,
    startTime: backend.startTime,
    endTime: backend.endTime,
    performance: backend.performance
  }
}

// 转换前端工作经历格式为后端格式（使用下划线命名）
function convertFrontendExperience(frontend: Partial<Experience>): any {
  return {
    id: frontend.id,
    name: frontend.companyName,  // 后端需要name
    position: frontend.position,
    start_time: frontend.startTime,
    end_time: frontend.endTime,
    performance: frontend.performance
  }
}

export function getMyResume() {
  const userStore = useUserStore()
  const userId = userStore.userInfo?.id
  if (!userId) {
    return Promise.reject(new Error('用户未登录'))
  }
  return request.get<BackendResume>(`/recruit/resume/get/${userId}`).then(convertBackendResume)
}

export function createResume(data: Partial<Resume>) {
  const userStore = useUserStore()
  const userId = userStore.userInfo?.id
  if (!userId) {
    return Promise.reject(new Error('用户未登录'))
  }
  // 转换前端格式为后端格式（使用下划线命名，因为后端配置了 SNAKE_CASE）
  const backendData = {
    user_id: userId,
    name: data.realName,
    sex: data.gender,
    tel: data.phone,
    email: data.email,
    home: data.city,
    job_intention: data.jobIntention,
    personal_summary: data.selfEvaluation,
    ability: '暂无' // 必填字段，默认为暂无
  }
  return request.post<Resume>('/recruit/resume', backendData)
}

export function updateResume(data: Partial<Resume>) {
  const userStore = useUserStore()
  const userId = userStore.userInfo?.id
  if (!userId) {
    return Promise.reject(new Error('用户未登录'))
  }
  // 转换前端格式为后端格式（使用下划线命名，因为后端配置了 SNAKE_CASE）
  const backendData = {
    user_id: userId,
    name: data.realName,
    sex: data.gender,
    tel: data.phone,
    email: data.email,
    home: data.city,
    job_intention: data.jobIntention,
    personal_summary: data.selfEvaluation,
    ability: '暂无' // 必填字段，默认为暂无
  }
  return request.put<Resume>(`/recruit/resume/${userId}`, backendData)
}

export function addEducation(data: Partial<Education>) {
  return request.post<Education>('/recruit/resume/education', convertFrontendEducation(data))
}

export function updateEducation(id: number, data: Partial<Education>) {
  return request.put<Education>(`/recruit/resume/education/${id}`, convertFrontendEducation(data))
}

export function deleteEducation(id: number) {
  return request.delete(`/recruit/resume/education/${id}`)
}

export function addExperience(data: Partial<Experience>) {
  return request.post<Experience>('/recruit/resume/experience', convertFrontendExperience(data))
}

export function updateExperience(id: number, data: Partial<Experience>) {
  return request.put<Experience>(`/recruit/resume/experience/${id}`, convertFrontendExperience(data))
}

export function deleteExperience(id: number) {
  return request.delete(`/recruit/resume/experience/${id}`)
}

// 后端分页数据格式
interface BackendPageResponse<T> {
  items: T[]
  total: number
  page: number
  count: number
}

// 后端返回的申请记录数据结构
interface BackendApplication {
  id: number
  userId: number
  positionId: number
  resumeId: number
  hrId: number
  companyId: number
  state: number
  createTime: string
  updateTime: string
  // 关联数据
  title: string           // 职位名称
  name: string           // 公司名称
  positionCity: string   // 工作地点
  salaryDown: number     // 最低薪资
  salaryUp: number       // 最高薪资
}

// 转换后端申请记录为前端格式
function convertBackendApplication(backend: BackendApplication): any {
  return {
    id: backend.id,
    userId: backend.userId,
    positionId: backend.positionId,
    resumeId: backend.resumeId,
    hrId: backend.hrId,
    companyId: backend.companyId,
    state: backend.state,
    createTime: backend.createTime,
    updateTime: backend.updateTime,
    positionTitle: backend.title,       // 后端是title，前端是positionTitle
    companyName: backend.name,          // 后端是name，前端是companyName
    city: backend.positionCity,         // 后端是positionCity，前端是city
    salaryMin: backend.salaryDown ? backend.salaryDown / 1000 : 0,  // 转换为K
    salaryMax: backend.salaryUp ? backend.salaryUp / 1000 : 0       // 转换为K
  }
}

// 转换分页数据格式
function convertPageResponse<T>(res: BackendPageResponse<T>, converter: (item: T) => any): { list: any[]; total: number } {
  return {
    list: (res.items || []).map(converter),
    total: res.total || 0
  }
}

export function getApplicationList(params: { page?: number; size?: number }) {
  const userStore = useUserStore()
  const userId = userStore.userInfo?.id
  if (!userId) {
    return Promise.reject(new Error('用户未登录'))
  }
  const { page = 1, size = 10 } = params
  // 后端page从0开始，前端从1开始
  const pageParam = page - 1
  // 后端接口: /recruit/application/page/find/{userId}
  return request.get<BackendPageResponse<BackendApplication>>(`/recruit/application/page/find/${userId}`, {
    params: { page: pageParam, count: size }
  }).then(res => convertPageResponse(res, convertBackendApplication))
}
