import request from '@/utils/request'
import type { Company } from '@/types'

export function getMyCompany() {
  return request.get<Company>('/recruit/company/my')
}

export function createCompany(data: Partial<Company>) {
  return request.post<Company>('/recruit/company', data)
}

export function updateCompany(data: Partial<Company>) {
  return request.put<Company>('/recruit/company', data)
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

// 转换分页数据格式
function convertPageResponse<T>(res: BackendPageResponse<T>): { list: T[]; total: number } {
  return {
    list: res.items || [],
    total: res.total || 0
  }
}

export function getCompanyList(params: { page?: number; size?: number; state?: number }) {
  const { page = 1, size = 12, state = 1 } = params
  // 后端 page 从 0 开始，前端从 1 开始
  const pageParam = page - 1
  return request.get<BackendPageResponse<Company>>(`/recruit/company/page/${state}`, {
    params: { page: pageParam, count: size }
  }).then(convertPageResponse)
}

export function auditCompany(id: number, state: number) {
  return request.put(`/recruit/company/audit/${id}`, { state })
}
