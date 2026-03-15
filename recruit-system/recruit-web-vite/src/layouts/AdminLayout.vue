<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="aside">
      <div class="logo">
        <el-icon size="32" color="#409EFF"><Compass /></el-icon>
        <span class="title">旅游招聘</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        class="menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <breadcrumb />
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="userStore.userInfo?.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="password">修改密码</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import Breadcrumb from './components/Breadcrumb.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const menuItems = computed(() => {
  const allMenus = [
    { path: '/home', title: '首页', icon: 'HomeFilled', roles: ['user', 'hr', 'admin'] },
    { path: '/jobs', title: '职位搜索', icon: 'Search', roles: ['user', 'hr', 'admin'] },
    { path: '/companies', title: '旅游企业', icon: 'OfficeBuilding', roles: ['user', 'hr', 'admin'] },
    { path: '/resume', title: '我的简历', icon: 'Document', roles: ['user'] },
    { path: '/applications', title: '投递记录', icon: 'List', roles: ['user'] },
    { path: '/favorites', title: '我的收藏', icon: 'StarFilled', roles: ['user'] },
    { path: '/company/manage', title: '企业管理', icon: 'OfficeBuilding', roles: ['hr'] },
    { path: '/job/manage', title: '职位管理', icon: 'Collection', roles: ['hr'] },
    { path: '/resumes', title: '简历管理', icon: 'DocumentCopy', roles: ['hr'] },
    { path: '/admin/users', title: '用户管理', icon: 'UserFilled', roles: ['admin'] },
    { path: '/admin/companies', title: '企业审核', icon: 'OfficeBuilding', roles: ['admin'] },
    { path: '/admin/categories', title: '职位分类', icon: 'Grid', roles: ['admin'] },
  ]
  const userRole = userStore.userInfo?.role || 'user'
  return allMenus.filter(item => item.roles.includes(userRole))
})

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/resume')
      break
    case 'password':
      // TODO: 打开修改密码对话框
      break
    case 'logout':
      userStore.logout()
      router.push('/login')
      break
  }
}
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;

  .aside {
    background-color: #304156;

    .logo {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      border-bottom: 1px solid #1f2d3d;

      .title {
        color: #fff;
        font-size: 18px;
        font-weight: 600;
      }
    }

    .menu {
      border-right: none;
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .header-right {
      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        transition: background-color 0.3s;

        &:hover {
          background-color: #f5f7fa;
        }

        .username {
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }

  .main {
    background-color: #f0f2f5;
    padding: 20px;
    overflow-y: auto;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
