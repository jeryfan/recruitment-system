export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
  email?: string
  phone?: string
  role: 'user' | 'hr' | 'admin'
  groups?: Array<{
    id: number
    name: string
    info: string
  }>
  createTime?: string
}

export interface LoginForm {
  username: string
  password: string
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface Job {
  id: number
  title: string
  companyName: string
  companyLogo?: string
  salaryMin: number
  salaryMax: number
  city: string
  experience: string
  education: string
  description: string
  requirement: string
  tags: string[]
  hits: number
  state: number
  createTime: string
  hrId?: number
  companyId?: number
}

export interface Company {
  id: number
  name: string
  foreignName?: string
  city: string
  logo?: string
  mission?: string
  description?: string
  state: number
  createTime: string
}

export interface Resume {
  id: number
  userId: number
  realName: string
  gender: number
  phone: string
  email: string
  birthday?: string
  city?: string
  jobIntention?: string
  selfEvaluation?: string
  educations: Education[]
  experiences: Experience[]
}

export interface Education {
  id: number
  schoolName: string
  major: string
  diploma: number
  startTime: string
  endTime: string
  description?: string
}

export interface Experience {
  id: number
  companyName: string
  position: string
  startTime: string
  endTime: string
  performance?: string
}
