<template>
  <div class="job-manage-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>职位管理</span>
          <el-button type="primary" @click="showAddDialog">发布职位</el-button>
        </div>
      </template>

      <el-empty v-if="!jobList.length && !loading" description="暂无职位" />

      <div v-else v-loading="loading">
        <el-table :data="jobList" style="width: 100%">
          <el-table-column prop="title" label="职位名称" min-width="150" />
          <el-table-column label="薪资" width="120">
            <template #default="{ row }">
              {{ row.salaryMin }}-{{ row.salaryMax }}K
            </template>
          </el-table-column>
          <el-table-column prop="city" label="城市" width="100" />
          <el-table-column prop="hits" label="浏览量" width="100" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.state === 1 ? 'success' : 'info'">
                {{ row.state === 1 ? '招聘中' : '已下架' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发布时间" width="180">
            <template #default="{ row }">
              {{ formatTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="editJob(row)">编辑</el-button>
              <el-button type="primary" link @click="toggleState(row)">
                {{ row.state === 1 ? '下架' : '上架' }}
              </el-button>
              <el-button type="danger" link @click="deleteJob(row.id)">删除</el-button>
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

    <!-- 职位编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑职位' : '发布职位'" width="700px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="职位名称" required>
          <el-input v-model="form.title" placeholder="请输入职位名称" />
        </el-form-item>
        <el-form-item label="职位分类" required>
          <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="薪资范围" required>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-input-number v-model="form.salaryMin" :min="1" :max="100" style="width: 100%" placeholder="最低" />
            </el-col>
            <el-col :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-input-number v-model="form.salaryMax" :min="1" :max="100" style="width: 100%" placeholder="最高" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="工作地点" required>
          <el-select v-model="form.city" placeholder="请选择城市" style="width: 100%">
            <el-option label="北京" value="北京" />
            <el-option label="上海" value="上海" />
            <el-option label="广州" value="广州" />
            <el-option label="深圳" value="深圳" />
            <el-option label="杭州" value="杭州" />
          </el-select>
        </el-form-item>
        <el-form-item label="经验要求" required>
          <el-select v-model="form.experience" placeholder="请选择" style="width: 100%">
            <el-option label="应届生" value="应届生" />
            <el-option label="1年以内" value="1年以内" />
            <el-option label="1-3年" value="1-3年" />
            <el-option label="3-5年" value="3-5年" />
            <el-option label="5-10年" value="5-10年" />
            <el-option label="10年以上" value="10年以上" />
          </el-select>
        </el-form-item>
        <el-form-item label="学历要求" required>
          <el-select v-model="form.education" placeholder="请选择" style="width: 100%">
            <el-option label="高中及以下" value="高中及以下" />
            <el-option label="大专" value="大专" />
            <el-option label="本科" value="本科" />
            <el-option label="硕士" value="硕士" />
            <el-option label="博士" value="博士" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位描述" required>
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入职位描述" />
        </el-form-item>
        <el-form-item label="职位要求" required>
          <el-input v-model="form.requirement" type="textarea" :rows="4" placeholder="请输入职位要求" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveJob">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Job } from '@/types'
import { getJobList } from '@/api/job'
import request from '@/utils/request'
import moment from 'moment'

const loading = ref(false)
const jobList = ref<Job[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)

const categories = ref([
  { id: 1, name: '导游服务' },
  { id: 2, name: '酒店管理' },
  { id: 3, name: '旅行顾问' },
  { id: 4, name: '航空服务' },
  { id: 5, name: '景区运营' },
])

const form = reactive({
  id: 0,
  title: '',
  categoryId: null as number | null,
  salaryMin: 5,
  salaryMax: 10,
  city: '',
  experience: '',
  education: '',
  description: '',
  requirement: ''
})

const formatTime = (time?: string) => {
  return time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
}

const fetchJobs = async () => {
  loading.value = true
  try {
    const res = await request.get('/recruit/position/my', {
      params: { page: page.value, size: pageSize.value }
    })
    jobList.value = res.list
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取职位列表失败')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchJobs()
}

const handlePageChange = (val: number) => {
  page.value = val
  fetchJobs()
}

const showAddDialog = () => {
  isEdit.value = false
  form.id = 0
  form.title = ''
  form.categoryId = null
  form.salaryMin = 5
  form.salaryMax = 10
  form.city = ''
  form.experience = ''
  form.education = ''
  form.description = ''
  form.requirement = ''
  dialogVisible.value = true
}

const editJob = (job: Job) => {
  isEdit.value = true
  Object.assign(form, job)
  dialogVisible.value = true
}

const saveJob = async () => {
  if (!form.title || !form.categoryId || !form.city || !form.experience || !form.education || !form.description || !form.requirement) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    if (isEdit.value) {
      await request.put('/recruit/position', form)
    } else {
      await request.post('/recruit/position', form)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetchJobs()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const toggleState = async (job: Job) => {
  try {
    const newState = job.state === 1 ? 0 : 1
    await request.put(`/recruit/position/state/${job.id}`, { state: newState })
    ElMessage.success('操作成功')
    fetchJobs()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const deleteJob = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定删除该职位吗？', '提示', { type: 'warning' })
    await request.delete(`/recruit/position/${id}`)
    ElMessage.success('删除成功')
    fetchJobs()
  } catch {
    // 取消删除
  }
}

onMounted(fetchJobs)
</script>

<style scoped lang="scss">
.job-manage-page {
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
