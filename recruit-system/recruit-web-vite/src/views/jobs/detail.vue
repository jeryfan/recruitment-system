<template>
  <div class="job-detail-page">
    <div v-loading="loading">
      <template v-if="job">
        <!-- 职位头部信息 -->
        <el-card class="job-header-card">
          <div class="job-header">
            <div class="job-title-section">
              <h1>{{ job.title }}</h1>
              <p class="salary">{{ job.salaryMin }}-{{ job.salaryMax }}K</p>
              <div class="job-tags">
                <el-tag>{{ job.city }}</el-tag>
                <el-tag type="info">{{ job.experience }}</el-tag>
                <el-tag type="info">{{ job.education }}</el-tag>
              </div>
            </div>
            <div class="job-actions">
              <el-button type="primary" size="large" @click="handleApply">投递简历</el-button>
              <el-button :type="isFavorited ? 'danger' : 'default'" size="large" @click="toggleFavorite">
                {{ isFavorited ? '已收藏' : '收藏' }}
              </el-button>
            </div>
          </div>
        </el-card>

        <!-- 公司信息 -->
        <el-card class="company-card">
          <div class="company-info" @click="goToCompany">
            <el-avatar :size="60" :src="job.companyLogo">
              <el-icon size="30"><OfficeBuilding /></el-icon>
            </el-avatar>
            <div class="company-detail">
              <h3>{{ job.companyName }}</h3>
              <p>点击查看公司详情</p>
            </div>
            <el-icon class="arrow"><ArrowRight /></el-icon>
          </div>
        </el-card>

        <!-- 职位详情 -->
        <el-card class="job-detail-card">
          <template #header>
            <span>职位描述</span>
          </template>
          <div class="detail-content">{{ job.description }}</div>
        </el-card>

        <el-card class="job-detail-card">
          <template #header>
            <span>职位要求</span>
          </template>
          <div class="detail-content">{{ job.requirement }}</div>
        </el-card>

        <!-- 职位标签 -->
        <el-card v-if="job.tags && job.tags.length" class="job-detail-card">
          <template #header>
            <span>职位标签</span>
          </template>
          <div class="tags-content">
            <el-tag v-for="tag in job.tags" :key="tag" type="info" effect="plain">{{ tag }}</el-tag>
          </div>
        </el-card>
      </template>

      <el-empty v-else description="职位不存在或已下架" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { OfficeBuilding, ArrowRight } from '@element-plus/icons-vue'
import type { Job } from '@/types'
import { getJobDetail, applyJob, favoriteJob, cancelFavorite, getFavoriteList } from '@/api/job'
import { getMyResume } from '@/api/resume'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const job = ref<Job | null>(null)
const isFavorited = ref(false)

const fetchJobDetail = async () => {
  const id = Number(route.params.id)
  if (!id) return

  loading.value = true
  try {
    const data = await getJobDetail(id)
    job.value = data
    // 检查是否已收藏
    checkFavorite(id)
  } catch (error) {
    ElMessage.error('获取职位详情失败')
  } finally {
    loading.value = false
  }
}

const checkFavorite = async (jobId: number) => {
  if (!userStore.isLoggedIn) return
  try {
    const res = await getFavoriteList({ page: 1, size: 100 })
    isFavorited.value = res.list.some((item: any) => item.id === jobId)
  } catch (error) {
    // ignore
  }
}

const handleApply = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  try {
    const resume = await getMyResume()
    if (!resume?.id) {
      ElMessage.warning('请先完善简历')
      router.push('/resume')
      return
    }
    const userId = userStore.userInfo?.id
    if (!userId) {
      ElMessage.warning('请先登录')
      return
    }
    await applyJob(
      job.value!.id,
      resume.id,
      job.value!.hrId || 0,
      job.value!.companyId || 0,
      userId
    )
    ElMessage.success('投递成功')
  } catch (error) {
    ElMessage.error('投递失败')
  }
}

const toggleFavorite = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  try {
    if (isFavorited.value) {
      await cancelFavorite(job.value!.id)
      ElMessage.success('取消收藏')
    } else {
      await favoriteJob(job.value!.id)
      ElMessage.success('收藏成功')
    }
    isFavorited.value = !isFavorited.value
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const goToCompany = () => {
  ElMessage.info('企业详情功能开发中')
}

onMounted(fetchJobDetail)
</script>

<style scoped lang="scss">
.job-detail-page {
  max-width: 900px;
  margin: 0 auto;
}

.job-header-card {
  margin-bottom: 20px;

  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .job-title-section {
      h1 {
        margin: 0 0 12px 0;
        font-size: 24px;
        color: #303133;
      }

      .salary {
        color: #f56c6c;
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 12px 0;
      }

      .job-tags {
        display: flex;
        gap: 8px;
      }
    }

    .job-actions {
      display: flex;
      gap: 12px;
    }
  }
}

.company-card {
  margin-bottom: 20px;

  .company-info {
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f5f7fa;
    }

    .company-detail {
      flex: 1;

      h3 {
        margin: 0 0 4px 0;
        font-size: 16px;
        color: #303133;
      }

      p {
        margin: 0;
        color: #909399;
        font-size: 13px;
      }
    }

    .arrow {
      color: #909399;
    }
  }
}

.job-detail-card {
  margin-bottom: 20px;

  .detail-content {
    color: #606266;
    line-height: 1.8;
    white-space: pre-line;
  }

  .tags-content {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
