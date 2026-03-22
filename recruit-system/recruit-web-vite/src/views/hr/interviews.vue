<template>
  <div class="interview-manage-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>面试管理</span>
          <div class="header-actions">
            <el-select v-model="statusFilter" placeholder="全部状态" clearable style="width: 140px" @change="handleFilter">
              <el-option label="全部" value="" />
              <el-option label="待通知" :value="0" />
              <el-option label="已通知/待面试" :value="1" />
              <el-option label="面试通过" :value="2" />
              <el-option label="面试未通过" :value="3" />
            </el-select>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="interviewList"
        stripe
        style="width: 100%"
        empty-text="暂无面试记录"
        row-key="id"
      >
        <el-table-column label="求职者" min-width="120">
          <template #default="{ row }">
            <div class="applicant-cell">
              <el-avatar :size="36">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div>
                <div class="name">{{ row.nickname || '未知' }}</div>
                <div class="sub">{{ row.tel || row.email || '' }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="应聘职位" prop="title" min-width="140" />

        <el-table-column label="面试时间" min-width="140">
          <template #default="{ row }">
            <span v-if="row.time">{{ formatTime(row.time) }}</span>
            <el-text type="info" v-else>待安排</el-text>
          </template>
        </el-table-column>

        <el-table-column label="面试地点" prop="address" min-width="160">
          <template #default="{ row }">
            <span v-if="row.address">{{ row.address }}</span>
            <el-text type="info" v-else>-</el-text>
          </template>
        </el-table-column>

        <el-table-column label="备注" prop="memo" min-width="140">
          <template #default="{ row }">
            <el-tooltip v-if="row.memo" :content="row.memo" placement="top">
              <span class="ellipsis">{{ row.memo }}</span>
            </el-tooltip>
            <el-text type="info" v-else>-</el-text>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="面试评价" min-width="140">
          <template #default="{ row }">
            <el-tooltip v-if="row.comments" :content="row.comments" placement="top">
              <span class="ellipsis">{{ row.comments }}</span>
            </el-tooltip>
            <el-text type="info" v-else>-</el-text>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 0"
              type="primary"
              link
              size="small"
              @click="openNotifyDialog(row)"
            >
              发送面试通知
            </el-button>
            <el-button
              v-if="row.status === 1"
              type="warning"
              link
              size="small"
              @click="openNotifyDialog(row)"
            >
              修改通知
            </el-button>
            <el-button
              v-if="row.status >= 1"
              type="success"
              link
              size="small"
              @click="openResultDialog(row)"
            >
              更新结果
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
    </el-card>

    <!-- 发送面试通知对话框 -->
    <el-dialog
      v-model="notifyDialogVisible"
      :title="notifyForm.id ? '发送/修改面试通知' : '发送面试通知'"
      width="500px"
      @close="resetNotifyForm"
    >
      <el-form :model="notifyForm" :rules="notifyRules" ref="notifyFormRef" label-width="90px">
        <el-form-item label="面试时间" prop="time">
          <el-date-picker
            v-model="notifyForm.time"
            type="datetime"
            placeholder="请选择面试时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="面试地点" prop="address">
          <el-input v-model="notifyForm.address" placeholder="请输入面试地点" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="notifyForm.memo"
            type="textarea"
            :rows="3"
            placeholder="面试注意事项、携带材料等（选填）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="notifyDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitNotify">发送通知</el-button>
      </template>
    </el-dialog>

    <!-- 更新面试结果对话框 -->
    <el-dialog
      v-model="resultDialogVisible"
      title="更新面试结果"
      width="480px"
      @close="resetResultForm"
    >
      <el-form :model="resultForm" label-width="90px">
        <el-form-item label="面试结果">
          <el-radio-group v-model="resultForm.status">
            <el-radio :label="2">面试通过</el-radio>
            <el-radio :label="3">面试未通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="面试评价">
          <el-input
            v-model="resultForm.comments"
            type="textarea"
            :rows="4"
            placeholder="请输入面试评价（选填）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resultDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitResult">保存结果</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import moment from 'moment'
import { getHrInterviews, sendInterviewNotify, updateInterviewResult } from '@/api/interview'

const loading = ref(false)
const submitting = ref(false)
const interviewList = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const statusFilter = ref<number | ''>('')

// 通知表单
const notifyDialogVisible = ref(false)
const notifyFormRef = ref<FormInstance>()
const notifyForm = ref({ id: 0, time: '', address: '', memo: '' })
const notifyRules: FormRules = {
  time: [{ required: true, message: '请选择面试时间', trigger: 'change' }],
  address: [{ required: true, message: '请输入面试地点', trigger: 'blur' }]
}

// 结果表单
const resultDialogVisible = ref(false)
const resultForm = ref({ id: 0, status: 2, comments: '' })

const STATUS_MAP: Record<number, { text: string; type: 'info' | 'warning' | 'success' | 'danger' }> = {
  0: { text: '待通知', type: 'info' },
  1: { text: '待面试', type: 'warning' },
  2: { text: '已通过', type: 'success' },
  3: { text: '未通过', type: 'danger' }
}

const getStatusText = (status: number) => STATUS_MAP[status]?.text || '未知'
const getStatusType = (status: number) => STATUS_MAP[status]?.type || 'info'
const formatTime = (time: string) => moment(time).format('YYYY-MM-DD HH:mm')

const fetchInterviews = async () => {
  loading.value = true
  try {
    const params: any = { page: page.value, size: pageSize.value }
    if (statusFilter.value !== '') params.state = statusFilter.value
    const res = await getHrInterviews(params) as any
    interviewList.value = res.items || []
    total.value = res.total || 0
  } catch {
    ElMessage.error('获取面试列表失败')
  } finally {
    loading.value = false
  }
}

const handleFilter = () => {
  page.value = 1
  fetchInterviews()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchInterviews()
}

const handlePageChange = (val: number) => {
  page.value = val
  fetchInterviews()
}

const openNotifyDialog = (row: any) => {
  notifyForm.value = {
    id: row.id,
    time: row.time || '',
    address: row.address || '',
    memo: row.memo || ''
  }
  notifyDialogVisible.value = true
}

const resetNotifyForm = () => {
  notifyForm.value = { id: 0, time: '', address: '', memo: '' }
}

const submitNotify = async () => {
  if (!notifyFormRef.value) return
  await notifyFormRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      await sendInterviewNotify({
        id: notifyForm.value.id,
        time: notifyForm.value.time,
        address: notifyForm.value.address,
        memo: notifyForm.value.memo
      })
      ElMessage.success('面试通知已发送')
      notifyDialogVisible.value = false
      fetchInterviews()
    } catch {
      ElMessage.error('发送失败，请重试')
    } finally {
      submitting.value = false
    }
  })
}

const openResultDialog = (row: any) => {
  resultForm.value = {
    id: row.id,
    status: row.status === 2 || row.status === 3 ? row.status : 2,
    comments: row.comments || ''
  }
  resultDialogVisible.value = true
}

const resetResultForm = () => {
  resultForm.value = { id: 0, status: 2, comments: '' }
}

const submitResult = async () => {
  submitting.value = true
  try {
    await updateInterviewResult({
      id: resultForm.value.id,
      status: resultForm.value.status,
      comments: resultForm.value.comments
    })
    ElMessage.success('面试结果已更新')
    resultDialogVisible.value = false
    fetchInterviews()
  } catch {
    ElMessage.error('更新失败，请重试')
  } finally {
    submitting.value = false
  }
}

onMounted(fetchInterviews)
</script>

<style scoped lang="scss">
.interview-manage-page {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.applicant-cell {
  display: flex;
  align-items: center;
  gap: 10px;

  .name {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
  }

  .sub {
    font-size: 12px;
    color: #909399;
  }
}

.ellipsis {
  display: inline-block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
</style>
