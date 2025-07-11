<template>
  <div class="temp-email-app">
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
        </div>
      </div>
    </header>

    <!-- Main Content - Three Column Layout -->
    <main class="app-main">
      <div class="three-column-layout">
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
    </main>

    <!-- Global Loading Overlay -->
    <n-spin 
      v-if="uiStore.loading" 
      class="global-loading"
      size="large"
      description="Loading..."
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
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
  LogOut as LogOutIcon
} from '@vicons/ionicons5'
import { useEmailStore, useUiStore, useAuthStore } from '@/stores'
import { useKeyboard, commonShortcuts } from '@/composables/useKeyboard'
import EmailManager from './EmailManager.vue'
import MailList from './MailList.vue'
import MailDetail from './MailDetail.vue'

const emailStore = useEmailStore()
const uiStore = useUiStore()
const authStore = useAuthStore()
const message = useMessage()

// 初始化应用时加载存储的数据
onMounted(async () => {
  try {
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
  background: var(--n-color);
}

.app-header {
  flex-shrink: 0;
  height: 60px;
  border-bottom: 1px solid var(--n-border-color);
  background: var(--n-card-color);
  z-index: 100;
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
  background: var(--n-card-color);
  border-radius: 8px;
  border: 1px solid var(--n-border-color);
  overflow: hidden;
  min-height: 0;
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
