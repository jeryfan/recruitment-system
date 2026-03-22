<template>
  <div class="user-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <router-link to="/home" class="logo">
            <el-icon size="32" color="#409EFF"><Compass /></el-icon>
            <span class="title">旅游招聘</span>
          </router-link>
          <nav class="nav-menu">
            <router-link to="/home" class="nav-item" :class="{ active: route.path === '/home' }">首页</router-link>
            <router-link to="/jobs" class="nav-item" :class="{ active: route.path === '/jobs' }">职位</router-link>
            <router-link to="/companies" class="nav-item" :class="{ active: route.path === '/companies' }">企业</router-link>
          </nav>
        </div>

        <div class="header-right">
          <!-- 搜索框 -->
          <div class="search-box">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索职位、公司"
              clearable
              @keyup.enter="handleSearch"
              @click="handleSearch"
              class="beauty-search"
            >
              <template #prefix>
                <el-icon class="search-icon"><Search /></el-icon>
              </template>
            </el-input>
          </div>

          <!-- 通知铃铛 -->
          <NotificationBell v-if="userStore.isLoggedIn" />

          <!-- 用户菜单 -->
          <el-dropdown @command="handleCommand" class="user-dropdown">
            <span class="user-info">
              <el-avatar :size="32" :src="userStore.userInfo?.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="resume">
                  <el-icon><Document /></el-icon>我的简历
                </el-dropdown-item>
                <el-dropdown-item command="applications">
                  <el-icon><List /></el-icon>投递记录
                </el-dropdown-item>
                <el-dropdown-item command="favorites">
                  <el-icon><Star /></el-icon>我的收藏
                </el-dropdown-item>
                <el-dropdown-item command="interviews">
                  <el-icon><Calendar /></el-icon>我的面试
                </el-dropdown-item>
                <el-dropdown-item command="follows">
                  <el-icon><Collection /></el-icon>关注公司
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <p></p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { Compass, Search, User, ArrowDown, Document, List, Star, SwitchButton, Calendar, Collection } from '@element-plus/icons-vue'
import NotificationBell from '@/components/NotificationBell.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const searchKeyword = ref('')

// 检查角色，非用户角色重定向到对应首页
onMounted(() => {
  const role = userStore.userInfo?.role
  if (role === 'hr') {
    router.replace('/hr/dashboard')
  } else if (role === 'admin') {
    router.replace('/admin/dashboard')
  }
})

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/jobs', query: { keyword: searchKeyword.value } })
  }
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'resume':
      router.push('/resume')
      break
    case 'applications':
      router.push('/applications')
      break
    case 'favorites':
      router.push('/favorites')
      break
    case 'interviews':
      router.push('/interviews')
      break
    case 'follows':
      router.push('/follows')
      break
    case 'logout':
      userStore.logout()
      router.push('/login')
      break
  }
}
</script>

<style scoped lang="scss">
.user-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 40px;

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;

      .title {
        font-size: 20px;
        font-weight: 600;
        color: #303133;
      }
    }

    .nav-menu {
      display: flex;
      gap: 32px;

      .nav-item {
        font-size: 15px;
        color: #606266;
        text-decoration: none;
        padding: 8px 0;
        position: relative;
        transition: color 0.3s;

        &:hover {
          color: #409EFF;
        }

        &.active {
          color: #409EFF;
          font-weight: 500;

          &::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            right: 0;
            height: 2px;
            background-color: #409EFF;
            border-radius: 2px;
          }
        }
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .search-box {
      width: 240px;
      line-height: 1;

      :deep(.beauty-search) {
        --el-input-bg-color: transparent;

        .el-input__wrapper {
          border-radius: 16px;
          box-shadow: none;
          border: 1px solid #dcdfe6;
          padding: 0 12px;
          background: transparent !important;
          transition: all 0.2s ease;

          &:hover {
            border-color: #409EFF;
          }

          &.is-focus {
            border-color: #409EFF;
          }

          input {
            font-size: 13px;
            color: #303133;
            background: transparent !important;

            &::placeholder {
              color: #a8abb2;
            }
          }

          .search-icon {
            font-size: 14px;
            color: #a8abb2;
            margin-right: 4px;

            &:hover {
              color: #409EFF;
            }
          }

          .el-input__clear {
            color: #c0c4cc;
            font-size: 12px;

            &:hover {
              color: #909399;
            }
          }
        }
      }
    }

    .user-dropdown {
      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 4px 8px;
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
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  padding: 20px;
  margin-top: auto;

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    color: #909399;
    font-size: 14px;
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
