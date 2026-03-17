<template>
  <div class="hr-dashboard">
    <!-- 数据概览卡片 -->
    <div class="stat-cards">
      <el-card class="stat-card">
        <div class="stat-icon" style="background: #e6f7ff; color: #1890ff;">
          <el-icon size="32"><DocumentCopy /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.newResumes }}</div>
          <div class="stat-label">新增简历</div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-icon" style="background: #f6ffed; color: #52c41a;">
          <el-icon size="32"><Collection /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.activeJobs }}</div>
          <div class="stat-label">在招职位</div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-icon" style="background: #fff7e6; color: #fa8c16;">
          <el-icon size="32"><View /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.jobViews }}</div>
          <div class="stat-label">职位浏览</div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-icon" style="background: #f0f5ff; color: #2f54eb;">
          <el-icon size="32"><ChatDotRound /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.interviews }}</div>
          <div class="stat-label">待面试</div>
        </div>
      </el-card>
    </div>

    <!-- 快捷操作 -->
    <el-card class="quick-actions">
      <template #header>
        <div class="card-header">
          <span>快捷操作</span>
        </div>
      </template>
      <div class="action-list">
        <div class="action-item" @click="$router.push('/job/manage')">
          <el-icon size="28" color="#409EFF"><Plus /></el-icon>
          <span>发布职位</span>
        </div>
        <div class="action-item" @click="$router.push('/resumes')">
          <el-icon size="28" color="#67C23A"><Search /></el-icon>
          <span>搜索简历</span>
        </div>
        <div class="action-item" @click="$router.push('/company/manage')">
          <el-icon size="28" color="#E6A23C"><Edit /></el-icon>
          <span>编辑企业</span>
        </div>
        <div class="action-item" @click="$router.push('/hr/profile')">
          <el-icon size="28" color="#909399"><Setting /></el-icon>
          <span>账号设置</span>
        </div>
      </div>
    </el-card>

    <!-- 待处理简历 -->
    <el-card class="pending-list">
      <template #header>
        <div class="card-header">
          <span>待处理简历</span>
          <el-link type="primary" @click="$router.push('/resumes')">查看全部</el-link>
        </div>
      </template>
      <el-table :data="pendingResumes" stripe style="width: 100%">
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="position" label="应聘职位" />
        <el-table-column prop="experience" label="工作经验" width="120" />
        <el-table-column prop="education" label="学历" width="100" />
        <el-table-column prop="applyTime" label="投递时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewResume(row)">查看</el-button>
            <el-button type="success" link size="small" @click="handleResume(row, 'interview')">约面试</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="pendingResumes.length === 0" class="empty-state">
        <el-empty description="暂无待处理简历" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { DocumentCopy, Collection, View, ChatDotRound, Plus, Search, Edit, Setting } from '@element-plus/icons-vue'

const router = useRouter()

const stats = ref({
  newResumes: 12,
  activeJobs: 8,
  jobViews: 1256,
  interviews: 3
})

const pendingResumes = ref([
  {
    id: 1,
    name: '张三',
    position: '高级导游',
    experience: '3年',
    education: '本科',
    applyTime: '2024-03-15 10:30'
  },
  {
    id: 2,
    name: '李四',
    position: '旅游顾问',
    experience: '2年',
    education: '大专',
    applyTime: '2024-03-15 09:15'
  },
  {
    id: 3,
    name: '王五',
    position: '行程规划师',
    experience: '5年',
    education: '本科',
    applyTime: '2024-03-14 16:45'
  }
])

const viewResume = (row: any) => {
  router.push(`/resumes?id=${row.id}`)
}

const handleResume = (row: any, action: string) => {
  if (action === 'interview') {
    ElMessage.success(`已向 ${row.name} 发送面试邀请`)
  }
}
</script>

<style scoped lang="scss">
.hr-dashboard {
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

  .quick-actions {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .action-list {
      display: flex;
      gap: 40px;

      .action-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 20px 40px;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background-color: #f5f7fa;
          transform: translateY(-2px);
        }

        span {
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }

  .pending-list {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .empty-state {
      padding: 40px;
    }
  }
}

@media (max-width: 1200px) {
  .hr-dashboard {
    .stat-cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
