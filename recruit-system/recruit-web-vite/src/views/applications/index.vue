<template>
  <div class="applications-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h1>投递记录</h1>
        <p>共 <strong>{{ total }}</strong> 条投递记录</p>
      </div>
      <div class="header-stats">
        <div class="hstat" v-for="s in headerStats" :key="s.label">
          <div class="hstat-num" :style="{ color: s.color }">{{ s.value }}</div>
          <div class="hstat-label">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <!-- 状态筛选 -->
    <div class="filter-bar">
      <el-radio-group v-model="filterState" @change="handleFilterChange" size="small">
        <el-radio-button :label="-1">全部</el-radio-button>
        <el-radio-button :label="0">待查看</el-radio-button>
        <el-radio-button :label="1">已查看</el-radio-button>
        <el-radio-button :label="2">感兴趣</el-radio-button>
        <el-radio-button :label="3">不合适</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 列表 -->
    <div v-loading="loading" class="list-area">
      <el-empty v-if="!applicationList.length && !loading" description="暂无投递记录">
        <el-button type="primary" @click="$router.push('/jobs')">去找工作</el-button>
      </el-empty>

      <div v-else class="application-list">
        <div
          v-for="item in applicationList"
          :key="item.id"
          class="application-card"
          @click="viewJobDetail(item.positionId)"
        >
          <!-- 左侧状态条 -->
          <div class="status-bar" :class="'status-' + item.state"></div>

          <!-- 主体内容 -->
          <div class="card-body">
            <div class="job-section">
              <div class="job-title-row">
                <h4>{{ item.positionTitle || '职位已下线' }}</h4>
                <el-tag :type="getStatusType(item.state)" size="small" effect="light">
                  {{ getStatusText(item.state) }}
                </el-tag>
              </div>
              <div class="job-meta">
                <span class="meta-item company">
                  <el-icon><OfficeBuilding /></el-icon>
                  {{ item.companyName || '未知企业' }}
                </span>
                <span v-if="item.city" class="meta-item">
                  <el-icon><Location /></el-icon>
                  {{ item.city }}
                </span>
                <span v-if="item.salaryMin" class="meta-item salary">
                  {{ item.salaryMin }}-{{ item.salaryMax }}K/月
                </span>
              </div>
            </div>

            <div class="time-section">
              <div class="apply-time">
                <el-icon><Clock /></el-icon>
                {{ formatTime(item.createTime) }}
              </div>
              <el-button type="primary" link size="small" @click.stop="viewJobDetail(item.positionId)">
                查看职位 <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="total > pageSize">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { OfficeBuilding, Location, Clock, ArrowRight } from '@element-plus/icons-vue'
import { getApplicationList } from '@/api/resume'
import moment from 'moment'

const router = useRouter()
const loading = ref(false)
const applicationList = ref<any[]>([])
const allApplications = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const filterState = ref(-1)

const statusMap: Record<number, { text: string; type: 'info' | 'success' | 'warning' | 'danger' }> = {
  0: { text: '待查看', type: 'info' },
  1: { text: '已查看', type: 'warning' },
  2: { text: '感兴趣', type: 'success' },
  3: { text: '不合适', type: 'danger' }
}

const getStatusText = (state: number) => statusMap[state]?.text || '未知状态'
const getStatusType = (state: number) => statusMap[state]?.type || 'info'

const headerStats = computed(() => [
  { label: '待查看', value: allApplications.value.filter(a => a.state === 0).length, color: '#909399' },
  { label: '已查看', value: allApplications.value.filter(a => a.state === 1).length, color: '#E6A23C' },
  { label: '感兴趣', value: allApplications.value.filter(a => a.state === 2).length, color: '#67C23A' },
  { label: '不合适', value: allApplications.value.filter(a => a.state === 3).length, color: '#F56C6C' },
])

const formatTime = (time?: string) => {
  return time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
}

const fetchApplications = async () => {
  loading.value = true
  try {
    const res = await getApplicationList({
      page: page.value,
      size: pageSize.value
    })
    applicationList.value = res.list
    total.value = res.total
    // Fetch all for stats (only on first load)
    if (allApplications.value.length === 0) {
      const allRes = await getApplicationList({ page: 1, size: 100 })
      allApplications.value = allRes.list
    }
  } catch {
    ElMessage.error('获取投递记录失败')
  } finally {
    loading.value = false
  }
}

const handleFilterChange = () => {
  page.value = 1
  fetchApplications()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchApplications()
}

const handlePageChange = (val: number) => {
  page.value = val
  fetchApplications()
}

const viewJobDetail = (positionId: number) => {
  if (positionId) router.push(`/jobs/${positionId}`)
}

onMounted(fetchApplications)
</script>

<style scoped lang="scss">
.applications-page {
  max-width: 860px;
  margin: 0 auto;

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, #1a1a4e 0%, #0f3460 100%);
    border-radius: 16px;
    padding: 28px 36px;
    margin-bottom: 20px;

    h1 {
      font-size: 26px;
      font-weight: 700;
      color: #fff;
      margin: 0 0 6px;
    }

    p {
      font-size: 14px;
      color: rgba(255,255,255,0.6);
      margin: 0;

      strong { color: #409EFF; }
    }

    .header-stats {
      display: flex;
      gap: 28px;

      .hstat {
        text-align: center;

        .hstat-num {
          font-size: 22px;
          font-weight: 700;
          line-height: 1.2;
        }

        .hstat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.55);
          margin-top: 3px;
        }
      }
    }
  }

  .filter-bar {
    margin-bottom: 20px;

    :deep(.el-radio-button__inner) {
      font-size: 13px;
    }
  }

  .list-area {
    .application-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .application-card {
      display: flex;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      border: 1px solid #f0f0f0;
      transition: all 0.22s;

      &:hover {
        border-color: #b3d8ff;
        box-shadow: 0 4px 20px rgba(64,158,255,0.1);
        transform: translateX(3px);
      }

      .status-bar {
        width: 4px;
        flex-shrink: 0;

        &.status-0 { background: #c0c4cc; }
        &.status-1 { background: #E6A23C; }
        &.status-2 { background: #67C23A; }
        &.status-3 { background: #F56C6C; }
      }

      .card-body {
        flex: 1;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 20px;

        .job-section {
          flex: 1;
          min-width: 0;

          .job-title-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;

            h4 {
              margin: 0;
              font-size: 15px;
              font-weight: 600;
              color: #1a1a2e;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .job-meta {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;

            .meta-item {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 13px;
              color: #909399;

              &.company { color: #606266; font-weight: 500; }
              &.salary { color: #f56c6c; font-weight: 600; }

              .el-icon { font-size: 13px; }
            }
          }
        }

        .time-section {
          text-align: right;
          flex-shrink: 0;

          .apply-time {
            font-size: 12px;
            color: #c0c4cc;
            display: flex;
            align-items: center;
            gap: 4px;
            justify-content: flex-end;
            margin-bottom: 8px;
          }
        }
      }
    }
  }

  .pagination {
    margin-top: 28px;
    display: flex;
    justify-content: center;
  }
}
</style>
