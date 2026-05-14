import request from '@/utils/request'
import type { Company } from '@/types'

// 后端返回的公司数据结构（Jackson SNAKE_CASE 下划线命名）
interface BackendCompany {
  id: number
  name: string
  foreign_name: string
  city: string
  logo: string | null
  mission: string
  description: string
  state: number
  create_time: string
}

// 转换后端公司数据为前端格式
function convertBackendCompany(backend: BackendCompany): Company {
  return {
    id: backend.id,
    name: backend.name || '',
    foreignName: backend.foreign_name || '',
    city: backend.city || '',
    logo: backend.logo || undefined,
    mission: backend.mission || '',
    description: backend.description || '',
    state: backend.state || 0,
    createTime: backend.create_time || ''
  }
}

// 转换前端公司数据为后端格式（snake_case）
function convertFrontendCompany(frontend: Partial<Company>): any {
  return {
    id: frontend.id,
    name: frontend.name,
    foreign_name: frontend.foreignName,
    city: frontend.city,
    logo: frontend.logo,
    mission: frontend.mission,
    description: frontend.description,
    state: frontend.state
  }
}

export function getMyCompany() {
  return request.get<BackendCompany>('/recruit/company/my').then(convertBackendCompany)
}

export function createCompany(data: Partial<Company>) {
  return request.post<BackendCompany>('/recruit/company', convertFrontendCompany(data)).then(convertBackendCompany)
}

export function updateCompany(id: number, data: Partial<Company>) {
  return request.put<BackendCompany>(`/recruit/company/${id}`, convertFrontendCompany(data)).then(convertBackendCompany)
}

export function uploadLogo(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<{ url: string }>('/recruit/upload/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 后端分页数据格式
interface BackendPageResponse<T> {
  items: T[]
  total: number
  page: number
  count: number
}

export function getCompanyList(params: { page?: number; size?: number; state?: number; keyword?: string }) {
  const { page = 1, size = 12, state = 1, keyword } = params
  // 后端 page 从 0 开始，前端从 1 开始
  const pageParam = page - 1
  const queryParams: any = { page: pageParam, count: size }
  if (keyword) queryParams.keyword = keyword
  return request.get<BackendPageResponse<BackendCompany>>(`/recruit/company/page/${state}`, {
    params: queryParams
  }).then(res => ({
    list: (res.items || []).map(convertBackendCompany),
    total: res.total || 0
  }))
}

export function auditCompany(id: number, state: number) {
  return request.put(`/recruit/company/audit/${id}`, { state })
}
