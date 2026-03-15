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
  // 用户端布局
  {
    path: '/',
    name: 'UserLayout',
    component: () => import('@/layouts/UserLayout.vue'),
    redirect: '/home',
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
  // 管理后台布局（HR/Admin）
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/admin/dashboard',
    children: [
      // HR端
      {
        path: '/company/manage',
        name: 'CompanyManage',
        component: () => import('@/views/company-manage/index.vue'),
        meta: { title: '企业管理', icon: 'OfficeBuilding', roles: ['hr', 'admin'] }
      },
      {
        path: '/job/manage',
        name: 'JobManage',
        component: () => import('@/views/job-manage/index.vue'),
        meta: { title: '职位管理', icon: 'Collection', roles: ['hr', 'admin'] }
      },
      {
        path: '/resumes',
        name: 'ResumeManage',
        component: () => import('@/views/resume-manage/index.vue'),
        meta: { title: '简历管理', icon: 'DocumentCopy', roles: ['hr', 'admin'] }
      },
      // 管理端
      {
        path: '/admin/users',
        name: 'UserManage',
        component: () => import('@/views/admin/users.vue'),
        meta: { title: '用户管理', icon: 'UserFilled', roles: ['admin'] }
      },
      {
        path: '/admin/companies',
        name: 'CompanyAudit',
        component: () => import('@/views/admin/companies.vue'),
        meta: { title: '企业审核', icon: 'OfficeBuilding', roles: ['admin'] }
      },
      {
        path: '/admin/categories',
        name: 'CategoryManage',
        component: () => import('@/views/admin/categories.vue'),
        meta: { title: '职位分类', icon: 'Grid', roles: ['admin'] }
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

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 不需要登录的页面
  if (to.meta.public) {
    next()
    return
  }

  // 未登录且需要登录
  if (!userStore.token) {
    next('/login')
    return
  }

  // 需要特定角色的页面
  if (to.meta.roles) {
    if (!to.meta.roles.includes(userStore.userInfo?.role)) {
      next('/')
      return
    }
  }

  next()
})

export default router
