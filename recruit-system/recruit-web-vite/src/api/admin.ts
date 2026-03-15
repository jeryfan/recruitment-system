import request from '@/utils/request'

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

// 转换分页参数：前端 page 从 1 开始，后端从 0 开始
function convertPageParams(params: { page?: number; size?: number; [key: string]: any }) {
  const { page = 1, size = 10, ...rest } = params
  return {
    page: page - 1,
    count: size,
    ...rest
  }
}

export function getUserList(params: { page?: number; size?: number; keyword?: string }) {
  return request.get<BackendPageResponse<any>>('/recruit/admin/users', {
    params: convertPageParams(params)
  }).then(convertPageResponse)
}

export function updateUserState(id: number, state: number) {
  return request.put(`/recruit/admin/users/${id}/state`, { state })
}

export function getCompanyList(params: { page?: number; size?: number; state?: number }) {
  return request.get<BackendPageResponse<any>>('/recruit/admin/companies', {
    params: convertPageParams(params)
  }).then(convertPageResponse)
}

export function auditCompany(id: number, state: number) {
  return request.put(`/recruit/admin/companies/${id}/audit`, { state })
}

export function getCategoryList() {
  return request.get<any[]>('/recruit/admin/categories')
}

export function createCategory(data: { name: string; info?: string }) {
  return request.post('/recruit/admin/categories', data)
}

export function updateCategory(id: number, data: { name: string; info?: string }) {
  return request.put(`/recruit/admin/categories/${id}`, data)
}

export function deleteCategory(id: number) {
  return request.delete(`/recruit/admin/categories/${id}`)
}
