<template>
  <div class="jobs-page">
    <!-- 页面头部 + 搜索 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">发现你的理想职位</h1>
        <p class="hero-sub">旅游行业 <strong>{{ total > 0 ? total + '+' : '' }}</strong> 个优质机会正在等你</p>

        <!-- 主搜索框 -->
        <div class="hero-search">
          <div class="search-wrap">
            <el-icon class="search-icon"><Search /></el-icon>
            <input
              v-model="searchForm.keyword"
              class="search-input-inner"
              placeholder="搜索职位、公司名称..."
              @keyup.enter="handleSearch"
            />
            <el-select
              v-model="searchForm.city"
              placeholder="城市"
              clearable
              class="city-select"
              @change="handleSearch"
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
            <button class="search-btn" @click="handleSearch">搜索</button>
          </div>
        </div>

        <!-- 热门标签 -->
        <div class="hot-tags">
          <span class="hot-label">热门：</span>
          <span v-for="tag in quickTags" :key="tag" class="hot-tag" @click="quickSearch(tag)">{{ tag }}</span>
        </div>
      </div>
    </div>

    <!-- 筛选条 -->
    <div class="filter-strip">
      <div class="filter-left">
        <el-select
          v-model="searchForm.categoryId"
          placeholder="职位分类"
          clearable
          @change="handleSearch"
          size="default"
        >
          <el-option label="全部分类" value="" />
          <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
        </el-select>
        <el-select
          v-model="searchForm.sort"
          @change="handleSearch"
          size="default"
        >
          <el-option label="最新发布" value="new" />
          <el-option label="薪资最高" value="salary" />
          <el-option label="浏览最多" value="hot" />
        </el-select>
      </div>
      <div class="filter-right" v-if="total > 0">
        共 <strong>{{ total }}</strong> 个职位
      </div>
    </div>

    <!-- AI 智能推荐区 -->
    <div v-if="userStore.isLoggedIn && recommendList.length > 0" class="recommend-section">
      <div class="section-title">
        <el-icon color="#6366f1" size="18"><MagicStick /></el-icon>
        <span>AI 智能推荐</span>
        <el-tag type="primary" size="small" effect="light" style="margin-left:6px">基于简历匹配</el-tag>
        <span class="section-hint">根据您的简历技能智能匹配</span>
      </div>
      <div class="recommend-grid">
        <div
          v-for="item in recommendList"
          :key="item.position.id"
          class="rec-card"
          @click="viewDetail(item.position.id)"
        >
          <div class="rec-match">
            <span class="rec-score" :class="item.score >= 70 ? 'high' : item.score >= 40 ? 'mid' : 'low'">
              {{ item.score }}%
            </span>
            <span class="rec-match-label">匹配</span>
          </div>
          <div class="rec-body">
            <div class="rec-title">{{ item.position.title }}</div>
            <div class="rec-salary">{{ item.position.salary_down }}-{{ item.position.salary_up }}<span>元/月</span></div>
            <div class="rec-meta">
              <span>{{ item.position.city || '不限' }}</span>
              <span>·</span>
              <span>{{ item.position.category_name }}</span>
            </div>
          </div>
          <div class="rec-company">
            <el-avatar :size="24" :src="item.position.logo" shape="square"><el-icon><OfficeBuilding /></el-icon></el-avatar>
            <span>{{ item.position.company_name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 职位列表 -->
    <div class="job-list" v-loading="loading">
      <el-empty v-if="jobList.length === 0 && !loading" description="暂无匹配职位">
        <el-button type="primary" @click="resetSearch">重置筛选</el-button>
      </el-empty>

      <div v-else class="job-grid">
        <div
          v-for="job in jobList"
          :key="job.id"
          class="job-card"
          @click="viewDetail(job.id)"
        >
          <!-- 顶部：薪资 + 标题 -->
          <div class="jc-top">
            <div class="jc-title-wrap">
              <h3 class="jc-title">{{ job.title }}</h3>
              <div class="jc-salary">{{ job.salaryMin }}-{{ job.salaryMax }}K</div>
            </div>
            <div class="jc-tags">
              <span class="jc-tag loc">
                <el-icon size="11"><Location /></el-icon>{{ job.city || '不限' }}
              </span>
              <span v-if="job.experience" class="jc-tag">{{ job.experience }}</span>
              <span v-if="job.education" class="jc-tag">{{ job.education }}</span>
            </div>
          </div>

          <!-- 分隔 -->
          <div class="jc-divider"></div>

          <!-- 底部：公司 + 操作 -->
          <div class="jc-bottom">
            <div class="jc-company">
              <el-avatar :size="36" :src="job.companyLogo" shape="square" class="jc-logo">
                <el-icon size="16"><OfficeBuilding /></el-icon>
              </el-avatar>
              <div class="jc-company-info">
                <span class="jc-company-name">{{ job.companyName }}</span>
                <span class="jc-time">{{ formatTime(job.createTime) }}</span>
              </div>
            </div>
            <button
              class="jc-apply-btn"
              @click.stop="applyJob(job)"
              :disabled="applying === job.id"
            >
              <span v-if="applying === job.id">投递中...</span>
              <span v-else>立即投递</span>
            </button>
          </div>
        </div>
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
  Search, Location, OfficeBuilding, Briefcase, MagicStick
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

const quickTags = ['导游', '酒店管理', '旅行顾问', '空乘', '景区运营', '计调']

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
    if (!userId) { ElMessage.warning('请先登录'); return }
    const jobDetail = await getJobDetail(job.id)
    await applyJobApi(job.id, resume.id, jobDetail.hrId || 0, jobDetail.companyId || 0, userId)
    ElMessage.success('投递成功')
  } catch {
    ElMessage.error('投递失败，请稍后重试')
  } finally {
    applying.value = null
  }
}

const formatTime = (time?: string) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const days = Math.floor((now.getTime() - date.getTime()) / 86400000)
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
    if (Array.isArray(data)) recommendList.value = data
  } catch { /* 静默失败 */ }
}

onMounted(() => {
  fetchJobs()
  if (userStore.isLoggedIn) fetchRecommendations()
})
</script>

<style scoped lang="scss">
.jobs-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

/* ——— Hero 搜索区 ——— */
.hero-section {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a8a 100%);
  border-radius: 20px;
  padding: 52px 48px 44px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -40px; left: 30%;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%);
    border-radius: 50%;
  }

  .hero-content {
    position: relative;
    z-index: 1;
  }

  .hero-title {
    font-size: 34px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 10px;
    letter-spacing: -0.5px;
  }

  .hero-sub {
    font-size: 16px;
    color: rgba(255,255,255,0.65);
    margin: 0 0 28px;
    strong { color: #93c5fd; font-weight: 600; }
  }
}

/* 搜索框 */
.hero-search {
  margin-bottom: 18px;

  .search-wrap {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 12px;
    padding: 6px 6px 6px 16px;
    gap: 0;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    max-width: 720px;

    .search-icon {
      color: #9ca3af;
      font-size: 18px;
      flex-shrink: 0;
      margin-right: 8px;
    }

    .search-input-inner {
      flex: 1;
      border: none;
      outline: none;
      font-size: 15px;
      color: #111827;
      background: transparent;
      height: 42px;
      min-width: 0;

      &::placeholder { color: #9ca3af; }
    }

    .city-select {
      width: 120px;
      flex-shrink: 0;
      margin: 0 6px;

      :deep(.el-input__wrapper) {
        box-shadow: none !important;
        border-left: 1px solid #e5e7eb;
        border-radius: 0;
        padding-left: 12px;
      }
    }

    .search-btn {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0 28px;
      height: 42px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;

      &:hover {
        background: linear-gradient(135deg, #4f46e5, #4338ca);
        transform: translateY(-1px);
      }

      &:active { transform: translateY(0); }
    }
  }
}

/* 热门标签 */
.hot-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  .hot-label {
    font-size: 13px;
    color: rgba(255,255,255,0.45);
  }

  .hot-tag {
    padding: 4px 12px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 20px;
    font-size: 13px;
    color: rgba(255,255,255,0.8);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(99,102,241,0.35);
      border-color: rgba(99,102,241,0.6);
      color: #fff;
    }
  }
}

/* ——— 筛选条 ——— */
.filter-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 12px;
  padding: 12px 20px;
  margin-bottom: 24px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);

  .filter-left {
    display: flex;
    gap: 12px;

    .el-select { width: 140px; }
  }

  .filter-right {
    font-size: 14px;
    color: #6b7280;
    strong { color: #374151; font-weight: 600; }
  }
}

/* ——— AI 推荐 ——— */
.recommend-section {
  margin-bottom: 28px;

  .section-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 17px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 16px;

    .section-hint {
      margin-left: auto;
      font-size: 13px;
      color: #9ca3af;
      font-weight: 400;
    }
  }

  .recommend-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 14px;
  }

  .rec-card {
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 14px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.25s;
    display: flex;
    flex-direction: column;
    gap: 10px;

    &:hover {
      border-color: #6366f1;
      box-shadow: 0 6px 20px rgba(99,102,241,0.12);
      transform: translateY(-2px);
    }

    .rec-match {
      display: flex;
      align-items: baseline;
      gap: 4px;

      .rec-score {
        font-size: 22px;
        font-weight: 800;
        &.high { color: #10b981; }
        &.mid  { color: #6366f1; }
        &.low  { color: #f59e0b; }
      }

      .rec-match-label {
        font-size: 12px;
        color: #9ca3af;
      }
    }

    .rec-body {
      .rec-title {
        font-size: 15px;
        font-weight: 600;
        color: #111827;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 6px;
      }

      .rec-salary {
        font-size: 17px;
        font-weight: 700;
        color: #ef4444;
        margin-bottom: 6px;
        span { font-size: 11px; font-weight: 400; margin-left: 2px; }
      }

      .rec-meta {
        font-size: 12px;
        color: #6b7280;
        display: flex;
        gap: 4px;
      }
    }

    .rec-company {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #6b7280;
      padding-top: 8px;
      border-top: 1px solid #f3f4f6;
    }
  }
}

/* ——— 职位卡片 ——— */
.job-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.job-card {
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  gap: 0;

  &:hover {
    border-color: #6366f1;
    box-shadow: 0 8px 28px rgba(99,102,241,0.13);
    transform: translateY(-3px);

    .jc-title { color: #4f46e5; }
    .jc-apply-btn {
      background: linear-gradient(135deg, #4f46e5, #4338ca);
    }
  }

  .jc-top {
    margin-bottom: 16px;

    .jc-title-wrap {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .jc-title {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
      margin: 0;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-right: 12px;
      transition: color 0.2s;
    }

    .jc-salary {
      font-size: 18px;
      font-weight: 800;
      color: #ef4444;
      flex-shrink: 0;
      white-space: nowrap;

      &::after {
        content: 'K/月';
        font-size: 11px;
        font-weight: 400;
        margin-left: 2px;
        color: #f87171;
      }
    }

    .jc-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .jc-tag {
      padding: 3px 9px;
      background: #f3f4f6;
      border-radius: 6px;
      font-size: 12px;
      color: #4b5563;
      display: inline-flex;
      align-items: center;
      gap: 3px;

      &.loc {
        background: #eff6ff;
        color: #3b82f6;
      }
    }
  }

  .jc-divider {
    height: 1px;
    background: #f3f4f6;
    margin-bottom: 14px;
  }

  .jc-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .jc-company {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;

    .jc-logo {
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      flex-shrink: 0;
    }

    .jc-company-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;

      .jc-company-name {
        font-size: 13px;
        font-weight: 500;
        color: #374151;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .jc-time {
        font-size: 11px;
        color: #9ca3af;
      }
    }
  }

  .jc-apply-btn {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 7px 16px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    flex-shrink: 0;

    &:hover { background: linear-gradient(135deg, #4f46e5, #4338ca); }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
}

.pagination-wrapper {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

/* ——— 响应式 ——— */
@media (max-width: 768px) {
  .jobs-page { padding: 0 12px 40px; }

  .hero-section {
    padding: 32px 20px 28px;

    .hero-title { font-size: 24px; }

    .search-wrap {
      flex-wrap: wrap;
      padding: 8px;
      gap: 8px;

      .search-icon { display: none; }
      .search-input-inner { width: 100%; height: 38px; }
      .city-select { width: 100%; :deep(.el-input__wrapper) { border-left: none; border-top: 1px solid #e5e7eb; border-radius: 0; } }
      .search-btn { width: 100%; }
    }
  }

  .filter-strip {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;

    .filter-left { flex-wrap: wrap; }
  }

  .job-grid { grid-template-columns: 1fr; }
  .recommend-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
