<template>
  <div class="companies-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>优质企业</h1>
      <p>探索旅游行业的优秀企业，找到你的理想雇主</p>
    </div>

    <!-- 搜索栏 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索企业名称"
        size="large"
        clearable
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
    </div>

    <!-- 企业统计 -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-number">{{ total }}</span>
        <span class="stat-label">认证企业</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-number">500+</span>
        <span class="stat-label">在招职位</span>
      </div>
    </div>

    <!-- 企业列表 -->
    <div class="company-list" v-loading="loading">
      <el-empty v-if="companyList.length === 0" description="暂无企业">
        <template #image>
          <el-icon :size="60" color="#dcdfe6"><OfficeBuilding /></el-icon>
        </template>
      </el-empty>

      <div v-else class="company-grid">
        <el-card
          v-for="company in companyList"
          :key="company.id"
          class="company-card"
          shadow="hover"
          @click="viewDetail(company.id)"
        >
          <div class="company-header">
            <el-avatar :size="72" :src="company.logo" class="company-logo">
              <el-icon :size="32"><OfficeBuilding /></el-icon>
            </el-avatar>
            <div class="company-badge" v-if="company.state === 1">
              <el-icon><Select /></el-icon>
              已认证
            </div>
          </div>

          <div class="company-body">
            <h3 class="company-name" :title="company.name">{{ company.name }}</h3>
            <p class="company-city">
              <el-icon><Location /></el-icon>
              {{ company.city || '未知城市' }}
            </p>
            <p class="company-mission" v-if="company.mission">
              {{ company.mission }}
            </p>
          </div>

          <div class="company-footer">
            <div class="company-tags">
              <el-tag size="small" effect="plain" v-if="company.foreignName">跨国企业</el-tag>
              <el-tag size="small" effect="plain" type="success">热招中</el-tag>
            </div>
            <el-button type="primary" link>
              查看详情 <el-icon><ArrowRight /></el-icon>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, OfficeBuilding, Location, ArrowRight, Select } from '@element-plus/icons-vue'
import { getCompanyList } from '@/api/company'

const router = useRouter()
const loading = ref(false)
const companyList = ref<any[]>([])
const page = ref(1)
const pageSize = ref(12)
const total = ref(0)
const searchKeyword = ref('')

const fetchCompanies = async () => {
  loading.value = true
  try {
    const res = await getCompanyList({
      page: page.value,
      size: pageSize.value,
      state: 1
    })
    companyList.value = res.list
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取企业列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  fetchCompanies()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchCompanies()
}

const handlePageChange = (val: number) => {
  page.value = val
  fetchCompanies()
}

const viewDetail = (id: number) => {
  ElMessage.info('企业详情功能开发中')
}

onMounted(fetchCompanies)
</script>

<style scoped lang="scss">
.companies-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;

  .page-header {
    text-align: center;
    margin-bottom: 32px;

    h1 {
      font-size: 32px;
      font-weight: 700;
      color: #303133;
      margin: 0 0 12px 0;
    }

    p {
      font-size: 16px;
      color: #909399;
      margin: 0;
    }
  }

  .search-section {
    max-width: 560px;
    margin: 0 auto 24px;

    .search-input {
      :deep(.el-input__wrapper) {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        padding: 4px 4px 4px 16px;
      }

      :deep(.el-input__inner) {
        height: 44px;
        font-size: 15px;
      }

      :deep(.el-input-group__append) {
        background: #409eff;
        border-color: #409eff;
        padding: 0 24px;

        .el-button {
          color: #fff;
          font-size: 15px;
          font-weight: 500;
        }
      }
    }
  }

  .stats-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    margin-bottom: 32px;
    padding: 16px;
    background: linear-gradient(135deg, #f5f7fa 0%, #ebeef5 100%);
    border-radius: 12px;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;

      .stat-number {
        font-size: 28px;
        font-weight: 700;
        color: #409eff;
      }

      .stat-label {
        font-size: 14px;
        color: #606266;
      }
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: #dcdfe6;
    }
  }

  .company-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .company-card {
    cursor: pointer;
    border-radius: 12px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
    }

    :deep(.el-card__body) {
      padding: 24px;
    }

    .company-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;

      .company-logo {
        border: 2px solid #ebeef5;
      }

      .company-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        background: rgba(103, 194, 58, 0.1);
        color: #67c23a;
        font-size: 12px;
        border-radius: 20px;

        .el-icon {
          font-size: 12px;
        }
      }
    }

    .company-body {
      margin-bottom: 20px;

      .company-name {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 8px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .company-city {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        color: #606266;
        margin: 0 0 8px 0;

        .el-icon {
          color: #909399;
        }
      }

      .company-mission {
        font-size: 13px;
        color: #909399;
        line-height: 1.5;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }

    .company-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #ebeef5;

      .company-tags {
        display: flex;
        gap: 8px;
      }

      .el-button {
        font-size: 13px;

        .el-icon {
          margin-left: 2px;
        }
      }
    }
  }

  .pagination-wrapper {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .companies-page {
    padding: 0 12px 32px;

    .page-header {
      h1 {
        font-size: 24px;
      }
    }

    .company-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
