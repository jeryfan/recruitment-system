<template>
  <div class="companies-page">
    <!-- 页面头部 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">探索优质企业</h1>
        <p class="hero-sub">旅游行业 <strong>{{ total }}</strong> 家认证企业，找到你的理想雇主</p>

        <div class="hero-search">
          <div class="search-wrap">
            <el-icon class="search-icon"><Search /></el-icon>
            <input
              v-model="searchKeyword"
              class="search-input-inner"
              placeholder="搜索企业名称..."
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">搜索</button>
          </div>
        </div>
      </div>
      <div class="hero-deco">
        <el-icon size="120" color="rgba(255,255,255,0.06)"><OfficeBuilding /></el-icon>
      </div>
    </div>

    <!-- 企业列表 -->
    <div class="company-list" v-loading="loading">
      <el-empty v-if="companyList.length === 0 && !loading" description="暂无企业" />

      <div v-else class="company-grid">
        <div
          v-for="company in companyList"
          :key="company.id"
          class="company-card"
          @click="viewDetail(company.id)"
        >
          <!-- Logo + 认证标志 -->
          <div class="cc-head">
            <el-avatar :size="64" :src="company.logo" shape="square" class="cc-logo">
              <el-icon size="28"><OfficeBuilding /></el-icon>
            </el-avatar>
            <div class="cc-cert" v-if="company.state === 1">
              <el-icon size="11"><Select /></el-icon>
              已认证
            </div>
          </div>

          <!-- 公司信息 -->
          <div class="cc-body">
            <h3 class="cc-name">{{ company.name }}</h3>
            <p class="cc-city">
              <el-icon size="12"><Location /></el-icon>
              {{ company.city || '未知城市' }}
            </p>
            <p class="cc-desc" v-if="company.mission || company.description">
              {{ truncate(company.mission || company.description, 55) }}
            </p>
            <p class="cc-desc placeholder" v-else>暂无公司介绍</p>
          </div>

          <!-- 底部标签 + 箭头 -->
          <div class="cc-foot">
            <div class="cc-tags">
              <span class="cc-tag hot">热招中</span>
              <span class="cc-tag foreign" v-if="company.foreignName">跨国</span>
            </div>
            <span class="cc-arrow">查看职位 →</span>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, OfficeBuilding, Location, Select } from '@element-plus/icons-vue'
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
      state: 1,
      keyword: searchKeyword.value || undefined
    })
    companyList.value = res.list
    total.value = res.total
  } catch {
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
  router.push({ path: '/jobs', query: { companyId: String(id) } })
}

const truncate = (text: string, len: number) => {
  if (!text) return ''
  return text.length > len ? text.slice(0, len) + '...' : text
}

onMounted(fetchCompanies)
</script>

<style scoped lang="scss">
.companies-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

/* ——— Hero ——— */
.hero-section {
  background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%);
  border-radius: 20px;
  padding: 52px 48px 44px;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40px; right: 120px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(52,211,153,0.18) 0%, transparent 70%);
    border-radius: 50%;
  }

  .hero-content {
    flex: 1;
    position: relative;
    z-index: 1;
  }

  .hero-deco {
    flex-shrink: 0;
    margin-left: 24px;
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
    strong { color: #6ee7b7; font-weight: 600; }
  }
}

/* 搜索框 */
.hero-search {
  .search-wrap {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 12px;
    padding: 6px 6px 6px 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    max-width: 560px;

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

    .search-btn {
      background: linear-gradient(135deg, #059669, #047857);
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
        background: linear-gradient(135deg, #047857, #065f46);
        transform: translateY(-1px);
      }
    }
  }
}

/* ——— 企业卡片网格 ——— */
.company-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}

.company-card {
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  gap: 0;

  &:hover {
    border-color: #059669;
    box-shadow: 0 8px 28px rgba(5,150,105,0.12);
    transform: translateY(-3px);

    .cc-name { color: #059669; }
    .cc-arrow { color: #059669; transform: translateX(3px); }
  }

  /* 头部：logo + 认证 */
  .cc-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;

    .cc-logo {
      border-radius: 12px;
      border: 1.5px solid #e5e7eb;
    }

    .cc-cert {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 4px 10px;
      background: #ecfdf5;
      color: #059669;
      font-size: 12px;
      font-weight: 500;
      border-radius: 20px;
      border: 1px solid #a7f3d0;
    }
  }

  /* 主体 */
  .cc-body {
    flex: 1;
    margin-bottom: 16px;

    .cc-name {
      font-size: 17px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: color 0.2s;
    }

    .cc-city {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #6b7280;
      margin: 0 0 10px;
    }

    .cc-desc {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.6;
      margin: 0;
      min-height: 42px;

      &.placeholder { color: #d1d5db; font-style: italic; }
    }
  }

  /* 底部 */
  .cc-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 14px;
    border-top: 1px solid #f3f4f6;

    .cc-tags {
      display: flex;
      gap: 6px;

      .cc-tag {
        padding: 3px 9px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;

        &.hot {
          background: #fef3c7;
          color: #d97706;
        }

        &.foreign {
          background: #eff6ff;
          color: #3b82f6;
        }
      }
    }

    .cc-arrow {
      font-size: 13px;
      color: #9ca3af;
      transition: all 0.2s;
      display: inline-block;
    }
  }
}

.pagination-wrapper {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

/* ——— 响应式 ——— */
@media (max-width: 768px) {
  .companies-page { padding: 0 12px 40px; }

  .hero-section {
    padding: 32px 20px 28px;
    .hero-deco { display: none; }
    .hero-title { font-size: 24px; }
    .search-wrap { max-width: 100%; }
  }

  .company-grid { grid-template-columns: 1fr; }
}
</style>
