<template>
  <div class="jobs-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-text">
        <h1>发现机会</h1>
        <p>浏览旅游行业 <strong>{{ total > 0 ? total + '+' : '' }}</strong> 个优质职位，开启职业新篇章</p>
      </div>
      <div class="header-tags">
        <span v-for="tag in quickTags" :key="tag" class="quick-tag" @click="quickSearch(tag)">{{ tag }}</span>
      </div>
    </div>

    <!-- 搜索和筛选区 -->
    <div class="filter-section">
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索职位名称、公司名称"
          size="large"
          clearable
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" size="large" @click="handleSearch">
          搜索
        </el-button>
      </div>

      <div class="filter-bar">
        <el-select
          v-model="searchForm.city"
          placeholder="城市"
          clearable
          @change="handleSearch"
          class="filter-item"
        >
          <el-option label="全部城市" value="" />
          <el-option label="北京" value="北京" />
          <el-option label="上海" value="上海" />
          <el-option label="广州" value="广州" />
          <el-option label="深圳" value="深圳" />
          <el-option label="杭州" value="杭州" />
          <el-option label="成都" value="成都" />
          <el-option label="西安" value="西安" />
        </el-select>

        <el-select
          v-model="searchForm.categoryId"
          placeholder="职位分类"
          clearable
          @change="handleSearch"
          class="filter-item"
        >
          <el-option label="全部分类" value="" />
          <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
        </el-select>

        <el-select
          v-model="searchForm.sort"
          placeholder="排序方式"
          @change="handleSearch"
          class="filter-item"
        >
          <el-option label="最新发布" value="new" />
          <el-option label="薪资最高" value="salary" />
          <el-option label="浏览最多" value="hot" />
        </el-select>
      </div>
    </div>

    <!-- AI 智能推荐区 -->
    <div v-if="userStore.isLoggedIn && recommendList.length > 0" class="recommend-section">
      <div class="recommend-header">
        <div class="recommend-title">
          <el-icon color="#409eff" size="20"><MagicStick /></el-icon>
          <span>AI 为你推荐</span>
          <el-tag type="primary" size="small" effect="light">基于简历匹配</el-tag>
        </div>
        <span class="recommend-hint">根据您的简历技能与求职意向智能匹配</span>
      </div>
      <div class="recommend-grid">
        <el-card
          v-for="item in recommendList"
          :key="item.position.id"
          class="recommend-card"
          shadow="hover"
          @click="viewDetail(item.position.id)"
        >
          <div class="rec-score-bar">
            <span class="rec-score-label">匹配度</span>
            <el-progress
              :percentage="item.score"
              :stroke-width="8"
              :color="item.score >= 70 ? '#67c23a' : item.score >= 40 ? '#409eff' : '#e6a23c'"
              style="flex:1"
            />
            <span class="rec-score-num" :style="{color: item.score >= 70 ? '#67c23a' : item.score >= 40 ? '#409eff' : '#e6a23c'}">
              {{ item.score }}%
            </span>
          </div>
          <div class="rec-title">{{ item.position.title }}</div>
          <div class="rec-salary">
            {{ item.position.salary_down }}-{{ item.position.salary_up }}
            <span class="rec-salary-unit">元/月</span>
          </div>
          <div class="rec-tags">
            <el-tag size="small" effect="plain">{{ item.position.city || '不限' }}</el-tag>
            <el-tag size="small" effect="plain" type="info">{{ item.position.category_name }}</el-tag>
          </div>
          <div class="rec-company">
            <el-avatar :size="28" :src="item.position.logo">
              <el-icon><OfficeBuilding /></el-icon>
            </el-avatar>
            <span>{{ item.position.company_name }}</span>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 职位列表 -->
    <div class="job-list" v-loading="loading">
      <el-empty v-if="jobList.length === 0" description="暂无职位">
        <template #image>
          <el-icon :size="60" color="#dcdfe6"><Briefcase /></el-icon>
        </template>
        <el-button type="primary" @click="resetSearch">重置筛选</el-button>
      </el-empty>

      <div v-else class="job-grid">
        <el-card
          v-for="job in jobList"
          :key="job.id"
          class="job-card"
          shadow="hover"
          @click="viewDetail(job.id)"
        >
          <div class="job-main">
            <div class="job-header">
              <h3 class="job-title" :title="job.title">{{ job.title }}</h3>
              <div class="job-salary">
                <span class="salary-num">{{ job.salaryMin }}-{{ job.salaryMax }}K</span>
                <span class="salary-unit">/月</span>
              </div>
            </div>

            <div class="job-tags">
              <el-tag size="small" effect="light" class="location-tag">
                <el-icon><Location /></el-icon>
                {{ job.city || '不限' }}
              </el-tag>
              <el-tag v-if="job.experience" size="small" effect="light" type="info">
                {{ job.experience }}
              </el-tag>
              <el-tag v-if="job.education" size="small" effect="light" type="info">
                {{ job.education }}
              </el-tag>
            </div>
          </div>

          <div class="job-divider"></div>

          <div class="job-company">
            <el-avatar :size="40" :src="job.companyLogo" class="company-avatar">
              <el-icon><OfficeBuilding /></el-icon>
            </el-avatar>
            <div class="company-info">
              <span class="company-name">{{ job.companyName }}</span>
              <span class="job-time">
                <el-icon><View /></el-icon>
                {{ formatNumber(job.hits) }}
              </span>
            </div>
          </div>

          <div class="job-footer">
            <span class="publish-time">{{ formatTime(job.createTime) }}</span>
            <el-button
              type="primary"
              size="small"
              round
              @click.stop="applyJob(job)"
              :loading="applying === job.id"
            >
              立即投递
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper" v-if="total > 0">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[12, 24, 48]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search, Location, OfficeBuilding, View, Briefcase, MagicStick
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { Job } from '@/types'
import { getJobList, applyJob as applyJobApi, getJobDetail } from '@/api/job'
import { getMyResume } from '@/api/resume'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const applying = ref<number | null>(null)
const recommendList = ref<{ score: number; position: any }[]>([])
const jobList = ref<Job[]>([])
const page = ref(1)
const pageSize = ref(12)
const total = ref(0)

const searchForm = reactive({
  keyword: '',
  city: '',
  categoryId: '',
  sort: 'new'
})

const quickTags = ['导游', '酒店管理', '旅行顾问', '空乘', '景区', '计调']

const quickSearch = (tag: string) => {
  searchForm.keyword = tag
  page.value = 1
  fetchJobs()
}

const categories = ref([
  { id: 1, name: '导游服务' },
  { id: 2, name: '酒店管理' },
  { id: 3, name: '旅行顾问' },
  { id: 4, name: '航空服务' },
  { id: 5, name: '景区运营' },
  { id: 6, name: '计调操作' },
  { id: 7, name: '签证服务' },
])

const fetchJobs = async () => {
  loading.value = true
  try {
    const res = await getJobList({
      page: page.value,
      size: pageSize.value,
      keyword: searchForm.keyword,
      city: searchForm.city,
      categoryId: searchForm.categoryId
    })
    jobList.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  fetchJobs()
}

const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.city = ''
  searchForm.categoryId = ''
  searchForm.sort = 'new'
  page.value = 1
  fetchJobs()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchJobs()
}

const handlePageChange = (val: number) => {
  page.value = val
  fetchJobs()
}

const viewDetail = (id: number) => {
  router.push(`/jobs/${id}`)
}

const applyJob = async (job: Job) => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  applying.value = job.id
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
    // 获取职位详情以确保 hrId 和 companyId 的准确性
    const jobDetail = await getJobDetail(job.id)
    await applyJobApi(job.id, resume.id, jobDetail.hrId || 0, jobDetail.companyId || 0, userId)
    ElMessage.success('投递成功')
  } catch (error) {
    ElMessage.error('投递失败，请稍后重试')
  } finally {
    applying.value = null
  }
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 格式化时间
const formatTime = (time?: string) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return `${Math.floor(days / 30)}月前`
}

const fetchRecommendations = async () => {
  const userId = userStore.userInfo?.id
  if (!userId) return
  try {
    const data = await request.get<{ score: number; position: any }[]>(
      `/recruit/recommend/${userId}?topN=6`
    )
    if (Array.isArray(data)) {
      recommendList.value = data
    }
  } catch {
    // 静默失败，推荐功能不影响主流程
  }
}

onMounted(() => {
  fetchJobs()
  if (userStore.isLoggedIn) {
    fetchRecommendations()
  }
})
</script>

<style scoped lang="scss">
.jobs-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;

  .page-header {
    background: linear-gradient(135deg, #1a1a4e 0%, #0f3460 100%);
    border-radius: 16px;
    padding: 36px 48px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-text {
      h1 {
        font-size: 30px;
        font-weight: 700;
        color: #fff;
        margin: 0 0 10px 0;
      }

      p {
        font-size: 15px;
        color: rgba(255,255,255,0.65);
        margin: 0;

        strong { color: #409EFF; }
      }
    }

    .header-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;

      .quick-tag {
        padding: 5px 14px;
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 20px;
        font-size: 13px;
        color: rgba(255,255,255,0.85);
        cursor: pointer;
        transition: all 0.2s;
        backdrop-filter: blur(4px);

        &:hover {
          background: rgba(64,158,255,0.3);
          border-color: #409EFF;
          color: #fff;
        }
      }
    }
  }

  .filter-section {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    .search-bar {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;

      .search-input {
        flex: 1;

        :deep(.el-input__wrapper) {
          padding-left: 12px;
        }

        :deep(.el-input__inner) {
          height: 44px;
          font-size: 15px;
        }
      }

      .el-button {
        padding: 0 32px;
        font-size: 15px;
        font-weight: 500;
      }
    }

    .filter-bar {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;

      .filter-item {
        width: 160px;
      }
    }
  }

  .job-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .job-card {
    cursor: pointer;
    border-radius: 12px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
    }

    :deep(.el-card__body) {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .job-main {
      .job-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;

        .job-title {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          padding-right: 12px;
        }

        .job-salary {
          flex-shrink: 0;

          .salary-num {
            font-size: 18px;
            font-weight: 700;
            color: #f56c6c;
          }

          .salary-unit {
            font-size: 12px;
            color: #f56c6c;
            margin-left: 2px;
          }
        }
      }

      .job-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .location-tag {
          display: flex;
          align-items: center;
          gap: 2px;

          .el-icon {
            font-size: 12px;
          }
        }
      }
    }

    .job-divider {
      height: 1px;
      background: #ebeef5;
    }

    .job-company {
      display: flex;
      align-items: center;
      gap: 12px;

      .company-avatar {
        border: 1px solid #ebeef5;
      }

      .company-info {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .company-name {
          font-size: 14px;
          color: #606266;
          font-weight: 500;
        }

        .job-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #909399;

          .el-icon {
            font-size: 14px;
          }
        }
      }
    }

    .job-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #ebeef5;

      .publish-time {
        font-size: 12px;
        color: #909399;
      }

      .el-button {
        font-weight: 500;
      }
    }
  }

  .pagination-wrapper {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }
}

.recommend-section {
  margin-bottom: 28px;

  .recommend-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .recommend-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }

    .recommend-hint {
      font-size: 13px;
      color: #909399;
    }
  }

  .recommend-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }

  .recommend-card {
    cursor: pointer;
    border-radius: 10px;
    border: 1.5px solid #e8f4ff;
    transition: all 0.25s;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(64, 158, 255, 0.15) !important;
      border-color: #409eff;
    }

    :deep(.el-card__body) {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .rec-score-bar {
      display: flex;
      align-items: center;
      gap: 8px;

      .rec-score-label {
        font-size: 12px;
        color: #909399;
        white-space: nowrap;
      }

      .rec-score-num {
        font-size: 13px;
        font-weight: 700;
        white-space: nowrap;
      }
    }

    .rec-title {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .rec-salary {
      font-size: 16px;
      font-weight: 700;
      color: #f56c6c;

      .rec-salary-unit {
        font-size: 11px;
        font-weight: 400;
        margin-left: 2px;
      }
    }

    .rec-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .rec-company {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #606266;
      padding-top: 6px;
      border-top: 1px solid #f0f0f0;
    }
  }
}

@media (max-width: 768px) {
  .jobs-page {
    padding: 0 12px 32px;

    .page-header {
      h1 {
        font-size: 24px;
      }
    }

    .filter-section {
      padding: 16px;

      .search-bar {
        .search-input {
          :deep(.el-input__inner) {
            height: 40px;
          }
        }

        .el-button {
          padding: 0 16px;
        }
      }

      .filter-bar {
        .filter-item {
          width: calc(50% - 6px);
        }
      }
    }

    .job-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
