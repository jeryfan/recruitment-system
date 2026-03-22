<template>
  <div class="hr-dashboard">
    <!-- 数据概览卡片 -->
    <div class="stat-cards" v-loading="loading">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon" style="background: #e6f7ff; color: #1890ff;">
          <el-icon size="32"><DocumentCopy /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.pendingResumes }}</div>
          <div class="stat-label">待处理简历</div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon" style="background: #f6ffed; color: #52c41a;">
          <el-icon size="32"><Collection /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.activeJobs }}</div>
          <div class="stat-label">在招职位</div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon" style="background: #fff7e6; color: #fa8c16;">
          <el-icon size="32"><ChatDotRound /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.pendingInterviews }}</div>
          <div class="stat-label">待面试</div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon" style="background: #f6ffed; color: #67c23a;">
          <el-icon size="32"><SuccessFilled /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.passedInterviews }}</div>
          <div class="stat-label">面试通过</div>
        </div>
      </el-card>
    </div>

    <!-- 快捷操作 -->
    <el-card class="quick-actions" shadow="hover" style="margin-top: 20px;">
      <template #header>
        <div class="card-header"><span>快捷操作</span></div>
      </template>
      <div class="action-list">
        <div class="action-item" @click="$router.push('/job/manage')">
          <el-icon size="28" color="#409EFF"><Plus /></el-icon>
          <span>发布职位</span>
        </div>
        <div class="action-item" @click="$router.push('/resumes')">
          <el-icon size="28" color="#67C23A"><Search /></el-icon>
          <span>简历管理</span>
        </div>
        <div class="action-item" @click="$router.push('/company/manage')">
          <el-icon size="28" color="#E6A23C"><Edit /></el-icon>
          <span>企业信息</span>
        </div>
        <div class="action-item" @click="$router.push('/hr/profile')">
          <el-icon size="28" color="#909399"><Setting /></el-icon>
          <span>账号设置</span>
        </div>
      </div>
    </el-card>

    <!-- 待处理简历列表 -->
    <el-card class="pending-list" shadow="hover" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>最新投递简历</span>
          <el-link type="primary" :underline="false" @click="$router.push('/resumes')">查看全部</el-link>
        </div>
      </template>

      <el-table
        :data="pendingResumes"
        v-loading="resumeLoading"
        stripe
        style="width: 100%"
        empty-text="暂无待处理简历"
      >
        <el-table-column label="求职者" width="120">
          <template #default="{ row }">
            <span>{{ row.name || row.nickname || '未知' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="应聘职位" prop="title" />
        <el-table-column label="应聘公司" prop="company_name" width="140" />
        <el-table-column label="投递时间" width="160">
          <template #default="{ row }">
            {{ formatTime(row.apply_time) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStateType(row.state)" size="small">
              {{ getStateText(row.state) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push('/resumes')">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy, Collection, ChatDotRound, SuccessFilled, Plus, Search, Edit, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'
import moment from 'moment'

const userStore = useUserStore()

const loading = ref(false)
const resumeLoading = ref(false)

const stats = ref({
  pendingResumes: 0,
  activeJobs: 0,
  pendingInterviews: 0,
  passedInterviews: 0
})

const pendingResumes = ref<any[]>([])

const fetchStats = async () => {
  const userId = userStore.userInfo?.id
  if (!userId) return

  loading.value = true
  try {
    // 并发请求：待处理简历、在招职位、面试数据
    const [resumeRes, jobRes, interviewRes] = await Promise.allSettled([
      request.get<any>(`/recruit/application/page/${userId}`, {
        params: { page: 0, count: 30, state: 0 }
      }),
      request.get<any>(`/recruit/position/page/hr/${userId}`, {
        params: { page: 0, count: 30 }
      }),
      request.get<any>(`/recruit/interview/page/${userId}`, {
        params: { page: 0, count: 30, state: 0 }
      })
    ])

    if (resumeRes.status === 'fulfilled') {
      const res = resumeRes.value as any
      stats.value.pendingResumes = res.total || 0
    }
    if (jobRes.status === 'fulfilled') {
      const res = jobRes.value as any
      stats.value.activeJobs = (res.items || []).filter((j: any) => j.state === 1).length
    }
    if (interviewRes.status === 'fulfilled') {
      const res = interviewRes.value as any
      const interviews = res.items || []
      stats.value.pendingInterviews = interviews.filter((i: any) => i.status === 0).length
      stats.value.passedInterviews = interviews.filter((i: any) => i.status === 1).length
    }
  } catch {
    // ignore partial failures
  } finally {
    loading.value = false
  }
}

const fetchPendingResumes = async () => {
  const userId = userStore.userInfo?.id
  if (!userId) return

  resumeLoading.value = true
  try {
    const res = await request.get<any>(`/recruit/application/page/${userId}`, {
      params: { page: 0, count: 5, state: 0 }
    })
    pendingResumes.value = res.items || []
  } catch {
    // ignore
  } finally {
    resumeLoading.value = false
  }
}

const getStateType = (state: number) => {
  const map: Record<number, string> = { 0: 'warning', 1: 'success', 2: 'danger' }
  return map[state] || 'info'
}

const getStateText = (state: number) => {
  const map: Record<number, string> = { 0: '待处理', 1: '感兴趣', 2: '不合适' }
  return map[state] || '未知'
}

const formatTime = (time: string) => {
  if (!time) return '-'
  return moment(time).format('MM-DD HH:mm')
}

onMounted(() => {
  fetchStats()
  fetchPendingResumes()
})
</script>

<style scoped lang="scss">
.hr-dashboard {
  .stat-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

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
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 15px;
    color: #303133;
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
      border: 1px solid #f0f0f0;
      transition: all 0.2s;

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
  .hr-dashboard .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
