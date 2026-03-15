<template>
  <div class="home-page">
    <!-- Banner 轮播 -->
    <el-carousel height="400px" class="banner" indicator-position="outside">
      <el-carousel-item v-for="(img, index) in banners" :key="index">
        <div class="banner-item">
          <img :src="img" class="banner-img" />
          <div class="banner-overlay">
            <h2>{{ bannerTexts[index].title }}</h2>
            <p>{{ bannerTexts[index].subtitle }}</p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-wrapper">
        <h3 class="search-title">发现你的理想工作</h3>
        <el-input
          v-model="searchKeyword"
          placeholder="搜索职位名称、公司名称"
          size="large"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
          </template>
        </el-input>

        <div class="hot-tags">
          <span class="tags-label">
            <el-icon><TrendCharts /></el-icon>
            热门搜索：
          </span>
          <el-tag
            v-for="tag in hotTags"
            :key="tag"
            effect="plain"
            round
            @click="searchKeyword = tag; handleSearch()"
            class="hot-tag"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 统计数据展示 -->
    <div class="stats-section">
      <el-row :gutter="40">
        <el-col :span="8">
          <div class="stat-item">
            <el-icon class="stat-icon" :size="40"><OfficeBuilding /></el-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats.companies }}</span>
              <span class="stat-label">优质企业</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-item">
            <el-icon class="stat-icon" :size="40"><Briefcase /></el-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats.jobs }}</span>
              <span class="stat-label">在招职位</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-item">
            <el-icon class="stat-icon" :size="40"><User /></el-icon>
            <div class="stat-info">
              <span class="stat-number">{{ stats.users }}</span>
              <span class="stat-label">活跃用户</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 热门职位 -->
    <div class="job-section">
      <div class="section-header">
        <div class="title-wrapper">
          <el-icon :size="28"><StarFilled /></el-icon>
          <h2>热门职位</h2>
        </div>
        <el-button type="primary" link @click="router.push('/jobs')">
          查看更多 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>

      <el-row :gutter="20">
        <el-col v-for="job in jobList" :key="job.id" :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="job-card" shadow="hover" @click="goToDetail(job.id)">
            <div class="job-header">
              <el-avatar
                :size="56"
                :src="job.companyLogo || defaultCompanyLogo"
                class="company-logo"
              />
              <div class="job-title-wrapper">
                <h3 class="job-title" :title="job.title">{{ job.title }}</h3>
                <p class="company-name">{{ job.companyName }}</p>
              </div>
            </div>

            <div class="job-tags">
              <el-tag v-if="job.city" size="small" effect="light">
                <el-icon><Location /></el-icon>
                {{ job.city }}
              </el-tag>
              <el-tag v-if="job.experience" size="small" effect="light" type="info">
                {{ job.experience }}
              </el-tag>
              <el-tag v-if="job.education" size="small" effect="light" type="info">
                {{ job.education }}
              </el-tag>
            </div>

            <div class="job-footer">
              <div class="salary">
                <span class="salary-num">{{ job.salaryMin }}-{{ job.salaryMax }}K</span>
                <span class="salary-unit">/月</span>
              </div>
              <div class="job-meta">
                <span class="meta-item">
                  <el-icon><View /></el-icon>
                  {{ formatNumber(job.hits) }}
                </span>
                <span class="meta-item" v-if="job.createTime">
                  {{ formatTime(job.createTime) }}
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 特色功能 -->
    <div class="features-section">
      <h2 class="section-title">为什么选择我们</h2>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="feature-item">
            <div class="feature-icon blue">
              <el-icon :size="32"><Select /></el-icon>
            </div>
            <h4>精准匹配</h4>
            <p>基于AI算法，为你推荐最合适的职位</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="feature-item">
            <div class="feature-icon green">
              <el-icon :size="32"><Lock /></el-icon>
            </div>
            <h4>安全可靠</h4>
            <p>严格审核企业资质，保障求职安全</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="feature-item">
            <div class="feature-icon orange">
              <el-icon :size="32"><ChatDotRound /></el-icon>
            </div>
            <h4>高效沟通</h4>
            <p>在线直聊HR，快速获取面试机会</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Job } from '@/types'
import { getJobList } from '@/api/job'
import {
  Search, TrendCharts, OfficeBuilding, Briefcase, User,
  StarFilled, ArrowRight, Location, View, Select, Lock, ChatDotRound
} from '@element-plus/icons-vue'

const router = useRouter()

const banners = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=400&fit=crop',
]

const bannerTexts = [
  { title: '探索旅游行业的无限可能', subtitle: '连接优秀旅游人才与顶级企业' },
  { title: '开启你的职业新篇章', subtitle: '发现世界各地的精彩机会' },
]

const defaultCompanyLogo = 'https://via.placeholder.com/56?text=LOGO'

const hotTags = ['导游', '酒店经理', '旅行顾问', '空乘', '景区讲解员', '计调', '签证专员']
const searchKeyword = ref('')
const jobList = ref<Job[]>([])

// 统计数据（模拟）
const stats = ref({
  companies: '500+',
  jobs: '2000+',
  users: '10000+'
})

const fetchJobs = async () => {
  try {
    const res = await getJobList({ page: 1, size: 8 })
    jobList.value = res.list
  } catch (error) {
    console.error('获取职位列表失败:', error)
  }
}

const handleSearch = () => {
  if (!searchKeyword.value.trim()) return
  router.push({ path: '/jobs', query: { keyword: searchKeyword.value } })
}

const goToDetail = (id: number) => {
  router.push(`/jobs/${id}`)
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 格式化时间
const formatTime = (time: string) => {
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

onMounted(fetchJobs)
</script>

<style scoped lang="scss">
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  // Banner 样式
  .banner {
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 40px;

    .banner-item {
      position: relative;
      height: 100%;

      .banner-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .banner-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        text-align: center;
        padding: 40px;

        h2 {
          font-size: 36px;
          font-weight: 600;
          margin-bottom: 16px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        p {
          font-size: 18px;
          opacity: 0.9;
        }
      }
    }
  }

  // 搜索区域
  .search-section {
    margin-bottom: 40px;

    .search-wrapper {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 40px 60px;
      text-align: center;

      .search-title {
        color: #fff;
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 24px;
      }

      .search-input {
        max-width: 600px;
        margin: 0 auto;

        :deep(.el-input__wrapper) {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          padding: 4px 4px 4px 16px;
        }

        :deep(.el-input__inner) {
          height: 48px;
          font-size: 16px;
        }

        :deep(.el-input-group__append) {
          background: #409eff;
          border-color: #409eff;
          padding: 0 24px;

          .el-button {
            color: #fff;
            font-size: 16px;
            font-weight: 500;

            .el-icon {
              margin-right: 4px;
            }
          }
        }
      }

      .hot-tags {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;

        .tags-label {
          color: rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          gap: 4px;

          .el-icon {
            color: #ffd700;
          }
        }

        .hot-tag {
          cursor: pointer;
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.3);
          color: #fff;
          transition: all 0.3s;

          &:hover {
            background: rgba(255,255,255,0.3);
            border-color: rgba(255,255,255,0.5);
          }
        }
      }
    }
  }

  // 统计区域
  .stats-section {
    margin-bottom: 48px;

    .stat-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 24px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      transition: transform 0.3s, box-shadow 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      }

      .stat-icon {
        color: #409eff;
        background: rgba(64,158,255,0.1);
        padding: 12px;
        border-radius: 12px;
      }

      .stat-info {
        display: flex;
        flex-direction: column;

        .stat-number {
          font-size: 28px;
          font-weight: 700;
          color: #303133;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
          margin-top: 4px;
        }
      }
    }
  }

  // 职位区域
  .job-section {
    margin-bottom: 48px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .title-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;

        h2 {
          font-size: 24px;
          font-weight: 600;
          color: #303133;
          margin: 0;
        }

        .el-icon {
          color: #f7ba2a;
        }
      }
    }

    .job-card {
      cursor: pointer;
      border-radius: 12px;
      margin-bottom: 20px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important;
      }

      :deep(.el-card__body) {
        padding: 20px;
      }

      .job-header {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;

        .company-logo {
          flex-shrink: 0;
          border: 1px solid #ebeef5;
        }

        .job-title-wrapper {
          flex: 1;
          min-width: 0;

          .job-title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            margin: 0 0 6px 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .company-name {
            font-size: 14px;
            color: #606266;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      .job-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;

        .el-tag {
          display: flex;
          align-items: center;
          gap: 2px;

          .el-icon {
            font-size: 12px;
          }
        }
      }

      .job-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12px;
        border-top: 1px solid #ebeef5;

        .salary {
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

        .job-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #909399;

          .meta-item {
            display: flex;
            align-items: center;
            gap: 2px;

            .el-icon {
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  // 特色功能
  .features-section {
    margin-bottom: 48px;

    .section-title {
      text-align: center;
      font-size: 28px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 40px;
    }

    .feature-item {
      text-align: center;
      padding: 40px 20px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 16px 40px rgba(0,0,0,0.1);
      }

      .feature-icon {
        width: 72px;
        height: 72px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        color: #fff;

        &.blue {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.green {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }

        &.orange {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
      }

      h4 {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 12px 0;
      }

      p {
        font-size: 14px;
        color: #606266;
        line-height: 1.6;
        margin: 0;
      }
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .home-page {
    padding: 0 12px;

    .banner {
      height: 250px;

      .banner-overlay {
        h2 {
          font-size: 24px;
        }

        p {
          font-size: 14px;
        }
      }
    }

    .search-section {
      .search-wrapper {
        padding: 24px;

        .search-title {
          font-size: 20px;
        }
      }
    }

    .stats-section {
      .stat-item {
        margin-bottom: 16px;
      }
    }
  }
}
</style>
