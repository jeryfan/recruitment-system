<template>
  <div class="favorites-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>我的收藏</span>
        </div>
      </template>

      <el-empty v-if="!favoriteList.length && !loading" description="暂无收藏职位" />

      <div v-else v-loading="loading">
        <div class="job-cards">
          <div v-for="job in favoriteList" :key="job.id" class="job-card" @click="viewJobDetail(job.id)">
            <div class="job-header">
              <h4>{{ job.title }}</h4>
              <span class="salary">{{ job.salaryMin }}-{{ job.salaryMax }}K</span>
            </div>
            <div class="job-info">
              <el-tag size="small">{{ job.city }}</el-tag>
              <el-tag size="small" type="info">{{ job.experience }}</el-tag>
              <el-tag size="small" type="info">{{ job.education }}</el-tag>
            </div>
            <div class="company">
              <el-avatar :size="32" :src="job.companyLogo">
                <el-icon><OfficeBuilding /></el-icon>
              </el-avatar>
              <span class="name">{{ job.companyName }}</span>
            </div>
            <div class="job-footer">
              <span class="time">{{ formatTime(job.createTime) }}</span>
              <div class="actions">
                <el-button type="primary" size="small" @click.stop="handleApply(job.id)">投递简历</el-button>
                <el-button type="danger" size="small" link @click.stop="handleCancelFavorite(job.id)">取消收藏</el-button>
              </div>
            </div>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { OfficeBuilding } from '@element-plus/icons-vue'
import { getFavoriteList, cancelFavorite, applyJob } from '@/api/job'
import { getMyResume } from '@/api/resume'
import moment from 'moment'

const router = useRouter()
const loading = ref(false)
const favoriteList = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const formatTime = (time?: string) => {
  return time ? moment(time).fromNow() : ''
}

const fetchFavorites = async () => {
  loading.value = true
  try {
    const res = await getFavoriteList({
      page: page.value,
      size: pageSize.value
    })
    favoriteList.value = res.list
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取收藏列表失败')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchFavorites()
}

const handlePageChange = (val: number) => {
  page.value = val
  fetchFavorites()
}

const viewJobDetail = (id: number) => {
  router.push(`/jobs/${id}`)
}

const handleApply = async (positionId: number) => {
  try {
    const resume = await getMyResume()
    if (!resume?.id) {
      ElMessage.warning('请先完善简历')
      router.push('/resume')
      return
    }
    await applyJob(positionId, resume.id)
    ElMessage.success('投递成功')
  } catch (error) {
    ElMessage.error('投递失败')
  }
}

const handleCancelFavorite = async (positionId: number) => {
  try {
    await ElMessageBox.confirm('确定取消收藏该职位吗？', '提示', { type: 'warning' })
    await cancelFavorite(positionId)
    ElMessage.success('已取消收藏')
    fetchFavorites()
  } catch {
    // 取消操作
  }
}

onMounted(fetchFavorites)
</script>

<style scoped lang="scss">
.favorites-page {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  font-weight: 600;
}

.job-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.job-card {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.3s;
  border: 1px solid #ebeef5;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    h4 {
      margin: 0;
      font-size: 15px;
      color: #303133;
    }

    .salary {
      color: #f56c6c;
      font-weight: 600;
      font-size: 14px;
    }
  }

  .job-info {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .company {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    margin-bottom: 12px;

    .name {
      color: #606266;
      font-size: 13px;
    }
  }

  .job-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .time {
      color: #909399;
      font-size: 12px;
    }

    .actions {
      display: flex;
      gap: 8px;
    }
  }
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
</style>
