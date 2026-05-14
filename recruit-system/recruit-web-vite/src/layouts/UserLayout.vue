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
              class="beauty-search"
            >
              <template #prefix>
                <el-icon class="search-icon"><Search /></el-icon>
              </template>
              <template #suffix>
                <el-icon class="search-action" @click="handleSearch"><ArrowRight /></el-icon>
              </template>
            </el-input>
          </div>

          <!-- 通知铃铛 -->
          <NotificationBell v-if="userStore.isLoggedIn" />

          <!-- 未登录时显示登录/注册按钮 -->
          <template v-if="!userStore.isLoggedIn">
            <el-button @click="router.push('/login')" size="small">登录</el-button>
            <el-button type="primary" @click="router.push('/register')" size="small">注册</el-button>
          </template>

          <!-- 用户菜单 -->
          <el-dropdown v-if="userStore.isLoggedIn" @command="handleCommand" class="user-dropdown">
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
      <div class="footer-inner">
        <div class="footer-main">
          <!-- 品牌信息 -->
          <div class="footer-brand">
            <div class="brand-logo">
              <el-icon size="28" color="#409EFF"><Compass /></el-icon>
              <span>旅游招聘平台</span>
            </div>
            <p class="brand-desc">基于 SpringBoot + Vue3 的招聘系统设计与实现，连接优质企业与求职者。</p>
            <div class="brand-tags">
              <span class="brand-tag">毕业设计</span>
              <span class="brand-tag">2026</span>
              <span class="brand-tag">招聘系统</span>
            </div>
          </div>

          <!-- 快速链接 -->
          <div class="footer-links">
            <div class="links-group">
              <h4>求职者</h4>
              <ul>
                <li><router-link to="/jobs">浏览职位</router-link></li>
                <li><router-link to="/companies">发现企业</router-link></li>
                <li><router-link to="/resume">我的简历</router-link></li>
                <li><router-link to="/applications">投递记录</router-link></li>
              </ul>
            </div>
            <div class="links-group">
              <h4>热门分类</h4>
              <ul>
                <li><a @click="searchTag('导游')">导游</a></li>
                <li><a @click="searchTag('酒店经理')">酒店经理</a></li>
                <li><a @click="searchTag('旅行顾问')">旅行顾问</a></li>
                <li><a @click="searchTag('空乘')">空乘</a></li>
              </ul>
            </div>
            <div class="links-group">
              <h4>关于系统</h4>
              <ul>
                <li><span>毕业设计作品</span></li>
                <li><span>SpringBoot + Vue3 技术栈</span></li>
                <li><span>前后端分离架构</span></li>
                <li><span>RBAC 权限管理</span></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 分割线 + 版权 -->
        <div class="footer-bottom">
          <span>© 2026 毕业设计作品</span>
          <span class="footer-divider">|</span>
          <span>基于 SpringBoot + Vue3 的招聘系统设计与实现</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { Compass, Search, User, ArrowDown, Document, List, Star, SwitchButton, Calendar, Collection, ArrowRight } from '@element-plus/icons-vue'
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

const searchTag = (tag: string) => {
  router.push({ path: '/jobs', query: { keyword: tag } })
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
      width: 280px;
      display: flex;
      align-items: center;
      height: 40px;

      :deep(.el-input) {
        height: 40px;
      }

      :deep(.el-input__wrapper) {
        border-radius: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #e4e7ed;
        padding: 0 16px;
        background: #fff;
        transition: all 0.25s ease;
        height: 40px;

        &:hover {
          border-color: #409EFF;
        }

        &.is-focus {
          border-color: #409EFF;
          box-shadow: 0 0 0 1px #409EFF inset;
        }

        input {
          font-size: 14px;
          color: #303133;
          background: transparent;

          &::placeholder {
            color: #a8abb2;
          }
        }

        .search-icon {
          font-size: 16px;
          color: #909399;
          margin-right: 4px;
        }

        .search-action {
          font-size: 16px;
          color: #c0c4cc;
          cursor: pointer;
          transition: color 0.2s;

          &:hover {
            color: #409EFF;
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
  background: #1a1a2e;
  margin-top: auto;

  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .footer-main {
    display: flex;
    gap: 60px;
    padding: 48px 0 36px;

    .footer-brand {
      flex: 1.2;
      min-width: 200px;

      .brand-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;

        span {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
        }
      }

      .brand-desc {
        font-size: 13px;
        color: rgba(255,255,255,0.55);
        line-height: 1.8;
        margin: 0 0 16px;
      }

      .brand-tags {
        display: flex;
        gap: 8px;

        .brand-tag {
          padding: 2px 12px;
          border: 1px solid rgba(64,158,255,0.5);
          border-radius: 20px;
          font-size: 12px;
          color: #409EFF;
        }
      }
    }

    .footer-links {
      flex: 2;
      display: flex;
      gap: 40px;

      .links-group {
        flex: 1;

        h4 {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        a, span {
          font-size: 13px;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;

          &:hover {
            color: #409EFF;
          }
        }
      }
    }
  }

  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 16px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: 13px;
    color: rgba(255,255,255,0.35);

    .footer-divider {
      opacity: 0.3;
    }
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
