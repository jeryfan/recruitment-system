<template>
  <div class="job-detail-page">
    <div v-loading="loading" class="detail-wrap">
      <template v-if="job">
        <!-- 返回导航 -->
        <div class="back-nav" @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>
          <span>返回职位列表</span>
        </div>

        <!-- 职位英雄区 -->
        <div class="job-hero">
          <div class="hero-left">
            <div class="company-avatar-wrap">
              <el-avatar :size="72" :src="job.companyLogo" shape="square" class="company-logo">
                <el-icon size="32"><OfficeBuilding /></el-icon>
              </el-avatar>
            </div>
            <div class="hero-info">
              <h1 class="job-title">{{ job.title }}</h1>
              <div class="company-line">
                <span class="company-name">{{ job.companyName }}</span>
                <el-tag size="small" type="success" effect="plain">热招中</el-tag>
              </div>
              <div class="job-meta-tags">
                <span class="meta-tag location">
                  <el-icon size="13"><Location /></el-icon>{{ job.city || '不限' }}
                </span>
                <span v-if="job.experience" class="meta-tag">{{ job.experience }}</span>
                <span v-if="job.education" class="meta-tag">{{ job.education }}</span>
                <span v-if="job.tags?.length" class="meta-tag accent">{{ job.tags[0] }}</span>
              </div>
            </div>
          </div>
          <div class="hero-right">
            <div class="salary-display">
              <span class="salary-num">{{ job.salaryMin }}-{{ job.salaryMax }}K</span>
              <span class="salary-unit">/月</span>
            </div>
            <div class="hero-actions">
              <el-button type="primary" size="large" @click="handleApply" :loading="applying">
                <el-icon><Position /></el-icon>
                立即投递
              </el-button>
              <el-button
                :type="isFavorited ? 'warning' : 'default'"
                size="large"
                @click="toggleFavorite"
              >
                <el-icon><Star /></el-icon>
                {{ isFavorited ? '已收藏' : '收藏' }}
              </el-button>
            </div>
            <div class="hero-meta">
              <span><el-icon><View /></el-icon> {{ job.hits }} 次浏览</span>
              <span v-if="job.createTime"><el-icon><Clock /></el-icon> {{ formatTime(job.createTime) }}</span>
            </div>
          </div>
        </div>

        <!-- 主体内容 + 侧边栏 -->
        <div class="detail-body">
          <!-- 主内容 -->
          <div class="detail-main">
            <!-- 职位描述 -->
            <el-card class="detail-card" v-if="job.description">
              <template #header>
                <div class="card-title">
                  <el-icon color="#409EFF"><Document /></el-icon>
                  <span>职位描述</span>
                </div>
              </template>
              <div class="prose-content">{{ job.description }}</div>
            </el-card>
            <el-card class="detail-card" v-else>
              <template #header>
                <div class="card-title">
                  <el-icon color="#409EFF"><Document /></el-icon>
                  <span>职位描述</span>
                </div>
              </template>
              <el-empty description="暂无职位描述" :image-size="60" />
            </el-card>

            <!-- 任职要求 -->
            <el-card class="detail-card" v-if="job.requirement">
              <template #header>
                <div class="card-title">
                  <el-icon color="#67C23A"><Select /></el-icon>
                  <span>任职要求</span>
                </div>
              </template>
              <div class="prose-content">{{ job.requirement }}</div>
            </el-card>
            <el-card class="detail-card" v-else>
              <template #header>
                <div class="card-title">
                  <el-icon color="#67C23A"><Select /></el-icon>
                  <span>任职要求</span>
                </div>
              </template>
              <el-empty description="暂无任职要求" :image-size="60" />
            </el-card>
          </div>

          <!-- 侧边栏 -->
          <div class="detail-aside">
            <!-- 企业信息 -->
            <el-card class="aside-card company-aside" @click="goToCompanyJobs">
              <div class="aside-company">
                <el-avatar :size="52" :src="job.companyLogo" shape="square">
                  <el-icon size="24"><OfficeBuilding /></el-icon>
                </el-avatar>
                <div class="aside-company-info">
                  <div class="aside-company-name">{{ job.companyName }}</div>
                  <div class="aside-company-hint">查看该公司更多职位 →</div>
                </div>
              </div>
            </el-card>

            <!-- 快速投递卡片 -->
            <el-card class="aside-card apply-card">
              <h4>快速投递</h4>
              <p>一键发送简历给HR，等待面试通知</p>
              <el-button type="primary" block style="width: 100%;" @click="handleApply" :loading="applying">
                立即投递简历
              </el-button>
              <el-button style="width: 100%; margin-top: 10px;" @click="toggleFavorite">
                {{ isFavorited ? '取消收藏' : '收藏职位' }}
              </el-button>
            </el-card>

            <!-- 职位标签 -->
            <el-card class="aside-card" v-if="job.tags?.length">
              <template #header>
                <div class="card-title">
                  <el-icon color="#E6A23C"><PriceTag /></el-icon>
                  <span>职位标签</span>
                </div>
              </template>
              <div class="tags-wrap">
                <el-tag v-for="tag in job.tags" :key="tag" effect="plain" style="margin: 4px;">{{ tag }}</el-tag>
              </div>
            </el-card>
          </div>
        </div>
      </template>

      <el-empty v-else-if="!loading" description="职位不存在或已下架">
        <el-button type="primary" @click="router.push('/jobs')">返回职位列表</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { OfficeBuilding, ArrowRight, ArrowLeft, Location, View, Clock, Document, Select, Position, Star, PriceTag } from '@element-plus/icons-vue'
import type { Job } from '@/types'
import { getJobDetail, applyJob, favoriteJob, cancelFavorite, getFavoriteList } from '@/api/job'
import { getMyResume } from '@/api/resume'
import { useUserStore } from '@/stores/user'
import moment from 'moment'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const applying = ref(false)
const job = ref<Job | null>(null)
const isFavorited = ref(false)

const fetchJobDetail = async () => {
  const id = Number(route.params.id)
  if (!id) return

  loading.value = true
  try {
    const data = await getJobDetail(id)
    job.value = data
    checkFavorite(id)
  } catch {
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
  } catch { /* ignore */ }
}

const handleApply = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  applying.value = true
  try {
    const resume = await getMyResume()
    if (!resume?.id) {
      ElMessage.warning('请先完善简历')
      router.push('/resume')
      return
    }
    const userId = userStore.userInfo?.id
    if (!userId) { ElMessage.warning('请先登录'); return }
    await applyJob(job.value!.id, resume.id, job.value!.hrId || 0, job.value!.companyId || 0, userId)
    ElMessage.success('投递成功！等待HR查看')
  } catch {
    ElMessage.error('投递失败，请重试')
  } finally {
    applying.value = false
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
      ElMessage.success('已取消收藏')
    } else {
      await favoriteJob(job.value!.id)
      ElMessage.success('收藏成功')
    }
    isFavorited.value = !isFavorited.value
  } catch {
    ElMessage.error('操作失败')
  }
}

const goToCompanyJobs = () => {
  router.push({ path: '/jobs', query: { keyword: job.value?.companyName } })
}

const formatTime = (time: string) => {
  if (!time) return ''
  return moment(time).fromNow()
}

onMounted(fetchJobDetail)
</script>

<style scoped lang="scss">
.job-detail-page {
  max-width: 1000px;
  margin: 0 auto;

  .detail-wrap {
    min-height: 300px;
  }

  .back-nav {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #909399;
    cursor: pointer;
    margin-bottom: 16px;
    width: fit-content;
    transition: color 0.2s;

    &:hover { color: #409EFF; }
  }

  /* 英雄区 */
  .job-hero {
    background: linear-gradient(135deg, #1a1a4e 0%, #0f3460 100%);
    border-radius: 16px;
    padding: 32px 40px;
    margin-bottom: 20px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;

    .hero-left {
      display: flex;
      gap: 20px;
      flex: 1;
      min-width: 0;

      .company-logo {
        border-radius: 12px;
        border: 2px solid rgba(255,255,255,0.15);
        flex-shrink: 0;
      }

      .hero-info {
        min-width: 0;

        .job-title {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
          line-height: 1.3;
        }

        .company-line {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;

          .company-name {
            font-size: 15px;
            color: rgba(255,255,255,0.75);
          }
        }

        .job-meta-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .meta-tag {
            padding: 3px 10px;
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.18);
            border-radius: 20px;
            font-size: 12px;
            color: rgba(255,255,255,0.85);
            display: flex;
            align-items: center;
            gap: 4px;

            &.location { color: #93c5fd; border-color: rgba(147,197,253,0.3); }
            &.accent { color: #fde68a; border-color: rgba(253,230,138,0.3); }
          }
        }
      }
    }

    .hero-right {
      flex-shrink: 0;
      text-align: right;

      .salary-display {
        margin-bottom: 16px;

        .salary-num {
          font-size: 28px;
          font-weight: 800;
          color: #fca5a5;
        }

        .salary-unit {
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          margin-left: 3px;
        }
      }

      .hero-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-bottom: 12px;

        .el-button {
          border-radius: 8px;
          font-weight: 500;
        }
      }

      .hero-meta {
        display: flex;
        gap: 16px;
        justify-content: flex-end;
        font-size: 12px;
        color: rgba(255,255,255,0.4);

        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }

  /* 主体两列布局 */
  .detail-body {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 20px;
    align-items: start;

    .detail-main {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .detail-aside {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 15px;
    color: #303133;
  }

  .detail-card {
    border-radius: 12px;

    .prose-content {
      color: #4b5563;
      line-height: 1.9;
      font-size: 14px;
      white-space: pre-line;
    }
  }

  .aside-card {
    border-radius: 12px;

    &.company-aside {
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: #b3d8ff;
        box-shadow: 0 4px 16px rgba(64,158,255,0.1);
      }

      .aside-company {
        display: flex;
        align-items: center;
        gap: 12px;

        .aside-company-info {
          .aside-company-name {
            font-size: 14px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 4px;
          }

          .aside-company-hint {
            font-size: 12px;
            color: #409EFF;
          }
        }
      }
    }

    &.apply-card {
      h4 {
        font-size: 15px;
        font-weight: 600;
        color: #1a1a2e;
        margin: 0 0 6px;
      }

      p {
        font-size: 13px;
        color: #909399;
        margin: 0 0 16px;
        line-height: 1.5;
      }
    }

    .tags-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
  }
}

@media (max-width: 768px) {
  .job-detail-page {
    .job-hero {
      flex-direction: column;
      padding: 24px 20px;

      .hero-right {
        text-align: left;
        width: 100%;

        .hero-actions { justify-content: flex-start; }
        .hero-meta { justify-content: flex-start; }
      }
    }

    .detail-body {
      grid-template-columns: 1fr;
    }
  }
}
</style>
