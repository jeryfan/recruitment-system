<template>
  <div class="admin-dashboard">
    <!-- 数据概览卡片 -->
    <div class="stat-cards" v-loading="loading">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon" style="background: #e6f7ff; color: #1890ff;">
          <el-icon size="32"><User /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalUsers }}</div>
          <div class="stat-label">注册用户</div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon" style="background: #f6ffed; color: #52c41a;">
          <el-icon size="32"><OfficeBuilding /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.approvedCompanies }}</div>
          <div class="stat-label">认证企业</div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon" style="background: #fff7e6; color: #fa8c16;">
          <el-icon size="32"><Collection /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalPositions }}</div>
          <div class="stat-label">发布职位</div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon" style="background: #f0f5ff; color: #2f54eb;">
          <el-icon size="32"><Document /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalApplications ?? 0 }}</div>
          <div class="stat-label">投递总数</div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon" style="background: #fff0f6; color: #eb2f96;">
          <el-icon size="32"><Warning /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.pendingCompanies }}</div>
          <div class="stat-label">待审核企业</div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon" style="background: #fffbe6; color: #d48806;">
          <el-icon size="32"><Grid /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalCategories }}</div>
          <div class="stat-label">职位分类</div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 第一行 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 职位分类分布饼图 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span class="chart-title">职位分类分布</span>
          </template>
          <div ref="categoryChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 城市职位分布条形图 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span class="chart-title">城市职位分布 TOP10</span>
          </template>
          <div ref="cityChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 第二行 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 招聘转化漏斗图 -->
      <el-col :span="10">
        <el-card shadow="hover">
          <template #header>
            <span class="chart-title">招聘转化漏斗</span>
          </template>
          <div ref="funnelChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 待办事项 -->
      <el-col :span="14">
        <el-card shadow="hover">
          <template #header>
            <span class="chart-title">待办事项</span>
          </template>
          <div class="todo-list">
            <div class="todo-item" @click="$router.push('/admin/companies')">
              <div class="todo-info">
                <el-icon size="20" color="#f56c6c"><Warning /></el-icon>
                <span class="todo-text">待审核企业</span>
              </div>
              <div class="todo-right">
                <el-badge v-if="stats.pendingCompanies > 0" :value="stats.pendingCompanies" type="danger" />
                <el-tag v-else type="success" size="small">已清空</el-tag>
                <el-button type="primary" link size="small" style="margin-left: 8px;">去处理</el-button>
              </div>
            </div>
            <div class="todo-item" @click="$router.push('/admin/users')">
              <div class="todo-info">
                <el-icon size="20" color="#e6a23c"><UserFilled /></el-icon>
                <span class="todo-text">用户管理</span>
              </div>
              <div class="todo-right">
                <el-tag type="info" size="small">共 {{ stats.totalUsers }} 人</el-tag>
                <el-button type="primary" link size="small" style="margin-left: 8px;">查看</el-button>
              </div>
            </div>
            <div class="todo-item" @click="$router.push('/admin/categories')">
              <div class="todo-info">
                <el-icon size="20" color="#409eff"><Grid /></el-icon>
                <span class="todo-text">职位分类管理</span>
              </div>
              <div class="todo-right">
                <el-tag type="info" size="small">{{ stats.totalCategories }} 个分类</el-tag>
                <el-button type="primary" link size="small" style="margin-left: 8px;">查看</el-button>
              </div>
            </div>
            <div class="todo-item" @click="$router.push('/admin/jobs')">
              <div class="todo-info">
                <el-icon size="20" color="#67c23a"><Collection /></el-icon>
                <span class="todo-text">职位管理</span>
              </div>
              <div class="todo-right">
                <el-tag type="info" size="small">{{ stats.totalPositions }} 个职位</el-tag>
                <el-button type="primary" link size="small" style="margin-left: 8px;">查看</el-button>
              </div>
            </div>
          </div>

          <!-- 系统信息 -->
          <el-divider />
          <div class="system-info">
            <div class="info-row"><span class="info-label">系统版本</span><span class="info-value">v1.0.0</span></div>
            <div class="info-row"><span class="info-label">后端框架</span><span class="info-value">Spring Boot 2.3.3</span></div>
            <div class="info-row"><span class="info-label">前端框架</span><span class="info-value">Vue 3.4 + Element Plus</span></div>
            <div class="info-row"><span class="info-label">数据库</span><span class="info-value">MySQL 8.0</span></div>
            <div class="info-row"><span class="info-label">数据更新时间</span><span class="info-value">{{ updateTime }}</span></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, OfficeBuilding, Collection, Warning, Grid, Document, UserFilled } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import request from '@/utils/request'

const router = useRouter()
const loading = ref(false)
const updateTime = ref('')

const stats = ref<Record<string, number>>({
  totalUsers: 0,
  approvedCompanies: 0,
  totalPositions: 0,
  totalApplications: 0,
  pendingCompanies: 0,
  totalCategories: 0
})

// ECharts 实例
const categoryChartRef = ref<HTMLElement>()
const cityChartRef = ref<HTMLElement>()
const funnelChartRef = ref<HTMLElement>()
let categoryChart: echarts.ECharts | null = null
let cityChart: echarts.ECharts | null = null
let funnelChart: echarts.ECharts | null = null

const fetchStats = async () => {
  try {
    const data = await request.get<Record<string, number>>('/recruit/admin/stats')
    stats.value = data
    updateTime.value = new Date().toLocaleString('zh-CN')
  } catch {
    ElMessage.error('获取统计数据失败')
  }
}

const fetchCategoryChart = async () => {
  try {
    const data = await request.get<{ name: string; value: number }[]>('/recruit/admin/chart/category')
    if (!categoryChartRef.value) return
    categoryChart = echarts.init(categoryChartRef.value)
    categoryChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}个 ({d}%)' },
      legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { fontSize: 12 } },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['38%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
        data: data
      }]
    })
  } catch { /* 静默失败 */ }
}

const fetchCityChart = async () => {
  try {
    const data = await request.get<{ name: string; value: number }[]>('/recruit/admin/chart/city')
    if (!cityChartRef.value) return
    cityChart = echarts.init(cityChartRef.value)
    const names = data.map(d => d.name)
    const values = data.map(d => d.value)
    cityChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '6%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value', minInterval: 1 },
      yAxis: { type: 'category', data: names.reverse(), axisLabel: { fontSize: 12 } },
      series: [{
        type: 'bar',
        data: values.reverse(),
        barMaxWidth: 28,
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#83bff6' },
            { offset: 1, color: '#409eff' }
          ])
        },
        label: { show: true, position: 'right', formatter: '{c}个' }
      }]
    })
  } catch { /* 静默失败 */ }
}

const fetchFunnelChart = async () => {
  try {
    const data = await request.get<{ name: string; value: number }[]>('/recruit/admin/chart/funnel')
    if (!funnelChartRef.value) return
    funnelChart = echarts.init(funnelChartRef.value)
    funnelChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}' },
      series: [{
        type: 'funnel',
        left: '10%', width: '80%',
        min: 0, minSize: '0%', maxSize: '100%',
        sort: 'none',
        gap: 4,
        label: { show: true, position: 'inside', color: '#fff', fontSize: 13 },
        itemStyle: { borderWidth: 0 },
        data: data.map((item, i) => ({
          ...item,
          itemStyle: {
            color: ['#5470c6', '#91cc75', '#fac858', '#ee6666'][i % 4]
          }
        }))
      }]
    })
  } catch { /* 静默失败 */ }
}

const handleResize = () => {
  categoryChart?.resize()
  cityChart?.resize()
  funnelChart?.resize()
}

onMounted(async () => {
  loading.value = true
  await fetchStats()
  loading.value = false
  await nextTick()
  await Promise.all([fetchCategoryChart(), fetchCityChart(), fetchFunnelChart()])
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  categoryChart?.dispose()
  cityChart?.dispose()
  funnelChart?.dispose()
})
</script>

<style scoped lang="scss">
.admin-dashboard {
  padding: 4px 0;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  :deep(.el-card__body) {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stat-info {
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #303133;
      line-height: 1.2;
    }
    .stat-label {
      font-size: 13px;
      color: #909399;
      margin-top: 4px;
    }
  }
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.todo-list {
  .todo-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background 0.2s;
    border-radius: 6px;
    padding: 12px 10px;

    &:hover {
      background: #f5f7fa;
    }

    &:last-child {
      border-bottom: none;
    }

    .todo-info {
      display: flex;
      align-items: center;
      gap: 10px;
      .todo-text {
        font-size: 14px;
        color: #303133;
      }
    }

    .todo-right {
      display: flex;
      align-items: center;
    }
  }
}

.system-info {
  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 13px;
    border-bottom: 1px dashed #f0f0f0;

    &:last-child { border-bottom: none; }

    .info-label { color: #909399; }
    .info-value { color: #303133; font-weight: 500; }
  }
}
</style>
