<template>
  <div class="admin-companies">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>企业审核</span>
          <div class="header-actions">
            <el-select v-model="filterState" placeholder="筛选状态" clearable @change="handleFilter" style="width: 120px; margin-right: 12px">
              <el-option label="全部" value="" />
              <el-option label="待审核" :value="0" />
              <el-option label="已通过" :value="1" />
              <el-option label="未通过" :value="2" />
            </el-select>
          </div>
        </div>
      </template>

      <el-empty v-if="!companyList.length && !loading" description="暂无企业" />

      <div v-else v-loading="loading">
        <el-table :data="companyList" style="width: 100%">
          <el-table-column type="index" width="60" label="序号" />
          <el-table-column label="Logo" width="80">
            <template #default="{ row }">
              <el-avatar :size="50" :src="row.logo">
                <el-icon><OfficeBuilding /></el-icon>
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="企业名称" min-width="150" />
          <el-table-column prop="city" label="城市" width="100" />
          <el-table-column prop="mission" label="企业使命" min-width="200" show-overflow-tooltip />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStateType(row.state)">
                {{ getStateText(row.state) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" width="180">
            <template #default="{ row }">
              {{ formatTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="viewDetail(row)">查看</el-button>
              <template v-if="row.state === 0">
                <el-button type="success" link @click="auditCompany(row.id, 1)">通过</el-button>
                <el-button type="danger" link @click="auditCompany(row.id, 2)">拒绝</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>

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
    </el-card>

    <!-- 企业详情弹窗 -->
    <el-dialog v-model="detailVisible" title="企业详情" width="600px">
      <div v-if="selectedCompany" class="company-detail">
        <div class="logo-section">
          <el-avatar :size="80" :src="selectedCompany.logo">
            <el-icon size="40"><OfficeBuilding /></el-icon>
          </el-avatar>
        </div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="企业名称">{{ selectedCompany.name }}</el-descriptions-item>
          <el-descriptions-item label="外文名称">{{ selectedCompany.foreignName || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="所在城市">{{ selectedCompany.city }}</el-descriptions-item>
          <el-descriptions-item label="企业使命">{{ selectedCompany.mission || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="企业简介">{{ selectedCompany.description }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <template v-if="selectedCompany?.state === 0">
          <el-button type="danger" @click="auditAndClose(selectedCompany?.id, 2)">拒绝</el-button>
          <el-button type="success" @click="auditAndClose(selectedCompany?.id, 1)">通过</el-button>
        </template>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { OfficeBuilding } from '@element-plus/icons-vue'
import { getCompanyList, auditCompany } from '@/api/admin'
import moment from 'moment'

const loading = ref(false)
const companyList = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const filterState = ref('')
const detailVisible = ref(false)
const selectedCompany = ref<any>(null)

const getStateText = (state: number) => {
  const map: Record<number, string> = { 0: '待审核', 1: '已通过', 2: '未通过' }
  return map[state] || '未知'
}

const getStateType = (state: number) => {
  const map: Record<number, 'warning' | 'success' | 'danger' | 'info'> = { 0: 'warning', 1: 'success', 2: 'danger' }
  return map[state] || 'info'
}

const formatTime = (time?: string) => {
  return time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
}

const fetchCompanies = async () => {
  loading.value = true
  try {
    const params: any = { page: page.value, size: pageSize.value }
    if (filterState.value !== '') {
      params.state = filterState.value
    }
    const res = await getCompanyList(params)
    companyList.value = res.list
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取企业列表失败')
  } finally {
    loading.value = false
  }
}

const handleFilter = () => {
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

const viewDetail = (company: any) => {
  selectedCompany.value = company
  detailVisible.value = true
}

const auditCompanyFn = async (id: number, state: number) => {
  const actionText = state === 1 ? '通过' : '拒绝'
  try {
    await ElMessageBox.confirm(`确定${actionText}该企业吗？`, '提示', { type: 'warning' })
    await auditCompany(id, state)
    ElMessage.success('操作成功')
    fetchCompanies()
  } catch {
    // 取消操作
  }
}

const auditAndClose = async (id: number | undefined, state: number) => {
  if (!id) return
  try {
    await auditCompany(id, state)
    ElMessage.success('操作成功')
    detailVisible.value = false
    fetchCompanies()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

onMounted(fetchCompanies)
</script>

<style scoped lang="scss">
.admin-companies {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.company-detail {
  .logo-section {
    text-align: center;
    margin-bottom: 24px;
  }
}
</style>
