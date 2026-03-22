<template>
  <div class="company-manage-page">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>企业信息</span>
          <el-button v-if="!isEditing" type="primary" @click="startEdit">编辑</el-button>
          <div v-else>
            <el-button @click="cancelEdit">取消</el-button>
            <el-button type="primary" @click="saveCompany">保存</el-button>
          </div>
        </div>
      </template>

      <div v-if="company?.state === 0" class="audit-tip">
        <el-alert title="企业信息正在审核中，审核通过后才能发布职位" type="warning" show-icon :closable="false" />
      </div>

      <div v-if="company?.state === 2" class="audit-tip">
        <el-alert title="企业信息审核未通过，请修改后重新提交" type="error" show-icon :closable="false" />
      </div>

      <el-form v-if="isEditing" :model="form" label-width="120px">
        <el-form-item label="企业Logo">
          <el-upload
            class="avatar-uploader"
            action="#"
            :auto-upload="false"
            :on-change="handleLogoChange"
            :show-file-list="false"
          >
            <img v-if="form.logo" :src="form.logo" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="企业名称" required>
          <el-input v-model="form.name" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="外文名称">
          <el-input v-model="form.foreignName" placeholder="请输入外文名称（如有）" />
        </el-form-item>
        <el-form-item label="所在城市" required>
          <el-select v-model="form.city" placeholder="请选择城市">
            <el-option label="北京" value="北京" />
            <el-option label="上海" value="上海" />
            <el-option label="广州" value="广州" />
            <el-option label="深圳" value="深圳" />
            <el-option label="杭州" value="杭州" />
          </el-select>
        </el-form-item>
        <el-form-item label="企业使命">
          <el-input v-model="form.mission" placeholder="请输入企业使命" />
        </el-form-item>
        <el-form-item label="企业简介" required>
          <el-input v-model="form.description" type="textarea" :rows="5" placeholder="请输入企业简介" />
        </el-form-item>
      </el-form>

      <div v-else class="company-info">
        <div class="logo-section">
          <el-avatar :size="100" :src="company?.logo">
            <el-icon><OfficeBuilding /></el-icon>
          </el-avatar>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="企业名称">{{ company?.name || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="外文名称">{{ company?.foreignName || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="所在城市">{{ company?.city || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="审核状态">
            <el-tag :type="getStateType(company?.state)">{{ getStateText(company?.state) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="企业使命" :span="2">{{ company?.mission || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="企业简介" :span="2">{{ company?.description || '未填写' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, OfficeBuilding } from '@element-plus/icons-vue'
import type { Company } from '@/types'
import { getMyCompany, createCompany, updateCompany, uploadLogo } from '@/api/company'

const loading = ref(false)
const isEditing = ref(false)
const company = ref<Company | null>(null)

const form = reactive({
  id: 0,
  name: '',
  foreignName: '',
  city: '',
  logo: '',
  mission: '',
  description: ''
})

const getStateText = (state?: number) => {
  const map: Record<number, string> = { 0: '审核中', 1: '已通过', 2: '未通过' }
  return map[state ?? 0] || '未知'
}

const getStateType = (state?: number) => {
  const map: Record<number, 'warning' | 'success' | 'danger' | 'info'> = { 0: 'warning', 1: 'success', 2: 'danger' }
  return map[state ?? 0] || 'info'
}

const fetchCompany = async () => {
  loading.value = true
  try {
    const data = await getMyCompany()
    company.value = data
    Object.assign(form, data)
  } catch (error) {
    company.value = null
  } finally {
    loading.value = false
  }
}

const startEdit = () => {
  if (company.value) {
    Object.assign(form, company.value)
  }
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
}

const handleLogoChange = async (file: any) => {
  try {
    const res = await uploadLogo(file.raw)
    form.logo = res.url
    ElMessage.success('上传成功')
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

const saveCompany = async () => {
  if (!form.name || !form.city || !form.description) {
    ElMessage.warning('请填写必填项')
    return
  }
  try {
    if (form.id) {
      await updateCompany(form.id, form)
    } else {
      await createCompany(form)
    }
    ElMessage.success('保存成功')
    isEditing.value = false
    fetchCompany()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

onMounted(fetchCompany)
</script>

<style scoped lang="scss">
.company-manage-page {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.audit-tip {
  margin-bottom: 20px;
}

.company-info {
  .logo-section {
    text-align: center;
    margin-bottom: 24px;
  }
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>
