import request from '@/utils/request'
import type { LoginForm, UserInfo } from '@/types'

export interface LoginResponse {
  access_token: string
  refresh_token: string
}

export function login(data: LoginForm) {
  return request.post<LoginResponse>('/recruit/user/login', data)
}

export function register(data: LoginForm & { nickname: string }) {
  return request.post('/recruit/user/register', data)
}

export function getUserInfo() {
  return request.get<UserInfo>('/recruit/user/information')
}

export function updateUserInfo(data: Partial<UserInfo>) {
  return request.put('/recruit/user/info', data)
}

export function changePassword(data: { oldPassword: string; newPassword: string }) {
  return request.put('/recruit/user/password', data)
}
