<template>
  <div class="home-page">
    <!-- Hero Banner 轮播 -->
    <div class="hero-banner">
      <el-carousel height="420px" indicator-position="outside" :interval="5000" arrow="always">
        <el-carousel-item>
          <div class="hero-slide slide-1">
            <div class="slide-bg">
              <div class="slide-circle c1"></div>
              <div class="slide-circle c2"></div>
              <div class="slide-circle c3"></div>
            </div>
            <div class="slide-content">
              <div class="slide-badge">旅游行业专属招聘平台</div>
              <h1>探索旅游行业<br/>的无限可能</h1>
              <p>连接优秀旅游人才与顶级企业，开启职业新旅程</p>
              <div class="hero-actions">
                <el-button type="primary" size="large" @click="router.push('/jobs')">
                  <el-icon><Search /></el-icon>
                  立即找工作
                </el-button>
                <el-button size="large" plain style="border-color: rgba(255,255,255,0.6); color: #fff; background: transparent;" @click="router.push('/companies')">
                  了解企业
                </el-button>
              </div>
            </div>
            <div class="slide-decoration">
              <div class="deco-card deco-card-1">
                <el-icon color="#409EFF" size="22"><Location /></el-icon>
                <div>
                  <div class="deco-num">500+</div>
                  <div class="deco-txt">城市招聘</div>
                </div>
              </div>
              <div class="deco-card deco-card-2">
                <el-icon color="#67C23A" size="22"><Briefcase /></el-icon>
                <div>
                  <div class="deco-num">{{ statsDisplay.jobs }}</div>
                  <div class="deco-txt">在招职位</div>
                </div>
              </div>
            </div>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="hero-slide slide-2">
            <div class="slide-bg">
              <div class="slide-circle c1"></div>
              <div class="slide-circle c2"></div>
              <div class="slide-circle c3"></div>
            </div>
            <div class="slide-content">
              <div class="slide-badge">AI 智能匹配 · 精准推荐</div>
              <h1>开启你的<br/>职业新篇章</h1>
              <p>AI算法智能推荐，发现最适合你的旅游行业职位</p>
              <div class="hero-actions">
                <el-button type="primary" size="large" @click="router.push('/register')">
                  <el-icon><UserFilled /></el-icon>
                  免费注册
                </el-button>
                <el-button size="large" plain style="border-color: rgba(255,255,255,0.6); color: #fff; background: transparent;" @click="router.push('/jobs')">
                  浏览职位
                </el-button>
              </div>
            </div>
            <div class="slide-decoration">
              <div class="deco-card deco-card-1">
                <el-icon color="#E6A23C" size="22"><OfficeBuilding /></el-icon>
                <div>
                  <div class="deco-num">{{ statsDisplay.companies }}</div>
                  <div class="deco-txt">优质企业</div>
                </div>
              </div>
              <div class="deco-card deco-card-2">
                <el-icon color="#F56C6C" size="22"><User /></el-icon>
                <div>
                  <div class="deco-num">{{ statsDisplay.users }}</div>
                  <div class="deco-txt">活跃求职者</div>
                </div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-wrapper">
        <div class="search-box">
          <el-select v-model="searchCity" placeholder="全国" class="city-select">
            <el-option label="全国" value="" />
            <el-option label="北京" value="北京" />
            <el-option label="上海" value="上海" />
            <el-option label="广州" value="广州" />
            <el-option label="深圳" value="深圳" />
            <el-option label="成都" value="成都" />
            <el-option label="杭州" value="杭州" />
          </el-select>
          <input
            v-model="searchKeyword"
            class="search-input-inner"
            placeholder="搜索职位名称、公司名称..."
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </button>
        </div>

        <div class="hot-tags">
          <span class="tags-label">
            <el-icon><TrendCharts /></el-icon>
            热门搜索：
          </span>
          <span
            v-for="tag in hotTags"
            :key="tag"
            class="hot-tag"
            @click="searchKeyword = tag; handleSearch()"
          >{{ tag }}</span>
        </div>
      </div>
    </div>

    <!-- 统计数据 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-item" v-for="s in statItems" :key="s.label">
          <div class="stat-icon-wrap" :style="{ background: s.bg }">
            <component :is="s.icon" style="font-size: 28px;" :style="{ color: s.color }" />
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ s.value }}</span>
            <span class="stat-label">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 职位分类导航 -->
    <div class="category-section">
      <div class="section-header">
        <h2><el-icon><Grid /></el-icon> 按分类找工作</h2>
      </div>
      <div class="category-grid">
        <div
          v-for="cat in jobCategories"
          :key="cat.name"
          class="category-item"
          @click="router.push({ path: '/jobs', query: { keyword: cat.keyword } })"
        >
          <div class="cat-icon" :style="{ background: cat.bg }">
            <span class="cat-emoji">{{ cat.emoji }}</span>
          </div>
          <div class="cat-name">{{ cat.name }}</div>
          <div class="cat-count">{{ cat.hint }}</div>
        </div>
      </div>
    </div>

    <!-- 热门职位 -->
    <div class="job-section">
      <div class="section-header">
        <div class="title-wrapper">
          <el-icon :size="24" color="#f7ba2a"><StarFilled /></el-icon>
          <h2>热门职位</h2>
        </div>
        <el-button type="primary" link @click="router.push('/jobs')">
          查看更多 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>

      <div class="job-grid">
        <div
          v-for="job in jobList"
          :key="job.id"
          class="job-card"
          @click="goToDetail(job.id)"
        >
          <div class="job-card-top">
            <div class="job-logo-wrap">
              <el-avatar
                :size="48"
                :src="job.companyLogo"
                shape="square"
                class="company-logo"
              >
                <el-icon size="20"><OfficeBuilding /></el-icon>
              </el-avatar>
            </div>
            <div class="job-title-area">
              <div class="job-title" :title="job.title">{{ job.title }}</div>
              <div class="company-name">{{ job.companyName }}</div>
            </div>
            <div class="job-salary">{{ job.salaryMin }}-{{ job.salaryMax }}K</div>
          </div>

          <div class="job-tags">
            <span v-if="job.city" class="job-tag location">
              <el-icon size="11"><Location /></el-icon>{{ job.city }}
            </span>
            <span v-if="job.experience" class="job-tag">{{ job.experience }}</span>
            <span v-if="job.education" class="job-tag">{{ job.education }}</span>
          </div>

          <div class="job-card-footer">
            <span class="job-hits">
              <el-icon size="12"><View /></el-icon>
              {{ formatNumber(job.hits) }}
            </span>
            <span class="job-time" v-if="job.createTime">{{ formatTime(job.createTime) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 特色功能 -->
    <div class="features-section">
      <div class="section-header centered">
        <h2>为什么选择我们</h2>
        <p class="section-sub">专为旅游行业打造的专业招聘服务平台</p>
      </div>
      <div class="features-grid">
        <div class="feature-item" v-for="f in features" :key="f.title">
          <div class="feature-icon-wrap" :style="{ background: f.iconBg }">
            <component :is="f.icon" style="font-size: 30px;" :style="{ color: f.iconColor }" />
          </div>
          <h4>{{ f.title }}</h4>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </div>

    <!-- 企业招聘 CTA -->
    <div class="cta-section">
      <div class="cta-inner">
        <div class="cta-text">
          <h3>您是旅游企业吗？</h3>
          <p>入驻平台，海量旅游专业人才等你招聘，快速找到合适候选人</p>
        </div>
        <div class="cta-actions">
          <el-button type="primary" size="large" @click="router.push('/register')">
            免费发布职位
          </el-button>
          <el-button size="large" @click="router.push('/companies')">
            了解更多
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Job } from '@/types'
import { getJobList } from '@/api/job'
import request from '@/utils/request'
import {
  Search, TrendCharts, OfficeBuilding, Briefcase, User, UserFilled,
  StarFilled, ArrowRight, Location, View, Select, Lock, ChatDotRound,
  Grid, Compass
} from '@element-plus/icons-vue'

const router = useRouter()

const hotTags = ['导游', '酒店经理', '旅行顾问', '空乘', '景区讲解员', '计调', '签证专员']
const searchKeyword = ref('')
const searchCity = ref('')
const jobList = ref<Job[]>([])

const statsData = ref({ jobs: 0, companies: 0 })

const statsDisplay = computed(() => ({
  jobs: statsData.value.jobs > 0 ? statsData.value.jobs + '+' : '...',
  companies: statsData.value.companies > 0 ? statsData.value.companies + '+' : '...',
  users: '10000+'
}))

const statItems = computed(() => [
  { label: '优质企业', value: statsDisplay.value.companies, icon: OfficeBuilding, bg: '#fff7e6', color: '#fa8c16' },
  { label: '在招职位', value: statsDisplay.value.jobs, icon: Briefcase, bg: '#e6f4ff', color: '#1677ff' },
  { label: '活跃用户', value: statsDisplay.value.users, icon: User, bg: '#f6ffed', color: '#52c41a' },
  { label: '覆盖城市', value: '500+', icon: Location, bg: '#fff0f6', color: '#eb2f96' },
])

const jobCategories = [
  { name: '导游服务', keyword: '导游', emoji: '🗺', hint: '最多岗位', bg: '#e6f4ff' },
  { name: '酒店管理', keyword: '酒店', emoji: '🏨', hint: '高薪热招', bg: '#fff7e6' },
  { name: '旅行顾问', keyword: '旅行顾问', emoji: '✈', hint: '成长快速', bg: '#f6ffed' },
  { name: '航空服务', keyword: '空乘', emoji: '🛫', hint: '精英岗位', bg: '#fff0f6' },
  { name: '景区运营', keyword: '景区', emoji: '🏔', hint: '稳定长期', bg: '#f9f0ff' },
  { name: '计调操作', keyword: '计调', emoji: '📋', hint: '专业对口', bg: '#e6fffb' },
  { name: '签证服务', keyword: '签证', emoji: '📄', hint: '紧缺岗位', bg: '#feffe6' },
  { name: '民宿管理', keyword: '民宿', emoji: '🏡', hint: '新兴热门', bg: '#fff1f0' },
]

const features = [
  {
    title: 'AI智能匹配',
    desc: '基于TF-IDF算法，精准分析简历与职位匹配度，为您推荐最适合的旅游行业岗位',
    icon: Select,
    iconBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    iconColor: '#fff'
  },
  {
    title: '实时消息通知',
    desc: 'WebSocket实时推送简历进度、面试邀请，随时掌握求职动态，不错过任何机会',
    icon: ChatDotRound,
    iconBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    iconColor: '#fff'
  },
  {
    title: '安全资质审核',
    desc: '严格审核旅游企业资质与经营许可，全平台企业均通过实名认证，保障求职安全',
    icon: Lock,
    iconBg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    iconColor: '#fff'
  },
  {
    title: '一键导出简历',
    desc: '支持在线编辑简历，一键导出专业PDF格式，完美适配旅游行业岗位投递需求',
    icon: Compass,
    iconBg: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    iconColor: '#fff'
  },
]

const fetchStats = async () => {
  try {
    const [jobRes, companyRes] = await Promise.allSettled([
      request.get<any>('/recruit/position/page/1', { params: { page: 0, count: 1 } }),
      request.get<any>('/recruit/company/page/1', { params: { page: 0, count: 1 } })
    ])
    if (jobRes.status === 'fulfilled') statsData.value.jobs = (jobRes.value as any).total || 0
    if (companyRes.status === 'fulfilled') statsData.value.companies = (companyRes.value as any).total || 0
  } catch { /* ignore */ }
}

const fetchJobs = async () => {
  try {
    const res = await getJobList({ page: 1, size: 8 })
    jobList.value = res.list
  } catch { /* ignore */ }
}

const handleSearch = () => {
  if (!searchKeyword.value.trim() && !searchCity.value) return
  const query: Record<string, string> = {}
  if (searchKeyword.value.trim()) query.keyword = searchKeyword.value
  if (searchCity.value) query.city = searchCity.value
  router.push({ path: '/jobs', query })
}

const goToDetail = (id: number) => router.push(`/jobs/${id}`)

const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return String(num)
}

const formatTime = (time: string) => {
  const date = new Date(time)
  const now = new Date()
  const days = Math.floor((now.getTime() - date.getTime()) / 86400000)
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return `${Math.floor(days / 30)}月前`
}

onMounted(() => {
  fetchJobs()
  fetchStats()
})
</script>

<style scoped lang="scss">
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* ===== Hero Banner ===== */
.hero-banner {
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 0;

  :deep(.el-carousel__container) {
    height: 420px;
  }

  :deep(.el-carousel__indicators--outside) {
    margin-top: 0;
  }

  .hero-slide {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;

    &.slide-1 {
      background: linear-gradient(135deg, #1a1a4e 0%, #16213e 40%, #0f3460 100%);
    }

    &.slide-2 {
      background: linear-gradient(135deg, #134e5e 0%, #1a6b5e 40%, #0d4f4b 100%);
    }

    .slide-bg {
      position: absolute;
      inset: 0;
      overflow: hidden;

      .slide-circle {
        position: absolute;
        border-radius: 50%;
        opacity: 0.08;
        background: #fff;

        &.c1 { width: 400px; height: 400px; top: -100px; right: -80px; }
        &.c2 { width: 260px; height: 260px; bottom: -60px; left: 20%; opacity: 0.05; }
        &.c3 { width: 120px; height: 120px; top: 30px; left: 40%; opacity: 0.06; }
      }
    }

    .slide-content {
      position: relative;
      z-index: 2;
      padding: 0 60px;
      color: #fff;
      flex: 1;

      .slide-badge {
        display: inline-block;
        padding: 4px 14px;
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 20px;
        font-size: 12px;
        color: rgba(255,255,255,0.85);
        margin-bottom: 20px;
        backdrop-filter: blur(4px);
        background: rgba(255,255,255,0.1);
      }

      h1 {
        font-size: 40px;
        font-weight: 700;
        line-height: 1.3;
        margin: 0 0 16px;
        text-shadow: 0 2px 12px rgba(0,0,0,0.2);
      }

      p {
        font-size: 16px;
        color: rgba(255,255,255,0.75);
        margin: 0 0 28px;
      }

      .hero-actions {
        display: flex;
        gap: 14px;

        .el-button {
          padding: 0 24px;
          height: 44px;
          font-size: 15px;
          border-radius: 8px;
          font-weight: 500;
        }
      }
    }

    .slide-decoration {
      position: relative;
      z-index: 2;
      padding: 0 60px 0 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .deco-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 20px;
        background: rgba(255,255,255,0.12);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 12px;
        min-width: 150px;

        .deco-num {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
        }

        .deco-txt {
          font-size: 12px;
          color: rgba(255,255,255,0.65);
        }
      }
    }
  }
}

/* ===== 搜索区域 ===== */
.search-section {
  margin: 24px 0;

  .search-wrapper {
    max-width: 680px;
    margin: 0 auto;

    .search-box {
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 12px;
      border: 1.5px solid #e5e7eb;
      padding: 4px;
      transition: all 0.2s;

      &:hover, &:focus-within {
        border-color: #409eff;
        box-shadow: 0 4px 16px rgba(64,158,255,0.12);
      }

      .city-select {
        width: 100px;
        flex-shrink: 0;

        :deep(.el-input__wrapper) {
          box-shadow: none;
          border: none;
          background: transparent;
          border-right: 1px solid #e5e7eb;
          border-radius: 0;
        }
      }

      .search-input-inner {
        flex: 1;
        border: none;
        outline: none;
        padding: 0 16px;
        font-size: 15px;
        color: #111827;
        background: transparent;
        height: 44px;

        &::placeholder {
          color: #9ca3af;
        }
      }

      .search-btn {
        background: linear-gradient(135deg, #409eff, #3a8ee6);
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 0 28px;
        height: 44px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;

        &:hover {
          background: linear-gradient(135deg, #3a8ee6, #2c7bd0);
          transform: translateY(-1px);
        }
      }
    }

    .hot-tags {
      margin-top: 14px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;

      .tags-label {
        font-size: 13px;
        color: #6b7280;
        display: flex;
        align-items: center;
        gap: 4px;

        .el-icon { color: #f59e0b; }
      }

      .hot-tag {
        cursor: pointer;
        font-size: 13px;
        color: #4b5563;
        padding: 4px 12px;
        border-radius: 20px;
        background: #f3f4f6;
        transition: all 0.2s;

        &:hover {
          color: #409eff;
          background: #eff6ff;
        }
      }
    }
  }
}

/* ===== 统计数据 ===== */
.stats-section {
  margin-bottom: 32px;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 20px 24px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      transition: transform 0.25s, box-shadow 0.25s;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.09);
      }

      .stat-icon-wrap {
        width: 52px;
        height: 52px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .stat-info {
        display: flex;
        flex-direction: column;

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a2e;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 13px;
          color: #909399;
          margin-top: 3px;
        }
      }
    }
  }
}

/* ===== 职位分类 ===== */
.category-section {
  margin-bottom: 40px;

  .category-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 12px;

    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px 8px;
      background: #fff;
      border-radius: 12px;
      cursor: pointer;
      border: 1px solid #f0f0f0;
      transition: all 0.22s;

      &:hover {
        border-color: #b3d8ff;
        box-shadow: 0 4px 16px rgba(64,158,255,0.12);
        transform: translateY(-3px);

        .cat-name { color: #409EFF; }
      }

      .cat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;

        .cat-emoji { font-size: 22px; }
      }

      .cat-name {
        font-size: 13px;
        font-weight: 500;
        color: #303133;
        transition: color 0.2s;
      }

      .cat-count {
        font-size: 11px;
        color: #c0c4cc;
      }
    }
  }
}

/* ===== 热门职位 ===== */
.job-section {
  margin-bottom: 48px;

  .job-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    .job-card {
      background: #fff;
      border-radius: 12px;
      padding: 18px;
      cursor: pointer;
      border: 1px solid #f0f0f0;
      transition: all 0.25s;

      &:hover {
        border-color: #b3d8ff;
        box-shadow: 0 8px 28px rgba(64,158,255,0.1);
        transform: translateY(-3px);
      }

      .job-card-top {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 12px;

        .job-logo-wrap {
          flex-shrink: 0;

          .company-logo {
            border-radius: 8px;
            border: 1px solid #ebeef5;
          }
        }

        .job-title-area {
          flex: 1;
          min-width: 0;

          .job-title {
            font-size: 15px;
            font-weight: 600;
            color: #1a1a2e;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 4px;
          }

          .company-name {
            font-size: 12px;
            color: #909399;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .job-salary {
          flex-shrink: 0;
          font-size: 14px;
          font-weight: 700;
          color: #f56c6c;
          white-space: nowrap;
        }
      }

      .job-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-bottom: 12px;

        .job-tag {
          font-size: 11px;
          color: #606266;
          background: #f5f7fa;
          border-radius: 4px;
          padding: 2px 7px;
          display: flex;
          align-items: center;
          gap: 2px;

          &.location {
            color: #409EFF;
            background: #ecf5ff;
          }
        }
      }

      .job-card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 10px;
        border-top: 1px solid #f5f5f5;
        font-size: 12px;
        color: #c0c4cc;

        .job-hits, .job-time {
          display: flex;
          align-items: center;
          gap: 3px;
        }
      }
    }
  }
}

/* ===== 特色功能 ===== */
.features-section {
  margin-bottom: 40px;

  .features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

    .feature-item {
      text-align: center;
      padding: 36px 20px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.05);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 16px 40px rgba(0,0,0,0.09);
      }

      .feature-icon-wrap {
        width: 68px;
        height: 68px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
      }

      h4 {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 10px;
      }

      p {
        font-size: 13px;
        color: #909399;
        line-height: 1.7;
        margin: 0;
      }
    }
  }
}

/* ===== CTA ===== */
.cta-section {
  background: linear-gradient(135deg, #1a1a4e 0%, #0f3460 100%);
  border-radius: 16px;
  margin-bottom: 40px;
  overflow: hidden;

  .cta-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40px 60px;

    .cta-text {
      h3 {
        font-size: 26px;
        font-weight: 700;
        color: #fff;
        margin: 0 0 10px;
      }

      p {
        font-size: 14px;
        color: rgba(255,255,255,0.65);
        margin: 0;
      }
    }

    .cta-actions {
      display: flex;
      gap: 12px;
      flex-shrink: 0;

      .el-button {
        height: 44px;
        padding: 0 28px;
        font-size: 15px;
        border-radius: 8px;
        font-weight: 500;
      }
    }
  }
}

/* ===== Section Header ===== */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .title-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  h2 {
    font-size: 22px;
    font-weight: 600;
    color: #1a1a2e;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;

    .el-icon { color: #409EFF; }
  }

  &.centered {
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 32px;

    h2 { font-size: 26px; }

    .section-sub {
      font-size: 14px;
      color: #909399;
      margin-top: 8px;
    }
  }
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
  .stats-section .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .category-section .category-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .job-section .job-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .features-section .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-banner {
    .hero-slide {
      .slide-content {
        padding: 0 24px;

        h1 { font-size: 28px; }
        p { font-size: 14px; }
      }

      .slide-decoration { display: none; }
    }
  }

  .search-section {
    padding: 20px 16px;
  }

  .category-section .category-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .job-section .job-grid {
    grid-template-columns: 1fr;
  }

  .features-section .features-grid {
    grid-template-columns: 1fr;
  }

  .cta-section .cta-inner {
    flex-direction: column;
    gap: 24px;
    padding: 32px 24px;
    text-align: center;
  }
}
</style>
