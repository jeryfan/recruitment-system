<template>
  <div class="hr-profile">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>个人中心</span>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="info">
          <el-form :model="form" label-width="100px" class="profile-form">
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="/recruit/upload/logo"
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

            <el-form-item label="真实姓名">
              <el-input v-model="form.realName" />
            </el-form-item>

            <el-form-item label="手机号">
              <el-input v-model="form.phone" />
            </el-form-item>

            <el-form-item label="邮箱">
              <el-input v-model="form.email" />
            </el-form-item>

            <el-form-item label="所属企业">
              <el-input v-model="form.companyName" disabled />
            </el-form-item>

            <el-form-item label="职位">
              <el-input v-model="form.position" placeholder="如：招聘经理" />
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
import { updateUserInfo, changePassword as changePasswordApi } from '@/api/user'

const route = useRoute()
const userStore = useUserStore()

const activeTab = ref('info')

const form = ref({
  avatar: '',
  username: '',
  nickname: '',
  realName: '',
  phone: '',
  email: '',
  companyName: '',
  position: ''
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
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
  // 如果有tab参数，切换到对应tab
  if (route.query.tab) {
    activeTab.value = route.query.tab as string
  }

  // 加载用户信息
  if (userStore.userInfo) {
    form.value = {
      avatar: userStore.userInfo.avatar || '',
      username: userStore.userInfo.username || '',
      nickname: userStore.userInfo.nickname || '',
      realName: '',
      phone: userStore.userInfo.phone || '',
      email: userStore.userInfo.email || '',
      companyName: userStore.userInfo.companyName || '待认证',
      position: userStore.userInfo.position || ''
    }
  }
})

const handleAvatarSuccess = (res: any) => {
  form.value.avatar = res.url || res.path || ''
  ElMessage.success('头像上传成功')
}

const saveProfile = async () => {
  try {
    await updateUserInfo({
      nickname: form.value.nickname,
      avatar: form.value.avatar,
      email: form.value.email,
      phone: form.value.phone
    } as any)
    // 更新 store 中的用户信息
    if (userStore.userInfo) {
      userStore.userInfo.nickname = form.value.nickname
      userStore.userInfo.avatar = form.value.avatar
      userStore.userInfo.email = form.value.email
    }
    ElMessage.success('保存成功')
  } catch {
    ElMessage.error('保存失败，请重试')
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  try {
    await changePasswordApi({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword,
      confirmPassword: passwordForm.value.confirmPassword
    } as any)
    ElMessage.success('密码修改成功，请重新登录')
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
    setTimeout(() => {
      userStore.logout()
      window.location.href = '/login'
    }, 1500)
  } catch {
    ElMessage.error('密码修改失败，请检查原密码是否正确')
  }
}
</script>

<style scoped lang="scss">
.hr-profile {
  max-width: 800px;
  margin: 0 auto;

  .card-header {
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
