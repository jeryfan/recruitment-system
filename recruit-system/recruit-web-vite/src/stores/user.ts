import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, LoginForm } from '@/types'
import { login as loginApi, getUserInfo } from '@/api/user'
import { ElMessage } from 'element-plus'

// 从 groups 解析角色
function parseRole(groups?: Array<{ name: string }>): 'user' | 'hr' | 'admin' {
  if (!groups || groups.length === 0) return 'user'
  const groupName = groups[0].name.toLowerCase()
  if (groupName.includes('admin') || groupName.includes('root')) return 'admin'
  if (groupName.includes('hr')) return 'hr'
  return 'user'
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const role = computed(() => {
    if (!userInfo.value) return ''
    return parseRole(userInfo.value.groups)
  })

  async function login(form: LoginForm) {
    try {
      const res = await loginApi(form)
      const accessToken = res.access_token || res.token
      token.value = accessToken
      localStorage.setItem('token', accessToken)
      const user = await fetchUserInfo()
      ElMessage.success('登录成功')
      return user
    } catch (error) {
      console.error('登录失败:', error)
      ElMessage.error('登录失败')
      return null
    }
  }

  async function fetchUserInfo() {
    try {
      const res = await getUserInfo()
      // 解析角色
      res.role = parseRole(res.groups)
      userInfo.value = res
      return res
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    ElMessage.success('退出成功')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    role,
    login,
    fetchUserInfo,
    logout
  }
}, {
  persist: {
    key: 'user-store',
    paths: ['token']
  }
})
