<template>
  <div class="admin-login">
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: var(--n-card-color);
  border-radius: 12px;
  padding: 40px 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
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
[data-theme="dark"] .admin-login {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
}

[data-theme="dark"] .login-card {
  background: rgba(26, 32, 44, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
</style>
