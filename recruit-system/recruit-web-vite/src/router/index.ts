import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { public: true }
  },
  // 用户端布局 - 仅求职者可访问
  {
    path: '/',
    name: 'UserLayout',
    component: () => import('@/layouts/UserLayout.vue'),
    redirect: '/home',
    meta: { role: 'user' },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/jobs',
        name: 'Jobs',
        component: () => import('@/views/jobs/index.vue'),
        meta: { title: '职位搜索' }
      },
      {
        path: '/jobs/:id',
        name: 'JobDetail',
        component: () => import('@/views/jobs/detail.vue'),
        meta: { title: '职位详情' }
      },
      {
        path: '/companies',
        name: 'Companies',
        component: () => import('@/views/companies/index.vue'),
        meta: { title: '旅游企业' }
      },
      {
        path: '/resume',
        name: 'Resume',
        component: () => import('@/views/resume/index.vue'),
        meta: { title: '我的简历', requiresAuth: true }
      },
      {
        path: '/applications',
        name: 'Applications',
        component: () => import('@/views/applications/index.vue'),
        meta: { title: '投递记录', requiresAuth: true }
      },
      {
        path: '/favorites',
        name: 'Favorites',
        component: () => import('@/views/favorites/index.vue'),
        meta: { title: '我的收藏', requiresAuth: true }
      }
    ]
  },
  // HR端布局 - 仅HR可访问
  {
    path: '/hr',
    name: 'HRLayout',
    component: () => import('@/layouts/HRLayout.vue'),
    redirect: '/hr/dashboard',
    meta: { role: 'hr' },
    children: [
      {
        path: 'dashboard',
        name: 'HRDashboard',
        component: () => import('@/views/hr/dashboard.vue'),
        meta: { title: '工作台', icon: 'HomeFilled' }
      },
      {
        path: '/company/manage',
        name: 'CompanyManage',
        component: () => import('@/views/company-manage/index.vue'),
        meta: { title: '企业管理', icon: 'OfficeBuilding' }
      },
      {
        path: '/job/manage',
        name: 'JobManage',
        component: () => import('@/views/job-manage/index.vue'),
        meta: { title: '职位管理', icon: 'Collection' }
      },
      {
        path: '/resumes',
        name: 'ResumeManage',
        component: () => import('@/views/resume-manage/index.vue'),
        meta: { title: '简历管理', icon: 'DocumentCopy' }
      },
      {
        path: 'profile',
        name: 'HRProfile',
        component: () => import('@/views/hr/profile.vue'),
        meta: { title: '个人中心', icon: 'User' }
      }
    ]
  },
  // Admin端布局 - 仅管理员可访问
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/admin/dashboard',
    meta: { role: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/dashboard.vue'),
        meta: { title: '管理控制台', icon: 'HomeFilled' }
      },
      {
        path: 'users',
        name: 'UserManage',
        component: () => import('@/views/admin/users.vue'),
        meta: { title: '用户管理', icon: 'UserFilled' }
      },
      {
        path: 'companies',
        name: 'CompanyAudit',
        component: () => import('@/views/admin/companies.vue'),
        meta: { title: '企业审核', icon: 'OfficeBuilding' }
      },
      {
        path: 'categories',
        name: 'CategoryManage',
        component: () => import('@/views/admin/categories.vue'),
        meta: { title: '职位分类', icon: 'Grid' }
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('@/views/admin/profile.vue'),
        meta: { title: '个人中心', icon: 'User' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫 - 严格的角色隔离
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const userRole = userStore.userInfo?.role || ''

  // 不需要登录的页面
  if (to.meta.public) {
    // 如果已登录，跳转到对应角色的首页
    if (userStore.token && userRole) {
      if (userRole === 'admin') {
        next('/admin/dashboard')
      } else if (userRole === 'hr') {
        next('/hr/dashboard')
      } else {
        next('/home')
      }
      return
    }
    next()
    return
  }

  // 未登录
  if (!userStore.token) {
    next('/login')
    return
  }

  // 检查路由的角色限制
  const routeRole = to.meta.role as string | undefined
  if (routeRole && routeRole !== userRole) {
    // 角色不匹配，跳转到对应角色的首页
    if (userRole === 'admin') {
      next('/admin/dashboard')
    } else if (userRole === 'hr') {
      next('/hr/dashboard')
    } else {
      next('/home')
    }
    return
  }

  // 检查具体的roles限制（兼容旧代码）
  if (to.meta.roles) {
    const allowedRoles = to.meta.roles as string[]
    if (!allowedRoles.includes(userRole)) {
      if (userRole === 'admin') {
        next('/admin/dashboard')
      } else if (userRole === 'hr') {
        next('/hr/dashboard')
      } else {
        next('/home')
      }
      return
    }
  }

  next()
})

export default router
