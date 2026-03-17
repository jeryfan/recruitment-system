<template>
  <div class="admin-dashboard">
    <!-- 数据概览卡片 -->
    <div class="stat-cards">
      <el-card class="stat-card">
        <div class="stat-icon" style="background: #e6f7ff; color: #1890ff;">
          <el-icon size="32"><User /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalUsers }}</div>
          <div class="stat-label">总用户数</div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-icon" style="background: #f6ffed; color: #52c41a;">
          <el-icon size="32"><OfficeBuilding /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalCompanies }}</div>
          <div class="stat-label">入驻企业</div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-icon" style="background: #fff7e6; color: #fa8c16;">
          <el-icon size="32"><Collection /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalJobs }}</div>
          <div class="stat-label">发布职位</div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-icon" style="background: #f0f5ff; color: #2f54eb;">
          <el-icon size="32"><DocumentCopy /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalResumes }}</div>
          <div class="stat-label">简历投递</div>
        </div>
      </el-card>
    </div>

    <!-- 待办事项 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="todo-card">
          <template #header>
            <div class="card-header">
              <span>待办事项</span>
            </div>
          </template>
          <div class="todo-list">
            <div class="todo-item" @click="$router.push('/admin/companies')">
              <div class="todo-info">
                <el-badge :value="stats.pendingCompanies" class="item">
                  <el-icon size="24" color="#f56c6c"><Warning /></el-icon>
                </el-badge>
                <span class="todo-text">待审核企业</span>
              </div>
              <el-button type="primary" link>去处理</el-button>
            </div>
            <div class="todo-item" @click="$router.push('/admin/users')">
              <div class="todo-info">
                <el-badge :value="stats.newUsers" class="item">
                  <el-icon size="24" color="#e6a23c"><User /></el-icon>
                </el-badge>
                <span class="todo-text">今日新增用户</span>
              </div>
              <el-button type="primary" link>查看</el-button>
            </div>
            <div class="todo-item">
              <div class="todo-info">
                <el-icon size="24" color="#409eff"><ChatDotRound /></el-icon>
                <span class="todo-text">用户反馈</span>
              </div>
              <el-button type="primary" link>查看</el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>数据统计</span>
            </div>
          </template>
          <div class="chart-placeholder">
            <el-empty description="数据图表区域" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, OfficeBuilding, Collection, DocumentCopy, Warning, ChatDotRound } from '@element-plus/icons-vue'

const stats = ref({
  totalUsers: 12580,
  totalCompanies: 486,
  totalJobs: 3256,
  totalResumes: 8932,
  pendingCompanies: 5,
  newUsers: 23
})
</script>

<style scoped lang="scss">
.admin-dashboard {
  .stat-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 20px;

    .stat-card {
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
      }

      .stat-info {
        .stat-value {
          font-size: 28px;
          font-weight: 600;
          color: #1a1a2e;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
        }
      }
    }
  }

  .todo-card,
  .chart-card {
    .card-header {
      font-weight: 600;
    }
  }

  .todo-list {
    .todo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #ebeef5;
      cursor: pointer;
      transition: background-color 0.3s;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: #f5f7fa;
      }

      .todo-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .todo-text {
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }

  .chart-placeholder {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
