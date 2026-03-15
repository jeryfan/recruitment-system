<template>
  <div class="home-page">
    <el-carousel height="400px" class="banner">
      <el-carousel-item v-for="(img, index) in banners" :key="index">
        <img :src="img" class="banner-img" />
      </el-carousel-item>
    </el-carousel>

    <div class="search-section">
      <el-input v-model="searchKeyword" placeholder="搜索职位、公司" size="large" @keyup.enter="handleSearch">
        <template #append>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </template>
      </el-input>

      <div class="hot-tags">
        <span>热门搜索：</span>
        <el-tag v-for="tag in hotTags" :key="tag" @click="searchKeyword = tag; handleSearch()">
          {{ tag }}
        </el-tag>
      </div>
    </div>

    <div class="job-section">
      <h2>热门职位</h2>
      <el-row :gutter="20">
        <el-col v-for="job in jobList" :key="job.id" :xs="24" :sm="12" :md="8" :lg="6">
          <div class="job-card" @click="goToDetail(job.id)">
            <h3>{{ job.title }}</h3>
            <p>{{ job.companyName }}</p>
            <p>{{ job.salaryMin }}-{{ job.salaryMax }}K</p>
            <p>{{ job.city }}</p>
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

const router = useRouter()

const banners = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=400&fit=crop',
]

const hotTags = ['导游', '酒店经理', '旅行顾问', '空乘', '景区讲解员']
const searchKeyword = ref('')
const jobList = ref<Job[]>([])

const fetchJobs = async () => {
  const res = await getJobList({ page: 1, size: 8 })
  jobList.value = res.list
}

const handleSearch = () => {
  router.push({ path: '/jobs', query: { keyword: searchKeyword.value } })
}

const goToDetail = (id: number) => {
  router.push(`/jobs/${id}`)
}

onMounted(fetchJobs)
</script>

<style scoped lang="scss">
.home-page {
  .banner {
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 32px;

    .banner-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .search-section {
    background: #fff;
    padding: 32px;
    border-radius: 8px;
    margin-bottom: 32px;

    .hot-tags {
      margin-top: 16px;

      .el-tag {
        margin-right: 8px;
        cursor: pointer;
      }
    }
  }

  .job-section {
    .job-card {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      cursor: pointer;
      transition: box-shadow 0.3s;

      &:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
