import request from '@/utils/request'
import type { LoginForm, UserInfo } from '@/types'

export interface LoginResponse {
  access_token: string
  refresh_token: string
}

export function login(data: LoginForm) {
  return request.post<LoginResponse>('/recruit/user/login', data)
}

export function register(data: LoginForm & { nickname: string; tel: string; confirmPassword: string; group_ids?: number[] }) {
  // 后端 Jackson 配置为 SNAKE_CASE，多词字段需转为下划线命名
  const { confirmPassword, group_ids, ...rest } = data
  return request.post('/recruit/user/register', {
    ...rest,
    confirm_password: confirmPassword,
    group_ids
  })
}

export function getUserInfo() {
  return request.get<UserInfo>('/recruit/user/information')
}

export function updateUserInfo(data: Partial<UserInfo>) {
  return request.put('/recruit/user/info', data)
}

export function changePassword(data: { oldPassword: string; newPassword: string; confirmPassword: string }) {
  return request.put('/recruit/user/password', {
    old_password: data.oldPassword,
    new_password: data.newPassword,
    confirm_password: data.confirmPassword
  })
}
