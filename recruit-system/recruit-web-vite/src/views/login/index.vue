<template>
  <div class="auth-container">
    <!-- 左侧品牌展示区 -->
    <div class="auth-brand">
      <div class="brand-content">
        <div class="logo">
          <el-icon size="64" color="#fff"><Compass /></el-icon>
          <span class="logo-text">游职网</span>
        </div>
        <h1 class="brand-title">旅游行业招聘系统</h1>
        <p class="brand-desc">连接旅游人才与优质企业，开启您的职业新旅程</p>

        <div class="features">
          <div class="feature-item">
            <el-icon size="24" color="#67c23a"><Check /></el-icon>
            <span>海量旅游行业职位</span>
          </div>
          <div class="feature-item">
            <el-icon size="24" color="#67c23a"><Check /></el-icon>
            <span>知名企业直招</span>
          </div>
          <div class="feature-item">
            <el-icon size="24" color="#67c23a"><Check /></el-icon>
            <span>精准职位推荐</span>
          </div>
        </div>

        <div class="stats">
          <div class="stat-item">
            <span class="stat-num">10万+</span>
            <span class="stat-label">活跃职位</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">5000+</span>
            <span class="stat-label">合作企业</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">100万+</span>
            <span class="stat-label">求职者</span>
          </div>
        </div>
      </div>

      <!-- 装饰背景 -->
      <div class="brand-bg">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>
    </div>

    <!-- 右侧表单区 -->
    <div class="auth-form-section">
      <div class="form-container">
        <!-- 登录表单 -->
        <div v-if="!isRegister" class="form-box">
          <div class="form-header">
            <h2>欢迎回来</h2>
            <p>登录您的游职网账号</p>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="auth-form"
            @keyup.enter="handleLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="用户名/手机号"
                size="large"
                :prefix-icon="User"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码"
                size="large"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <el-link type="primary" :underline="false" @click="showForgot = true">
                忘记密码？
              </el-link>
            </div>

            <el-button
              type="primary"
              size="large"
              class="submit-btn"
              :loading="loginLoading"
              @click="handleLogin"
            >
              登 录
            </el-button>

            <el-divider>
              <span class="divider-text">其他方式</span>
            </el-divider>

            <div class="social-login">
              <el-button circle class="social-btn">
                <el-icon size="20"><img src="https://img.icons8.com/color/48/weixing.png" alt="微信" style="width:20px;height:20px;" /></el-icon>
              </el-button>
              <el-button circle class="social-btn">
                <el-icon size="20"><img src="https://img.icons8.com/color/48/qq.png" alt="QQ" style="width:20px;height:20px;" /></el-icon>
              </el-button>
              <el-button circle class="social-btn">
                <el-icon size="20"><img src="https://img.icons8.com/color/48/weibo.png" alt="微博" style="width:20px;height:20px;" /></el-icon>
              </el-button>
            </div>

            <div class="form-footer">
              <span>还没有账号？</span>
              <el-link type="primary" :underline="false" @click="switchToRegister">
                立即注册
              </el-link>
            </div>
          </el-form>
        </div>

        <!-- 注册表单 -->
        <div v-else class="form-box">
          <div class="form-header">
            <h2>创建账号</h2>
            <p>加入游职网，开启职业新旅程</p>
          </div>

          <!-- 用户类型选择 -->
          <div class="user-type-tabs">
            <div
              class="type-tab"
              :class="{ active: registerForm.role === 'user' }"
              @click="registerForm.role = 'user'"
            >
              <el-icon size="24"><User /></el-icon>
              <span>求职者</span>
              <p>寻找旅游行业工作机会</p>
            </div>
            <div
              class="type-tab"
              :class="{ active: registerForm.role === 'hr' }"
              @click="registerForm.role = 'hr'"
            >
              <el-icon size="24"><OfficeBuilding /></el-icon>
              <span>企业HR</span>
              <p>发布职位，招聘人才</p>
            </div>
          </div>

          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            class="auth-form"
          >
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="用户名（4-20位字母数字）"
                size="large"
                :prefix-icon="User"
              />
            </el-form-item>

            <el-form-item prop="nickname">
              <el-input
                v-model="registerForm.nickname"
                placeholder="昵称"
                size="large"
                :prefix-icon="Avatar"
              />
            </el-form-item>

            <el-form-item prop="phone">
              <el-input
                v-model="registerForm.phone"
                placeholder="手机号"
                size="large"
                :prefix-icon="Phone"
                maxlength="11"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="密码（6-20位）"
                size="large"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="确认密码"
                size="large"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item prop="agreement">
              <el-checkbox v-model="registerForm.agreement">
                我已阅读并同意
                <el-link type="primary" :underline="false">用户协议</el-link>
                和
                <el-link type="primary" :underline="false">隐私政策</el-link>
              </el-checkbox>
            </el-form-item>

            <el-button
              type="primary"
              size="large"
              class="submit-btn"
              :loading="registerLoading"
              @click="handleRegister"
            >
              注 册
            </el-button>

            <div class="form-footer">
              <span>已有账号？</span>
              <el-link type="primary" :underline="false" @click="switchToLogin">
                立即登录
              </el-link>
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 忘记密码对话框 -->
    <el-dialog
      v-model="showForgot"
      title="找回密码"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form ref="forgotRef" :model="forgotForm" :rules="forgotRules">
        <el-form-item prop="phone">
          <el-input v-model="forgotForm.phone" placeholder="请输入手机号" :prefix-icon="Phone" />
        </el-form-item>
        <el-form-item prop="code" class="code-item">
          <el-input v-model="forgotForm.code" placeholder="验证码" :prefix-icon="Key" />
          <el-button type="primary" :disabled="codeCountdown > 0" @click="sendCode">
            {{ codeCountdown > 0 ? `${codeCountdown}秒后重试` : '获取验证码' }}
          </el-button>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input
            v-model="forgotForm.newPassword"
            type="password"
            placeholder="新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showForgot = false">取消</el-button>
        <el-button type="primary" :loading="forgotLoading" @click="handleForgot">
          重置密码
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock, Compass, Check, Phone, Avatar, OfficeBuilding, Key } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { register } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()

// 登录相关
const loginFormRef = ref<FormInstance>()
const loginLoading = ref(false)
const rememberMe = ref(false)
const isRegister = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名或手机号', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return

    loginLoading.value = true
    try {
      const user = await userStore.login(loginForm)
      if (user) {
        ElMessage.success('登录成功')
        // 根据角色跳转到不同的首页
        const role = user.role
        if (role === 'admin') {
          router.push('/admin/dashboard')
        } else if (role === 'hr') {
          router.push('/hr/dashboard')
        } else {
          router.push('/home')
        }
      }
    } finally {
      loginLoading.value = false
    }
  })
}

// 注册相关
const registerFormRef = ref<FormInstance>()
const registerLoading = ref(false)

const registerForm = reactive({
  role: 'user' as 'user' | 'hr',
  username: '',
  nickname: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

const validateConfirmPassword = (rule: any, value: string, callback: Function) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validateAgreement = (rule: any, value: boolean, callback: Function) => {
  if (!value) {
    callback(new Error('请同意用户协议和隐私政策'))
  } else {
    callback()
  }
}

const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{4,20}$/, message: '用户名需为4-20位字母或数字', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  agreement: [
    { validator: validateAgreement, trigger: 'change' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate(async (valid) => {
    if (!valid) return

    registerLoading.value = true
    try {
      await register({
        username: registerForm.username,
        nickname: registerForm.nickname,
        password: registerForm.password
      })
      ElMessage.success('注册成功，请登录')
      switchToLogin()
    } catch (error) {
      // 错误已在请求拦截器处理
    } finally {
      registerLoading.value = false
    }
  })
}

// 切换登录/注册
const switchToRegister = () => {
  isRegister.value = true
  // 清空表单
  loginForm.username = ''
  loginForm.password = ''
}

const switchToLogin = () => {
  isRegister.value = false
  // 清空表单
  registerForm.username = ''
  registerForm.nickname = ''
  registerForm.phone = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
  registerForm.agreement = false
}

// 忘记密码
const showForgot = ref(false)
const forgotRef = ref<FormInstance>()
const forgotLoading = ref(false)
const codeCountdown = ref(0)

const forgotForm = reactive({
  phone: '',
  code: '',
  newPassword: ''
})

const forgotRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
}

const sendCode = () => {
  // 模拟发送验证码
  codeCountdown.value = 60
  ElMessage.success('验证码已发送')
  const timer = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleForgot = async () => {
  if (!forgotRef.value) return

  await forgotRef.value.validate(async (valid) => {
    if (!valid) return

    forgotLoading.value = true
    try {
      ElMessage.success('密码重置成功')
      showForgot.value = false
    } finally {
      forgotLoading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.auth-container {
  display: flex;
  min-height: 100vh;
  background: #fff;
}

// 左侧品牌区
.auth-brand {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 60px;

  .brand-content {
    position: relative;
    z-index: 2;
    max-width: 480px;
    color: #fff;

    .logo {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;

      .logo-text {
        font-size: 36px;
        font-weight: 700;
      }
    }

    .brand-title {
      font-size: 42px;
      font-weight: 700;
      margin-bottom: 16px;
      line-height: 1.2;
    }

    .brand-desc {
      font-size: 18px;
      opacity: 0.9;
      margin-bottom: 48px;
      line-height: 1.6;
    }

    .features {
      margin-bottom: 48px;

      .feature-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        font-size: 16px;

        span {
          opacity: 0.95;
        }
      }
    }

    .stats {
      display: flex;
      gap: 40px;

      .stat-item {
        display: flex;
        flex-direction: column;

        .stat-num {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.8;
        }
      }
    }
  }

  .brand-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;

    .circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);

      &.circle-1 {
        width: 400px;
        height: 400px;
        top: -100px;
        right: -100px;
      }

      &.circle-2 {
        width: 300px;
        height: 300px;
        bottom: -50px;
        left: -50px;
      }

      &.circle-3 {
        width: 200px;
        height: 200px;
        bottom: 20%;
        right: 10%;
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }
}

// 右侧表单区
.auth-form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #f8fafc;

  .form-container {
    width: 100%;
    max-width: 440px;
    background: #fff;
    border-radius: 16px;
    padding: 48px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  }
}

.form-box {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-header {
  text-align: center;
  margin-bottom: 32px;

  h2 {
    font-size: 28px;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: #64748b;
  }
}

// 用户类型选择
.user-type-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;

  .type-tab {
    flex: 1;
    padding: 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;

    .el-icon {
      color: #94a3b8;
      margin-bottom: 8px;
    }

    span {
      display: block;
      font-size: 16px;
      font-weight: 500;
      color: #475569;
      margin-bottom: 4px;
    }

    p {
      font-size: 12px;
      color: #94a3b8;
    }

    &:hover {
      border-color: #667eea;
    }

    &.active {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.05);

      .el-icon {
        color: #667eea;
      }

      span {
        color: #667eea;
      }
    }
  }
}

.auth-form {
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .submit-btn {
    width: 100%;
    height: 44px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 8px;
  }

  :deep(.el-input__wrapper) {
    border-radius: 8px;
    padding: 4px 12px;
  }

  :deep(.el-input__inner) {
    height: 40px;
  }
}

.divider-text {
  font-size: 12px;
  color: #94a3b8;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;

  .social-btn {
    width: 44px;
    height: 44px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

.form-footer {
  text-align: center;
  font-size: 14px;
  color: #64748b;

  span {
    margin-right: 4px;
  }
}

// 忘记密码验证码
.code-item {
  :deep(.el-form-item__content) {
    display: flex;
    gap: 12px;

    .el-input {
      flex: 1;
    }

    .el-button {
      width: 120px;
    }
  }
}

// 响应式
@media (max-width: 1024px) {
  .auth-brand {
    display: none;
  }

  .auth-form-section {
    padding: 20px;

    .form-container {
      padding: 32px 24px;
    }
  }
}
</style>
