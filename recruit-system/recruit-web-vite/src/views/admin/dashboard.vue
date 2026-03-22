<template>
  <div class="admin-dashboard">
    <!-- 数据概览卡片 -->
    <div class="stat-cards" v-loading="loading">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon" style="background: #e6f7ff; color: #1890ff;">
          <el-icon size="32"><User /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalUsers }}</div>
          <div class="stat-label">注册用户</div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon" style="background: #f6ffed; color: #52c41a;">
          <el-icon size="32"><OfficeBuilding /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.approvedCompanies }}</div>
          <div class="stat-label">认证企业</div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon" style="background: #fff7e6; color: #fa8c16;">
          <el-icon size="32"><Collection /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalPositions }}</div>
          <div class="stat-label">发布职位</div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon" style="background: #fff0f6; color: #eb2f96;">
          <el-icon size="32"><Warning /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.pendingCompanies }}</div>
          <div class="stat-label">待审核企业</div>
        </div>
      </el-card>
    </div>

    <!-- 待办事项 + 系统信息 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待办事项</span>
            </div>
          </template>
          <div class="todo-list">
            <div class="todo-item" @click="$router.push('/admin/companies')">
              <div class="todo-info">
                <el-icon size="24" color="#f56c6c"><Warning /></el-icon>
                <span class="todo-text">待审核企业</span>
              </div>
              <div class="todo-right">
                <el-badge v-if="stats.pendingCompanies > 0" :value="stats.pendingCompanies" type="danger" />
                <el-tag v-else type="success" size="small">已清空</el-tag>
                <el-button type="primary" link size="small" style="margin-left: 8px;">去处理</el-button>
              </div>
            </div>
            <div class="todo-item" @click="$router.push('/admin/users')">
              <div class="todo-info">
                <el-icon size="24" color="#e6a23c"><UserFilled /></el-icon>
                <span class="todo-text">用户管理</span>
              </div>
              <div class="todo-right">
                <el-tag type="info" size="small">共 {{ stats.totalUsers }} 人</el-tag>
                <el-button type="primary" link size="small" style="margin-left: 8px;">查看</el-button>
              </div>
            </div>
            <div class="todo-item" @click="$router.push('/admin/categories')">
              <div class="todo-info">
                <el-icon size="24" color="#409eff"><Grid /></el-icon>
                <span class="todo-text">职位分类管理</span>
              </div>
              <div class="todo-right">
                <el-tag type="info" size="small">共 {{ stats.totalCategories }} 类</el-tag>
                <el-button type="primary" link size="small" style="margin-left: 8px;">管理</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>数据概览</span>
            </div>
          </template>
          <div class="overview-list">
            <div class="overview-item">
              <span class="ov-label">总公司数</span>
              <el-progress
                :percentage="getPercent(stats.approvedCompanies, stats.totalCompanies)"
                :format="() => stats.totalCompanies + '家'"
                color="#52c41a"
              />
            </div>
            <div class="overview-item">
              <span class="ov-label">认证通过率</span>
              <el-progress
                :percentage="getPercent(stats.approvedCompanies, stats.totalCompanies)"
                :format="(p: number) => p + '%'"
                color="#1890ff"
              />
            </div>
            <div class="overview-item">
              <span class="ov-label">发布职位数</span>
              <el-progress
                :percentage="100"
                :format="() => stats.totalPositions + '个'"
                color="#fa8c16"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-card shadow="hover" style="margin-top: 20px;">
      <template #header>
        <div class="card-header"><span>快捷操作</span></div>
      </template>
      <div class="action-list">
        <div class="action-item" @click="$router.push('/admin/companies')">
          <el-icon size="28" color="#f56c6c"><OfficeBuilding /></el-icon>
          <span>企业审核</span>
        </div>
        <div class="action-item" @click="$router.push('/admin/users')">
          <el-icon size="28" color="#409EFF"><UserFilled /></el-icon>
          <span>用户管理</span>
        </div>
        <div class="action-item" @click="$router.push('/admin/categories')">
          <el-icon size="28" color="#E6A23C"><Grid /></el-icon>
          <span>分类管理</span>
        </div>
        <div class="action-item" @click="$router.push('/admin/profile')">
          <el-icon size="28" color="#909399"><Setting /></el-icon>
          <span>个人中心</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { User, UserFilled, OfficeBuilding, Collection, Warning, Grid, Setting } from '@element-plus/icons-vue'
import request from '@/utils/request'

const loading = ref(false)
const stats = ref({
  totalUsers: 0,
  totalCompanies: 0,
  approvedCompanies: 0,
  pendingCompanies: 0,
  totalPositions: 0,
  totalCategories: 0
})

const fetchStats = async () => {
  loading.value = true
  try {
    const res = await request.get<any>('/recruit/admin/stats')
    stats.value = {
      totalUsers: res.totalUsers || 0,
      totalCompanies: (res.approvedCompanies || 0) + (res.pendingCompanies || 0),
      approvedCompanies: res.approvedCompanies || 0,
      pendingCompanies: res.pendingCompanies || 0,
      totalPositions: res.totalPositions || 0,
      totalCategories: res.totalCategories || 0
    }
  } catch (error) {
    ElMessage.warning('获取统计数据失败')
  } finally {
    loading.value = false
  }
}

const getPercent = (part: number, total: number) => {
  if (!total) return 0
  return Math.round((part / total) * 100)
}

onMounted(fetchStats)
</script>

<style scoped lang="scss">
.admin-dashboard {
  .stat-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

    .stat-card {
      cursor: default;
      :deep(.el-card__body) {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
      }

      .stat-icon {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .stat-info {
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 13px;
          color: #64748b;
        }
      }
    }
  }

  .card-header {
    font-weight: 600;
    font-size: 15px;
    color: #303133;
  }

  .todo-list {
    .todo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 8px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      border-radius: 6px;
      transition: background-color 0.2s;

      &:last-child { border-bottom: none; }
      &:hover { background-color: #f5f7fa; }

      .todo-info {
        display: flex;
        align-items: center;
        gap: 10px;

        .todo-text {
          font-size: 14px;
          color: #606266;
        }
      }

      .todo-right {
        display: flex;
        align-items: center;
      }
    }
  }

  .overview-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 8px 0;

    .overview-item {
      .ov-label {
        display: block;
        font-size: 13px;
        color: #909399;
        margin-bottom: 8px;
      }
    }
  }

  .action-list {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px 36px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid #f0f0f0;

      &:hover {
        background-color: #f5f7fa;
        transform: translateY(-2px);
        border-color: #dcdfe6;
      }

      span {
        font-size: 13px;
        color: #606266;
      }
    }
  }
}

@media (max-width: 1200px) {
  .admin-dashboard .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
