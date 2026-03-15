<template>
  <div class="companies-page">
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索企业名称"
        size="large"
        clearable
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

    <div class="company-list" v-loading="loading">
      <el-empty v-if="companyList.length === 0" description="暂无企业" />

      <div v-else class="company-cards">
        <div v-for="company in companyList" :key="company.id" class="company-card" @click="viewDetail(company.id)">
          <div class="company-header">
            <el-avatar :size="60" :src="company.logo">
              <el-icon size="30"><OfficeBuilding /></el-icon>
            </el-avatar>
            <div class="company-name">
              <h3>{{ company.name }}</h3>
              <p>{{ company.city }}</p>
            </div>
          </div>
          <div class="company-mission" v-if="company.mission">
            {{ company.mission }}
          </div>
          <div class="company-desc">
            {{ company.description }}
          </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, OfficeBuilding } from '@element-plus/icons-vue'
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
  // 可以跳转到企业详情页
  ElMessage.info('企业详情功能开发中')
}

onMounted(fetchCompanies)
</script>

<style scoped lang="scss">
.companies-page {
  max-width: 1200px;
  margin: 0 auto;
}

.search-bar {
  max-width: 600px;
  margin: 0 auto 24px;
}

.company-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.company-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .company-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;

    .company-name {
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
  }

  .company-mission {
    color: #606266;
    font-size: 14px;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .company-desc {
    color: #909399;
    font-size: 13px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.pagination {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}
</style>
