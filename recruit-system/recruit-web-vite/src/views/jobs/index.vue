<template>
  <div class="jobs-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchForm.keyword"
        placeholder="搜索职位、公司"
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

    <!-- 筛选条件 -->
    <div class="filter-bar">
      <el-select v-model="searchForm.city" placeholder="城市" clearable @change="handleSearch">
        <el-option label="全部城市" value="" />
        <el-option label="北京" value="北京" />
        <el-option label="上海" value="上海" />
        <el-option label="广州" value="广州" />
        <el-option label="深圳" value="深圳" />
        <el-option label="杭州" value="杭州" />
      </el-select>

      <el-select v-model="searchForm.categoryId" placeholder="职位分类" clearable @change="handleSearch">
        <el-option label="全部分类" value="" />
        <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
      </el-select>
    </div>

    <!-- 职位列表 -->
    <div class="job-list" v-loading="loading">
      <el-empty v-if="jobList.length === 0" description="暂无职位" />

      <div v-else class="job-cards">
        <div v-for="job in jobList" :key="job.id" class="job-card" @click="viewDetail(job.id)">
          <div class="job-header">
            <h3 class="title">{{ job.title }}</h3>
            <span class="salary">{{ job.salaryMin }}-{{ job.salaryMax }}K</span>
          </div>
          <div class="job-info">
            <el-tag size="small">{{ job.city }}</el-tag>
            <el-tag size="small" type="info">{{ job.experience }}</el-tag>
            <el-tag size="small" type="info">{{ job.education }}</el-tag>
          </div>
          <div class="company">
            <el-avatar :size="40" :src="job.companyLogo">
              <el-icon><OfficeBuilding /></el-icon>
            </el-avatar>
            <div class="company-info">
              <div class="name">{{ job.companyName }}</div>
            </div>
          </div>
          <div class="job-footer">
            <span class="time">{{ formatTime(job.createTime) }}</span>
            <el-button type="primary" size="small" @click.stop="applyJob(job.id)">投递简历</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, OfficeBuilding } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { Job } from '@/types'
import { getJobList } from '@/api/job'
import moment from 'moment'

const router = useRouter()

const loading = ref(false)
const jobList = ref<Job[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = reactive({
  keyword: '',
  city: '',
  categoryId: ''
})

const categories = ref([
  { id: 1, name: '导游服务' },
  { id: 2, name: '酒店管理' },
  { id: 3, name: '旅行顾问' },
  { id: 4, name: '航空服务' },
  { id: 5, name: '景区运营' },
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

const applyJob = (id: number) => {
  ElMessage.success('投递成功')
}

const formatTime = (time?: string) => {
  return time ? moment(time).fromNow() : ''
}

onMounted(fetchJobs)
</script>

<style scoped lang="scss">
.jobs-page {
  .search-bar {
    max-width: 600px;
    margin: 0 auto 20px;
  }

  .filter-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
  }

  .job-list {
    .job-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }

    .job-card {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: box-shadow 0.3s;

      &:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .job-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .title {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }

        .salary {
          color: #f56c6c;
          font-weight: 600;
        }
      }

      .job-info {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }

      .company {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-top: 16px;
        border-top: 1px solid #ebeef5;

        .name {
          color: #606266;
          font-size: 14px;
        }
      }

      .job-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;

        .time {
          color: #909399;
          font-size: 12px;
        }
      }
    }
  }

  .pagination {
    margin-top: 32px;
    display: flex;
    justify-content: center;
  }
}
</style>
