<template>
  <div class="resume-manage-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>收到的简历</span>
        </div>
      </template>

      <div class="filter-bar">
        <el-select v-model="filterState" placeholder="筛选状态" clearable @change="handleFilter">
          <el-option label="全部" value="" />
          <el-option label="待查看" :value="0" />
          <el-option label="已查看" :value="1" />
          <el-option label="感兴趣" :value="2" />
          <el-option label="不合适" :value="3" />
        </el-select>
      </div>

      <el-empty v-if="!applicationList.length && !loading" description="暂无简历" />

      <div v-else v-loading="loading">
        <div v-for="item in applicationList" :key="item.id" class="application-item">
          <div class="applicant-info" @click="viewResume(item)">
            <el-avatar :size="50" :src="item.userAvatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="info">
              <h4>{{ item.resumeRealName }}</h4>
              <p>{{ item.resumeGender === 1 ? '男' : '女' }} · {{ item.resumeCity || '未知城市' }}</p>
            </div>
          </div>
          <div class="job-info">
            <p class="job-title">{{ item.positionTitle }}</p>
            <p class="apply-time">{{ formatTime(item.createTime) }}</p>
          </div>
          <div class="actions">
            <el-tag :type="getStatusType(item.state)" size="small">
              {{ getStatusText(item.state) }}
            </el-tag>
            <el-button type="primary" link @click="viewResume(item)">查看简历</el-button>
          </div>
        </div>

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

    <!-- 简历详情弹窗 -->
    <el-dialog v-model="detailVisible" title="简历详情" width="800px">
      <div v-if="selectedResume" class="resume-detail">
        <div class="detail-header">
          <h3>{{ selectedResume.resumeRealName }}</h3>
          <p>{{ selectedResume.resumeGender === 1 ? '男' : '女' }} · {{ selectedResume.resumeCity }}</p>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="手机号">{{ selectedResume.resumePhone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ selectedResume.resumeEmail }}</el-descriptions-item>
          <el-descriptions-item label="求职意向">{{ selectedResume.resumeJobIntention || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="投递职位">{{ selectedResume.positionTitle }}</el-descriptions-item>
        </el-descriptions>
        <div class="detail-section" v-if="selectedResume.resumeSelfEvaluation">
          <h4>自我评价</h4>
          <p>{{ selectedResume.resumeSelfEvaluation }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="danger" @click="updateState(3)">标记不合适</el-button>
        <el-button type="success" @click="updateState(2)">标记感兴趣</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import request from '@/utils/request'
import moment from 'moment'

const loading = ref(false)
const applicationList = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const filterState = ref('')
const detailVisible = ref(false)
const selectedResume = ref<any>(null)

const statusMap: Record<number, { text: string; type: 'info' | 'success' | 'warning' | 'danger' }> = {
  0: { text: '待查看', type: 'info' },
  1: { text: '已查看', type: 'warning' },
  2: { text: '感兴趣', type: 'success' },
  3: { text: '不合适', type: 'danger' }
}

const getStatusText = (state: number) => statusMap[state]?.text || '未知'
const getStatusType = (state: number) => statusMap[state]?.type || 'info'
const formatTime = (time?: string) => time ? moment(time).format('YYYY-MM-DD HH:mm') : ''

const fetchApplications = async () => {
  loading.value = true
  try {
    const params: any = { page: page.value, size: pageSize.value }
    if (filterState.value !== '') {
      params.state = filterState.value
    }
    const res = await request.get('/recruit/application/company', { params })
    applicationList.value = res.list
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取简历列表失败')
  } finally {
    loading.value = false
  }
}

const handleFilter = () => {
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

const viewResume = async (item: any) => {
  selectedResume.value = item
  detailVisible.value = true
  if (item.state === 0) {
    try {
      await request.put(`/recruit/application/state/${item.id}`, { state: 1 })
      fetchApplications()
    } catch (error) {
      // ignore
    }
  }
}

const updateState = async (state: number) => {
  if (!selectedResume.value) return
  try {
    await request.put(`/recruit/application/state/${selectedResume.value.id}`, { state })
    ElMessage.success('操作成功')
    detailVisible.value = false
    fetchApplications()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

onMounted(fetchApplications)
</script>

<style scoped lang="scss">
.resume-manage-page {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  font-weight: 600;
}

.filter-bar {
  margin-bottom: 16px;
}

.application-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  transition: background-color 0.3s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f7fa;
  }

  .applicant-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    cursor: pointer;

    .info {
      h4 {
        margin: 0 0 4px 0;
        color: #303133;
      }
      p {
        margin: 0;
        color: #909399;
        font-size: 13px;
      }
    }
  }

  .job-info {
    width: 200px;
    text-align: center;

    .job-title {
      margin: 0 0 4px 0;
      color: #606266;
    }
    .apply-time {
      margin: 0;
      color: #909399;
      font-size: 13px;
    }
  }

  .actions {
    width: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.resume-detail {
  .detail-header {
    text-align: center;
    margin-bottom: 24px;

    h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
    }
    p {
      margin: 0;
      color: #909399;
    }
  }

  .detail-section {
    margin-top: 24px;

    h4 {
      margin: 0 0 12px 0;
      color: #303133;
      border-left: 4px solid #409eff;
      padding-left: 8px;
    }
    p {
      margin: 0;
      color: #606266;
      line-height: 1.6;
    }
  }
}
</style>
