<template>
  <div class="follows-page">
    <div class="page-header">
      <div class="header-text">
        <h1>关注的公司</h1>
        <p>已关注 <strong>{{ followList.length }}</strong> 家企业，第一时间获取新职位通知</p>
      </div>
      <el-icon size="48" color="rgba(255,255,255,0.15)"><Collection /></el-icon>
    </div>

    <div v-loading="loading" class="company-grid">
      <template v-if="followList.length > 0">
        <el-card
          v-for="company in followList"
          :key="company.id"
          class="company-card"
          shadow="hover"
          @click="viewCompanyJobs(company.id)"
        >
          <div class="company-logo">
            <el-avatar
              :size="60"
              :src="company.logo"
              shape="square"
            >
              <el-icon size="28"><OfficeBuilding /></el-icon>
            </el-avatar>
          </div>

          <div class="company-info">
            <h3 class="company-name">{{ company.name }}</h3>
            <p class="company-city">
              <el-icon><Location /></el-icon>
              {{ company.city || '未知城市' }}
            </p>
            <p class="company-desc">{{ truncate(company.description, 60) }}</p>
          </div>

          <div class="company-actions" @click.stop>
            <el-button
              type="danger"
              size="small"
              plain
              :loading="cancellingId === company.id"
              @click="handleCancelFollow(company)"
            >
              取消关注
            </el-button>
          </div>
        </el-card>
      </template>

      <div v-else class="empty-state">
        <el-empty description="暂未关注任何公司">
          <el-button type="primary" @click="router.push('/companies')">去发现企业</el-button>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { OfficeBuilding, Location, Collection } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const followList = ref<any[]>([])
const cancellingId = ref<number | null>(null)

const fetchFollows = async () => {
  const userId = userStore.userInfo?.id
  if (!userId) return

  loading.value = true
  try {
    const res = await request.get<any[]>(`/recruit/follow/${userId}`)
    followList.value = Array.isArray(res) ? res : []
  } catch (error) {
    ElMessage.error('获取关注列表失败')
  } finally {
    loading.value = false
  }
}

const handleCancelFollow = async (company: any) => {
  try {
    await ElMessageBox.confirm(`确定取消关注「${company.name}」吗？`, '提示', { type: 'warning' })
    const userId = userStore.userInfo?.id
    cancellingId.value = company.id
    await request.delete('/recruit/follow/cancel', {
      params: { userId, companyId: company.id }
    })
    ElMessage.success('已取消关注')
    followList.value = followList.value.filter(c => c.id !== company.id)
  } catch {
    // 取消操作
  } finally {
    cancellingId.value = null
  }
}

const viewCompanyJobs = (companyId: number) => {
  router.push({ path: '/jobs', query: { companyId } })
}

const truncate = (text: string, len: number) => {
  if (!text) return ''
  return text.length > len ? text.slice(0, len) + '...' : text
}

onMounted(fetchFollows)
</script>

<style scoped lang="scss">
.follows-page {
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%);
  border-radius: 16px;
  padding: 28px 40px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-text {
    h1 {
      font-size: 26px;
      font-weight: 700;
      color: #fff;
      margin: 0 0 6px;
    }

    p {
      font-size: 14px;
      color: rgba(255,255,255,0.65);
      margin: 0;

      strong { color: #60a5fa; }
    }
  }
}

.company-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  min-height: 200px;
}

.company-card {
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 20px;
    text-align: center;
  }

  .company-logo {
    margin-bottom: 16px;
  }

  .company-info {
    width: 100%;

    .company-name {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px;
    }

    .company-city {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      color: #909399;
      font-size: 13px;
      margin: 0 0 10px;

      .el-icon {
        font-size: 14px;
      }
    }

    .company-desc {
      color: #606266;
      font-size: 13px;
      line-height: 1.6;
      margin: 0 0 16px;
      min-height: 40px;
    }
  }

  .company-actions {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
}
</style>
