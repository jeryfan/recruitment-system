<template>
  <div class="resume-page">
    <!-- 基本信息卡片 -->
    <el-card class="resume-card">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
          <el-button type="primary" @click="editBasic">
            {{ isEditingBasic ? '保存' : '编辑' }}
          </el-button>
        </div>
      </template>

      <el-form v-if="isEditingBasic" :model="basicForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="真实姓名" required>
              <el-input v-model="basicForm.realName" placeholder="请输入真实姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" required>
              <el-radio-group v-model="basicForm.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号" required>
              <el-input v-model="basicForm.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" required>
              <el-input v-model="basicForm.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出生日期">
              <el-date-picker v-model="basicForm.birthday" type="date" placeholder="选择日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在城市">
              <el-input v-model="basicForm.city" placeholder="请输入所在城市" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="求职意向">
          <el-input v-model="basicForm.jobIntention" placeholder="请输入期望职位" />
        </el-form-item>
        <el-form-item label="自我评价">
          <el-input v-model="basicForm.selfEvaluation" type="textarea" :rows="4" placeholder="请输入自我评价" />
        </el-form-item>
      </el-form>

      <div v-else class="basic-info">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <span class="label">姓名：</span>
              <span class="value">{{ resume?.realName || '未填写' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">性别：</span>
              <span class="value">{{ resume?.gender === 1 ? '男' : resume?.gender === 0 ? '女' : '未填写' }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <span class="label">手机号：</span>
              <span class="value">{{ resume?.phone || '未填写' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">邮箱：</span>
              <span class="value">{{ resume?.email || '未填写' }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <span class="label">出生日期：</span>
              <span class="value">{{ resume?.birthday || '未填写' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">所在城市：</span>
              <span class="value">{{ resume?.city || '未填写' }}</span>
            </div>
          </el-col>
        </el-row>
        <div class="info-item">
          <span class="label">求职意向：</span>
          <span class="value">{{ resume?.jobIntention || '未填写' }}</span>
        </div>
        <div class="info-item">
          <span class="label">自我评价：</span>
          <span class="value">{{ resume?.selfEvaluation || '未填写' }}</span>
        </div>
      </div>
    </el-card>

    <!-- 教育经历 -->
    <el-card class="resume-card">
      <template #header>
        <div class="card-header">
          <span>教育经历</span>
          <el-button type="primary" @click="showEduDialog">添加</el-button>
        </div>
      </template>

      <el-empty v-if="!resume?.educations?.length" description="暂无教育经历" />
      <div v-else class="timeline-list">
        <div v-for="edu in resume.educations" :key="edu.id" class="timeline-item">
          <div class="timeline-header">
            <h4>{{ edu.schoolName }}</h4>
            <div class="actions">
              <el-button type="primary" link @click="editEducation(edu)">编辑</el-button>
              <el-button type="danger" link @click="handleDeleteEdu(edu.id)">删除</el-button>
            </div>
          </div>
          <div class="timeline-content">
            <p>{{ edu.major }} · {{ diplomaMap[edu.diploma] }}</p>
            <p class="time">{{ edu.startTime }} 至 {{ edu.endTime || '至今' }}</p>
            <p v-if="edu.description" class="description">{{ edu.description }}</p>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 工作经历 -->
    <el-card class="resume-card">
      <template #header>
        <div class="card-header">
          <span>工作经历</span>
          <el-button type="primary" @click="showExpDialog">添加</el-button>
        </div>
      </template>

      <el-empty v-if="!resume?.experiences?.length" description="暂无工作经历" />
      <div v-else class="timeline-list">
        <div v-for="exp in resume.experiences" :key="exp.id" class="timeline-item">
          <div class="timeline-header">
            <h4>{{ exp.companyName }}</h4>
            <div class="actions">
              <el-button type="primary" link @click="editExperience(exp)">编辑</el-button>
              <el-button type="danger" link @click="handleDeleteExp(exp.id)">删除</el-button>
            </div>
          </div>
          <div class="timeline-content">
            <p>{{ exp.position }}</p>
            <p class="time">{{ exp.startTime }} 至 {{ exp.endTime || '至今' }}</p>
            <p v-if="exp.performance" class="description">{{ exp.performance }}</p>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 教育经历弹窗 -->
    <el-dialog v-model="eduDialogVisible" title="教育经历" width="600px">
      <el-form :model="eduForm" label-width="100px">
        <el-form-item label="学校名称" required>
          <el-input v-model="eduForm.schoolName" placeholder="请输入学校名称" />
        </el-form-item>
        <el-form-item label="专业" required>
          <el-input v-model="eduForm.major" placeholder="请输入专业" />
        </el-form-item>
        <el-form-item label="学历" required>
          <el-select v-model="eduForm.diploma" placeholder="请选择学历" style="width: 100%">
            <el-option label="高中及以下" :value="0" />
            <el-option label="大专" :value="1" />
            <el-option label="本科" :value="2" />
            <el-option label="硕士" :value="3" />
            <el-option label="博士" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="在校时间" required>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-date-picker v-model="eduForm.startTime" type="month" placeholder="开始时间" style="width: 100%" />
            </el-col>
            <el-col :span="2" style="text-align: center">至</el-col>
            <el-col :span="11">
              <el-date-picker v-model="eduForm.endTime" type="month" placeholder="结束时间" style="width: 100%" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="在校经历">
          <el-input v-model="eduForm.description" type="textarea" :rows="3" placeholder="描述在校经历、获奖情况等" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="eduDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEducation">保存</el-button>
      </template>
    </el-dialog>

    <!-- 工作经历弹窗 -->
    <el-dialog v-model="expDialogVisible" title="工作经历" width="600px">
      <el-form :model="expForm" label-width="100px">
        <el-form-item label="公司名称" required>
          <el-input v-model="expForm.companyName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="职位" required>
          <el-input v-model="expForm.position" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="工作时间" required>
          <el-row :gutter="10">
            <el-col :span="11">
              <el-date-picker v-model="expForm.startTime" type="month" placeholder="开始时间" style="width: 100%" />
            </el-col>
            <el-col :span="2" style="text-align: center">至</el-col>
            <el-col :span="11">
              <el-date-picker v-model="expForm.endTime" type="month" placeholder="结束时间" style="width: 100%" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="工作业绩">
          <el-input v-model="expForm.performance" type="textarea" :rows="3" placeholder="描述工作内容和业绩" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="expDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveExperience">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Resume, Education, Experience } from '@/types'
import { getMyResume, createResume, updateResume, addEducation, updateEducation, deleteEducation, addExperience, updateExperience, deleteExperience } from '@/api/resume'

const loading = ref(false)
const resume = ref<Resume | null>(null)
const isEditingBasic = ref(false)

const diplomaMap: Record<number, string> = {
  0: '高中及以下',
  1: '大专',
  2: '本科',
  3: '硕士',
  4: '博士'
}

const basicForm = reactive({
  id: 0,
  realName: '',
  gender: 1,
  phone: '',
  email: '',
  birthday: '',
  city: '',
  jobIntention: '',
  selfEvaluation: ''
})

const eduDialogVisible = ref(false)
const eduForm = reactive({
  id: 0,
  schoolName: '',
  major: '',
  diploma: 2,
  startTime: '',
  endTime: '',
  description: ''
})

const expDialogVisible = ref(false)
const expForm = reactive({
  id: 0,
  companyName: '',
  position: '',
  startTime: '',
  endTime: '',
  performance: ''
})

const fetchResume = async () => {
  loading.value = true
  try {
    const data = await getMyResume()
    resume.value = data
    // 填充表单
    Object.assign(basicForm, data)
  } catch (error) {
    // 如果没有简历，创建一个空的
    resume.value = {
      id: 0,
      userId: 0,
      realName: '',
      gender: 1,
      phone: '',
      email: '',
      educations: [],
      experiences: []
    }
  } finally {
    loading.value = false
  }
}

const editBasic = async () => {
  if (isEditingBasic.value) {
    // 保存
    try {
      if (basicForm.id) {
        await updateResume(basicForm)
      } else {
        await createResume(basicForm)
        // Fetch to get the actual new resume ID from backend
        const fresh = await getMyResume()
        basicForm.id = fresh.id
      }
      ElMessage.success('保存成功')
      fetchResume()
    } catch (error) {
      ElMessage.error('保存失败')
      return
    }
  }
  isEditingBasic.value = !isEditingBasic.value
}

const showEduDialog = () => {
  eduForm.id = 0
  eduForm.schoolName = ''
  eduForm.major = ''
  eduForm.diploma = 2
  eduForm.startTime = ''
  eduForm.endTime = ''
  eduForm.description = ''
  eduDialogVisible.value = true
}

const editEducation = (edu: Education) => {
  Object.assign(eduForm, edu)
  eduDialogVisible.value = true
}

const saveEducation = async () => {
  if (!eduForm.schoolName || !eduForm.major) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    if (eduForm.id) {
      await updateEducation(eduForm.id, eduForm)
    } else {
      if (!resume.value?.id) {
        ElMessage.warning('请先创建简历')
        return
      }
      await addEducation(eduForm, resume.value.id)
    }
    ElMessage.success('保存成功')
    eduDialogVisible.value = false
    fetchResume()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const handleDeleteEdu = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定删除这条教育经历吗？', '提示', { type: 'warning' })
    await deleteEducation(id)
    ElMessage.success('删除成功')
    fetchResume()
  } catch {
    // 取消删除
  }
}

const showExpDialog = () => {
  expForm.id = 0
  expForm.companyName = ''
  expForm.position = ''
  expForm.startTime = ''
  expForm.endTime = ''
  expForm.performance = ''
  expDialogVisible.value = true
}

const editExperience = (exp: Experience) => {
  Object.assign(expForm, exp)
  expDialogVisible.value = true
}

const saveExperience = async () => {
  if (!expForm.companyName || !expForm.position) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    if (expForm.id) {
      await updateExperience(expForm.id, expForm)
    } else {
      if (!resume.value?.id) {
        ElMessage.warning('请先创建简历')
        return
      }
      await addExperience(expForm, resume.value.id)
    }
    ElMessage.success('保存成功')
    expDialogVisible.value = false
    fetchResume()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const handleDeleteExp = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定删除这条工作经历吗？', '提示', { type: 'warning' })
    await deleteExperience(id)
    ElMessage.success('删除成功')
    fetchResume()
  } catch {
    // 取消删除
  }
}

onMounted(fetchResume)
</script>

<style scoped lang="scss">
.resume-page {
  max-width: 900px;
  margin: 0 auto;
}

.resume-card {
  margin-bottom: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }
}

.basic-info {
  .info-item {
    margin-bottom: 16px;
    line-height: 1.6;

    .label {
      color: #909399;
    }

    .value {
      color: #303133;
    }
  }
}

.timeline-list {
  .timeline-item {
    padding: 16px 0;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
      border-bottom: none;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      h4 {
        margin: 0;
        color: #303133;
      }
    }

    .timeline-content {
      p {
        margin: 4px 0;
        color: #606266;
      }

      .time {
        color: #909399;
        font-size: 13px;
      }

      .description {
        color: #606266;
        margin-top: 8px;
      }
    }
  }
}
</style>
