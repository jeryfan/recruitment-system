<template>
  <div class="admin-profile">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>管理员个人中心</span>
          <el-tag type="danger">超级管理员</el-tag>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="info">
          <el-form :model="form" label-width="100px" class="profile-form">
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
              >
                <el-avatar v-if="form.avatar" :size="80" :src="form.avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>

            <el-form-item label="用户名">
              <el-input v-model="form.username" disabled />
            </el-form-item>

            <el-form-item label="昵称">
              <el-input v-model="form.nickname" />
            </el-form-item>

            <el-form-item label="手机号">
              <el-input v-model="form.phone" />
            </el-form-item>

            <el-form-item label="邮箱">
              <el-input v-model="form.email" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="saveProfile">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="修改密码" name="password">
          <el-form :model="passwordForm" :rules="passwordRules" label-width="120px" class="profile-form">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input v-model="passwordForm.oldPassword" type="password" show-password />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" type="password" show-password />
            </el-form-item>

            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="changePassword">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="系统设置" name="settings">
          <el-form label-width="150px" class="profile-form">
            <el-form-item label="网站名称">
              <el-input v-model="settings.siteName" />
            </el-form-item>

            <el-form-item label="网站Logo">
              <el-input v-model="settings.logo" />
            </el-form-item>

            <el-form-item label="客服电话">
              <el-input v-model="settings.servicePhone" />
            </el-form-item>

            <el-form-item label="版权信息">
              <el-input v-model="settings.copyright" type="textarea" :rows="2" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="saveSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'

const route = useRoute()
const userStore = useUserStore()

const activeTab = ref('info')

const form = ref({
  avatar: '',
  username: '',
  nickname: '',
  phone: '',
  email: ''
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const settings = ref({
  siteName: '旅游行业招聘系统',
  logo: '',
  servicePhone: '400-888-8888',
  copyright: '© 2024 旅游招聘 版权所有'
})

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

onMounted(() => {
  if (route.query.tab) {
    activeTab.value = route.query.tab as string
  }

  if (userStore.userInfo) {
    form.value = {
      avatar: userStore.userInfo.avatar || '',
      username: userStore.userInfo.username || '',
      nickname: userStore.userInfo.nickname || '',
      phone: userStore.userInfo.phone || '',
      email: userStore.userInfo.email || ''
    }
  }
})

const handleAvatarSuccess = (res: any) => {
  form.value.avatar = res.url
  ElMessage.success('头像上传成功')
}

const saveProfile = () => {
  ElMessage.success('保存成功')
}

const changePassword = () => {
  ElMessage.success('密码修改成功，请重新登录')
  passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
}

const saveSettings = () => {
  ElMessage.success('系统设置保存成功')
}
</script>

<style scoped lang="scss">
.admin-profile {
  max-width: 800px;
  margin: 0 auto;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }

  .profile-form {
    padding: 20px;

    .avatar-uploader {
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        border: 1px dashed #d9d9d9;
        border-radius: 50%;
        cursor: pointer;

        &:hover {
          border-color: #409eff;
        }
      }
    }
  }
}
</style>
