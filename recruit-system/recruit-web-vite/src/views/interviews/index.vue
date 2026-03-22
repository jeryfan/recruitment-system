<template>
  <div class="interviews-page">
    <div class="page-header">
      <h2>我的面试</h2>
      <p class="subtitle">查看HR发来的面试邀请和面试结果</p>
    </div>

    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="全部面试" name="all" />
      <el-tab-pane label="待面试" name="0" />
      <el-tab-pane label="已通过" name="1" />
      <el-tab-pane label="未通过" name="2" />
    </el-tabs>

    <div v-loading="loading" class="interview-list">
      <template v-if="interviewList.length > 0">
        <el-card
          v-for="item in interviewList"
          :key="item.id"
          class="interview-card"
          shadow="hover"
        >
          <div class="card-header">
            <div class="job-info">
              <span class="job-title">{{ item.title }}</span>
              <el-tag :type="getStatusType(item.status)" size="small">
                {{ getStatusText(item.status) }}
              </el-tag>
            </div>
            <span class="company-name">{{ item.name }}</span>
          </div>

          <div class="card-body">
            <div v-if="item.status > 0" class="interview-details">
              <div class="detail-item" v-if="item.time">
                <el-icon><Clock /></el-icon>
                <span>面试时间：{{ formatTime(item.time) }}</span>
              </div>
              <div class="detail-item" v-if="item.address">
                <el-icon><Location /></el-icon>
                <span>面试地点：{{ item.address }}</span>
              </div>
              <div class="detail-item" v-if="item.city">
                <el-icon><OfficeBuilding /></el-icon>
                <span>工作城市：{{ item.city }}</span>
              </div>
              <div class="detail-item" v-if="item.memo">
                <el-icon><ChatDotRound /></el-icon>
                <span>备注：{{ item.memo }}</span>
              </div>
            </div>
            <div v-else class="pending-hint">
              <el-icon><InfoFilled /></el-icon>
              <span>HR尚未安排面试时间，请耐心等待</span>
            </div>

            <div v-if="item.comments" class="comments-section">
              <div class="comments-label">面试评语：</div>
              <div class="comments-text">{{ item.comments }}</div>
            </div>
          </div>

          <div class="card-footer">
            <span class="apply-time">投递时间：{{ formatTime(item.create_time) }}</span>
            <el-button
              v-if="item.status === 1"
              type="primary"
              size="small"
              plain
              @click="viewJobDetail(item.position_id)"
            >
              查看职位
            </el-button>
          </div>
        </el-card>
      </template>

      <el-empty v-else description="暂无面试记录" />
    </div>

    <div class="pagination-wrapper" v-if="total > 0">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="fetchInterviews"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Clock, Location, OfficeBuilding, ChatDotRound, InfoFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'
import moment from 'moment'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const interviewList = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const activeTab = ref('all')

const fetchInterviews = async () => {
  const userId = userStore.userInfo?.id
  if (!userId) return

  loading.value = true
  try {
    const pageParam = page.value - 1
    const res = await request.get<any>(`/recruit/interview/page/find/${userId}`, {
      params: { page: pageParam, count: pageSize.value, state: 0 }
    })
    let items = res.items || []
    // 前端过滤tab
    if (activeTab.value !== 'all') {
      items = items.filter((item: any) => String(item.status) === activeTab.value)
    }
    interviewList.value = items
    total.value = res.total || 0
  } catch (error) {
    ElMessage.error('获取面试记录失败')
  } finally {
    loading.value = false
  }
}

const handleTabChange = () => {
  page.value = 1
  fetchInterviews()
}

const getStatusType = (status: number) => {
  const map: Record<number, string> = { 0: 'info', 1: 'success', 2: 'danger' }
  return map[status] || 'info'
}

const getStatusText = (status: number) => {
  const map: Record<number, string> = { 0: '待面试', 1: '已通过', 2: '未通过' }
  return map[status] || '未知'
}

const formatTime = (time: string) => {
  if (!time) return '暂未安排'
  return moment(time).format('YYYY-MM-DD HH:mm')
}

const viewJobDetail = (positionId: number) => {
  router.push(`/jobs/${positionId}`)
}

onMounted(fetchInterviews)
</script>

<style scoped lang="scss">
.interviews-page {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;

  h2 {
    font-size: 22px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 8px;
  }

  .subtitle {
    color: #909399;
    font-size: 14px;
    margin: 0;
  }
}

:deep(.el-tabs__header) {
  margin-bottom: 20px;
}

.interview-list {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.interview-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;

    .job-info {
      display: flex;
      align-items: center;
      gap: 10px;

      .job-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }

    .company-name {
      color: #606266;
      font-size: 14px;
    }
  }

  .card-body {
    padding: 12px 0;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 12px;

    .interview-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      .detail-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #606266;
        font-size: 14px;

        .el-icon {
          color: #409EFF;
          font-size: 16px;
          flex-shrink: 0;
        }
      }
    }

    .pending-hint {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #909399;
      font-size: 14px;
      padding: 8px 0;

      .el-icon {
        color: #E6A23C;
        font-size: 16px;
      }
    }

    .comments-section {
      margin-top: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 6px;

      .comments-label {
        font-size: 13px;
        color: #909399;
        margin-bottom: 6px;
      }

      .comments-text {
        font-size: 14px;
        color: #303133;
        line-height: 1.6;
      }
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .apply-time {
      font-size: 13px;
      color: #c0c4cc;
    }
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>
