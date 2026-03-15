<template>
  <div class="applications-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>投递记录</span>
        </div>
      </template>

      <el-empty v-if="!applicationList.length && !loading" description="暂无投递记录" />

      <div v-else v-loading="loading">
        <div v-for="item in applicationList" :key="item.id" class="application-item">
          <div class="job-info" @click="viewJobDetail(item.positionId)">
            <h4>{{ item.positionTitle }}</h4>
            <p class="company">{{ item.companyName }}</p>
            <div class="tags">
              <el-tag size="small">{{ item.city }}</el-tag>
              <el-tag size="small" type="info">{{ item.salaryMin }}-{{ item.salaryMax }}K</el-tag>
            </div>
          </div>
          <div class="apply-info">
            <div class="status">
              <el-tag :type="getStatusType(item.state)">{{ getStatusText(item.state) }}</el-tag>
            </div>
            <div class="time">{{ formatTime(item.createTime) }}</div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="total > 0">
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
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getApplicationList } from '@/api/resume'
import moment from 'moment'

const router = useRouter()
const loading = ref(false)
const applicationList = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const statusMap: Record<number, { text: string; type: 'info' | 'success' | 'warning' | 'danger' }> = {
  0: { text: '待查看', type: 'info' },
  1: { text: '已查看', type: 'warning' },
  2: { text: '感兴趣', type: 'success' },
  3: { text: '不合适', type: 'danger' }
}

const getStatusText = (state: number) => {
  return statusMap[state]?.text || '未知状态'
}

const getStatusType = (state: number) => {
  return statusMap[state]?.type || 'info'
}

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
  } catch (error) {
    ElMessage.error('获取投递记录失败')
  } finally {
    loading.value = false
  }
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
  router.push(`/jobs/${positionId}`)
}

onMounted(fetchApplications)
</script>

<style scoped lang="scss">
.applications-page {
  max-width: 900px;
  margin: 0 auto;
}

.card-header {
  font-weight: 600;
}

.application-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
  transition: background-color 0.3s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f7fa;
  }

  .job-info {
    flex: 1;
    cursor: pointer;

    h4 {
      margin: 0 0 8px 0;
      color: #303133;
      font-size: 16px;
    }

    .company {
      color: #606266;
      margin: 0 0 8px 0;
    }

    .tags {
      display: flex;
      gap: 8px;
    }
  }

  .apply-info {
    text-align: right;

    .status {
      margin-bottom: 8px;
    }

    .time {
      color: #909399;
      font-size: 13px;
    }
  }
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
</style>
