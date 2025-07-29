<template>
  <div class="temp-email-app">
    <!-- 背景图片层 -->
    <div
      class="app-background"
      :class="{
        'background-loaded': backgroundLoaded,
        'background-error': backgroundError
      }"
    ></div>

    <!-- 内容层 -->
    <div class="app-content">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="app-title">
            <n-icon size="24" class="title-icon">
              <MailIcon />
            </n-icon>
            临时邮箱系统
          </h1>
        </div>
        <div class="header-right">
          <n-button
            quaternary
            circle
            @click="uiStore.toggleTheme"
            :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
          >
            <template #icon>
              <n-icon>
                <SunIcon v-if="isDark" />
                <MoonIcon v-else />
              </n-icon>
            </template>
          </n-button>
          <n-button
            quaternary
            circle
            @click="refreshAll"
            :loading="isRefreshing"
            title="刷新全部"
          >
            <template #icon>
              <n-icon>
                <RefreshIcon />
              </n-icon>
            </template>
          </n-button>

          <n-button
            quaternary
            circle
            @click="showSendMailInterface"
            title="发送邮件"
          >
            <template #icon>
              <n-icon>
                <SendIcon />
              </n-icon>
            </template>
          </n-button>

          <n-button
            quaternary
            circle
            @click="handleLogout"
            title="退出登录"
            type="error"
          >
            <template #icon>
              <n-icon>
                <LogOutIcon />
              </n-icon>
            </template>
          </n-button>

          <!-- 用户头像 -->
          <div class="user-avatar" title="管理员">
            <img
              src="/image.jpg"
              alt="用户头像"
              class="avatar-image"
              @error="handleAvatarError"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content - Three Column Layout -->
    <main class="app-main">
      <!-- 收件箱界面 -->
      <div v-if="!showSendMail" class="three-column-layout">
        <!-- Column 1: Email Manager -->
        <div class="column email-manager-column">
          <div class="column-header">
            <h2 class="column-title">邮箱地址</h2>
            <n-badge :value="emailStore.addresses.length" :max="99" type="info" />
          </div>
          <div class="column-content">
            <EmailManager />
          </div>
        </div>

        <!-- Column 2: Mail List -->
        <div class="column mail-list-column">
          <div class="column-header">
            <h2 class="column-title">
              {{ emailStore.selectedAddress ? '收件箱' : '选择邮箱地址' }}
            </h2>
            <n-badge
              v-if="emailStore.selectedAddress"
              :value="emailStore.selectedAddressMails.length"
              :max="99"
              type="success"
            />
          </div>
          <div class="column-content">
            <MailList />
          </div>
        </div>

        <!-- Column 3: Mail Detail -->
        <div class="column mail-detail-column">
          <div class="column-header">
            <h2 class="column-title">
              {{ emailStore.selectedMail ? '邮件内容' : '选择邮件' }}
            </h2>
          </div>
          <div class="column-content">
            <MailDetail />
          </div>
        </div>
      </div>

      <!-- 发送邮件界面 -->
      <SendMailApp v-else @back="showSendMail = false" />
    </main>

    <!-- Global Loading Overlay -->
    <n-spin
      v-if="uiStore.loading"
      class="global-loading"
      size="large"
      description="Loading..."
    />
    </div> <!-- 关闭 app-content -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { 
  NIcon, 
  NButton, 
  NBadge, 
  NSpin,
  useMessage
} from 'naive-ui'
import {
  Mail as MailIcon,
  Sunny as SunIcon,
  Moon as MoonIcon,
  Refresh as RefreshIcon,
  LogOut as LogOutIcon,
  Send as SendIcon
} from '@vicons/ionicons5'
import { useEmailStore, useUiStore, useAuthStore } from '@/stores'
import { useKeyboard, commonShortcuts } from '@/composables/useKeyboard'
import EmailManager from './EmailManager.vue'
import MailList from './MailList.vue'
import MailDetail from './MailDetail.vue'
import SendMailApp from './SendMailApp.vue'

const emailStore = useEmailStore()
const uiStore = useUiStore()
const authStore = useAuthStore()
const message = useMessage()

// 背景图片状态
const backgroundLoaded = ref(false)
const backgroundError = ref(false)

// 界面状态管理
const showSendMail = ref(false)

// 检查背景图片加载状态
function checkBackgroundImage() {
  const img = new Image()
  img.onload = () => {
    backgroundLoaded.value = true
    console.log('✅ Background image loaded successfully')

    // 检查图片尺寸是否适合作为背景
    const aspectRatio = img.width / img.height
    const screenAspectRatio = window.innerWidth / window.innerHeight

    if (Math.abs(aspectRatio - screenAspectRatio) > 0.5) {
      console.warn('⚠️ Background image aspect ratio may not be optimal for current screen')
      console.log(`Image: ${img.width}x${img.height} (${aspectRatio.toFixed(2)})`)
      console.log(`Screen: ${window.innerWidth}x${window.innerHeight} (${screenAspectRatio.toFixed(2)})`)
      console.log('💡 Consider providing additional images for better coverage')
    }
  }
  img.onerror = () => {
    backgroundError.value = true
    console.error('❌ Failed to load background image: /preview.jpg')
    console.log('💡 Please ensure preview.jpg is in the public directory')
  }
  img.src = '/preview.jpg'
}

// 初始化应用时加载存储的数据
onMounted(async () => {
  try {
    // 检查背景图片
    checkBackgroundImage()

    // 初始化UI设置
    uiStore.initUTCDateSetting()

    // 首先初始化认证（可能会加载邮箱池）
    await authStore.initAuth()

    // 然后初始化邮箱存储（如果认证没有加载邮箱池）
    await emailStore.initializeStore()

    console.log('✅ App initialization completed')
  } catch (error) {
    console.error('❌ App initialization failed:', error)
  }
})

const isDark = computed(() => uiStore.theme === 'dark')
const isRefreshing = computed(() => 
  emailStore.loading.addresses || emailStore.loading.mails
)

async function refreshAll() {
  try {
    // 只刷新邮件，不重新加载地址（避免清空本地存储的地址）
    if (emailStore.selectedAddress) {
      await emailStore.loadMails(emailStore.selectedAddress.address)
      message.success('邮件刷新成功')
    } else {
      message.info('请先选择一个邮箱地址')
    }
  } catch (error) {
    message.error('刷新失败')
  }
}

async function handleLogout() {
  try {
    // 调用认证store的logout方法
    authStore.logout()

    // 清理邮件store的数据
    emailStore.clearAllData()

    message.success('已退出登录')
    console.log('🔓 User logged out successfully')
  } catch (error) {
    console.error('Logout error:', error)
    message.error('退出登录失败')
  }
}

// 显示发送邮件界面
function showSendMailInterface() {
  showSendMail.value = true
  console.log('📧 Opening send mail interface')
}

// 头像加载错误处理
function handleAvatarError(event: Event) {
  const img = event.target as HTMLImageElement
  // 设置默认头像或隐藏
  img.style.display = 'none'
  console.log('⚠️ Avatar image failed to load')
}

// Setup keyboard shortcuts
useKeyboard([
  {
    ...commonShortcuts.refresh,
    handler: () => refreshAll()
  },
  {
    ...commonShortcuts.refreshCtrl,
    handler: () => refreshAll()
  },
  {
    key: 't',
    ctrl: true,
    handler: () => uiStore.toggleTheme(),
    description: '切换主题 (Ctrl+T)'
  }
])

onMounted(async () => {
  // Initialize auth
  authStore.initAuth()

  // Initialize data only if authenticated
  if (authStore.hasValidAuth) {
    await emailStore.loadAddresses()
    await emailStore.loadUserSettings()

    // Start auto-refresh for mails
    emailStore.startAutoRefresh(30000) // Refresh every 30 seconds
  }
})

onUnmounted(() => {
  emailStore.stopAutoRefresh()
})
</script>

<style scoped>
.temp-email-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* 背景图片层 - 参考VSCode背景插件方法 */
.app-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/preview.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: -2;
  transform: scale(1.05); /* 轻微缩放避免边缘 */
}

/* 背景遮罩层 - 提供更好的可读性 */
.app-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.7) 0%,
    rgba(255, 255, 255, 0.5) 25%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.5) 75%,
    rgba(255, 255, 255, 0.7) 100%
  );
  backdrop-filter: blur(2px);
  z-index: -1;
}

/* 内容层 */
.app-content {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: transparent;
  z-index: 1;
}

/* 深色模式下的背景调整 */
[data-theme="dark"] .app-background::after {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.4) 25%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.4) 75%,
    rgba(0, 0, 0, 0.6) 100%
  );
  backdrop-filter: blur(3px);
}

/* 背景图片加载状态 */
.app-background.background-loaded {
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.app-background:not(.background-loaded) {
  opacity: 0.3;
}

.app-background.background-error {
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
  opacity: 0.8;
}

.app-background.background-error::after {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.6) 25%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0.6) 75%,
    rgba(255, 255, 255, 0.8) 100%
  );
}

.app-header {
  flex-shrink: 0;
  height: 60px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(15px) saturate(1.2);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

/* 深色模式下的头部样式 */
[data-theme="dark"] .app-header {
  background: rgba(0, 0, 0, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: var(--n-text-color);
  margin: 0;
}

.title-icon {
  color: var(--n-primary-color);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 用户头像样式 */
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  margin-left: 4px;
}

.user-avatar:hover {
  border-color: var(--n-primary-color);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.user-avatar:hover .avatar-image {
  transform: scale(1.1);
}

/* 深色模式下的头像样式 */
[data-theme="dark"] .user-avatar {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

[data-theme="dark"] .user-avatar:hover {
  border-color: var(--n-primary-color);
}

.app-main {
  flex: 1;
  overflow: hidden;
  padding: 12px 8px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.three-column-layout {
  display: grid;
  grid-template-columns: 280px 350px 1fr;
  gap: 12px;
  height: 100%;
  min-height: 0;
}

.column {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px) saturate(1.1);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  overflow: hidden;
  min-height: 0;
  position: relative;
}

/* 列的内部光效 */
.column::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%);
  z-index: 1;
}

/* 深色模式下的列样式 */
[data-theme="dark"] .column {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .column::before {
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%);
}

.column-header {
  flex-shrink: 0;
  padding: 16px 20px;
  border-bottom: 1px solid var(--n-border-color);
  background: var(--n-card-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.column-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--n-text-color);
  margin: 0;
}

.column-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.email-manager-column {
  min-width: 280px;
}

.mail-list-column {
  min-width: 350px;
}

.mail-detail-column {
  min-width: 400px;
}

.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

[data-theme="dark"] .global-loading {
  background: rgba(0, 0, 0, 0.8);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .three-column-layout {
    grid-template-columns: 260px 320px 1fr;
    gap: 10px;
  }

  .app-main {
    padding: 12px;
  }
}

@media (max-width: 1024px) {
  .three-column-layout {
    grid-template-columns: 240px 280px 1fr;
    gap: 8px;
  }

  .column {
    min-height: 0;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }

  .app-title {
    font-size: 18px;
  }

  /* 移动端头像样式 */
  .user-avatar {
    width: 32px;
    height: 32px;
    margin-left: 2px;
  }

  .header-right {
    gap: 6px;
  }

  .app-main {
    padding: 8px;
  }

  .three-column-layout {
    grid-template-columns: 180px 220px 1fr;
    gap: 6px;
  }

  .column-header {
    padding: 8px 12px;
  }

  .column-title {
    font-size: 14px;
  }
}

/* 超小屏幕 - 使用标签页模式 */
@media (max-width: 640px) {
  .three-column-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    position: relative;
  }

  .column {
    min-height: 300px;
  }

  .mail-detail-column {
    min-height: 400px;
  }

  /* 添加标签页切换功能 */
  .column:not(.active-column) {
    display: none;
  }

  .column.active-column {
    display: flex;
  }
}
</style>
