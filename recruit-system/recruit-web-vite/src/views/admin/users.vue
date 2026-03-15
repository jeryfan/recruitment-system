<template>
  <div class="admin-users">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <div class="header-actions">
            <el-input v-model="searchKeyword" placeholder="搜索用户名/昵称" clearable @keyup.enter="handleSearch" style="width: 200px; margin-right: 12px">
              <template #append>
                <el-button @click="handleSearch">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <el-empty v-if="!userList.length && !loading" description="暂无用户" />

      <div v-else v-loading="loading">
        <el-table :data="userList" style="width: 100%">
          <el-table-column type="index" width="60" label="序号" />
          <el-table-column prop="username" label="用户名" min-width="120" />
          <el-table-column prop="nickname" label="昵称" min-width="120" />
          <el-table-column label="角色" width="100">
            <template #default="{ row }">
              <el-tag :type="getRoleType(row.groups)">
                {{ getRoleText(row.groups) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" min-width="180" />
          <el-table-column prop="phone" label="手机号" min-width="120" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.state === 1 ? 'success' : 'danger'">
                {{ row.state === 1 ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="注册时间" width="180">
            <template #default="{ row }">
              {{ formatTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="toggleUserState(row)">
                {{ row.state === 1 ? '禁用' : '启用' }}
              </el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getUserList, updateUserState } from '@/api/admin'
import moment from 'moment'

const loading = ref(false)
const userList = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')

const getRoleText = (groups?: Array<{ name: string }>) => {
  if (!groups || groups.length === 0) return '用户'
  const name = groups[0].name.toLowerCase()
  if (name.includes('admin')) return '管理员'
  if (name.includes('hr')) return 'HR'
  return '用户'
}

const getRoleType = (groups?: Array<{ name: string }>) => {
  if (!groups || groups.length === 0) return ''
  const name = groups[0].name.toLowerCase()
  if (name.includes('admin')) return 'danger'
  if (name.includes('hr')) return 'warning'
  return ''
}

const formatTime = (time?: string) => {
  return time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await getUserList({
      page: page.value,
      size: pageSize.value,
      keyword: searchKeyword.value
    })
    userList.value = res.list
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  fetchUsers()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchUsers()
}

const handlePageChange = (val: number) => {
  page.value = val
  fetchUsers()
}

const toggleUserState = async (row: any) => {
  const newState = row.state === 1 ? 0 : 1
  const actionText = newState === 1 ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(`确定${actionText}该用户吗？`, '提示', { type: 'warning' })
    await updateUserState(row.id, newState)
    ElMessage.success('操作成功')
    fetchUsers()
  } catch {
    // 取消操作
  }
}

onMounted(fetchUsers)
</script>

<style scoped lang="scss">
.admin-users {
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
</style>
