<template>
  <div class="admin-login">
    <!-- 背景图片层 -->
    <div class="background-layer">
      <div class="bg-image bg-left"></div>
      <div class="bg-image bg-right"></div>
      <div class="bg-overlay"></div>
    </div>

    <!-- 登录内容层 -->
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <n-icon size="48" class="login-icon">
            <LockIcon />
          </n-icon>
          <h1 class="login-title">临时邮箱管理系统</h1>
          <p class="login-subtitle">请输入管理员密码</p>
        </div>

        <n-form
          ref="formRef"
          :model="form"
          :rules="rules"
          size="large"
          @submit.prevent="handleLogin"
        >
          <n-form-item path="password">
            <n-input
              v-model:value="form.password"
              type="password"
              placeholder="管理员密码"
              show-password-on="click"
              :loading="loading"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <n-icon>
                  <KeyIcon />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item>
            <n-button
              type="primary"
              block
              size="large"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </n-button>
          </n-form-item>
        </n-form>

        <div class="login-footer">
          <n-text depth="3" size="small">
            请联系管理员获取访问密码
          </n-text>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  NIcon,
  NText,
  useMessage,
  type FormInst,
  type FormRules
} from 'naive-ui'
import {
  LockClosed as LockIcon,
  Key as KeyIcon
} from '@vicons/ionicons5'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const message = useMessage()

// Form state
const formRef = ref<FormInst | null>(null)
const form = reactive({
  password: ''
})

const loading = ref(false)

// Form validation rules
const rules: FormRules = {
  password: [
    { required: true, message: '请输入管理员密码', trigger: 'blur' }
  ]
}

// Handle login
async function handleLogin() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    console.log('Attempting login with password:', form.password.substring(0, 3) + '***')

    const success = await authStore.login(form.password)
    if (success) {
      message.success('登录成功')
    } else {
      message.error('密码错误或认证方式不匹配，请检查密码')
      form.password = ''
    }
  } catch (error) {
    console.error('Login error:', error)
    message.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* 背景图片层 */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.bg-image {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(3px);
  opacity: 0.7;
  transition: all 0.3s ease;
  animation: float 6s ease-in-out infinite;
}

.bg-image:hover {
  filter: blur(2px);
  opacity: 0.8;
}

.bg-left {
  left: 0;
  background-image: url('/left.png');
  background-position: right center;
}

.bg-right {
  right: 0;
  background-image: url('/right.png');
  background-position: left center;
}

/* 渐变遮罩层 */
.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.3) 0%,
    rgba(118, 75, 162, 0.3) 50%,
    rgba(102, 126, 234, 0.3) 100%
  );
  backdrop-filter: blur(1px);
}

.login-container {
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 10;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px 32px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.login-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-icon {
  color: var(--n-primary-color);
  margin-bottom: 16px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--n-text-color);
  margin: 0 0 8px 0;
}

.login-subtitle {
  color: var(--n-text-color-2);
  margin: 0;
  font-size: 14px;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
}

/* Dark mode adjustments */
[data-theme="dark"] .bg-overlay {
  background: linear-gradient(
    135deg,
    rgba(45, 55, 72, 0.4) 0%,
    rgba(74, 85, 104, 0.4) 50%,
    rgba(45, 55, 72, 0.4) 100%
  );
}

[data-theme="dark"] .login-card {
  background: rgba(26, 32, 44, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .login-card:hover {
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

/* Responsive */
@media (max-width: 480px) {
  .admin-login {
    padding: 16px;
  }
  
  .login-card {
    padding: 32px 24px;
  }
  
  .login-title {
    font-size: 20px;
  }
}

/* 动画效果 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.02);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card {
  animation: fadeInUp 0.8s ease-out;
}

.bg-left {
  animation-delay: -3s;
}

.bg-right {
  animation-delay: 0s;
}

/* 添加一些粒子效果的伪元素 */
.background-layer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
  animation: float 8s ease-in-out infinite reverse;
  z-index: 2;
}
</style>
