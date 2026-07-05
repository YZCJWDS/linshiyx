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
    <CosmicBackground class="app-cosmic-effects" variant="workspace" :density="1.22" />
    <CosmicBackground class="app-cosmic-overlay" variant="workspace" :density="0.54" overlay />

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
            @click="openComposeModal"
            :title="emailStore.selectedAddress ? '使用当前邮箱发送邮件' : '请先选择发件邮箱'"
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
          <div class="user-avatar" title="点击查看完整头像" @click="showAvatarPreview = true">
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
    </div> <!-- 关闭 app-content -->

    <!-- 头像预览弹窗 -->
    <n-modal
      v-model:show="showAvatarPreview"
      preset="card"
      title="用户头像"
      size="medium"
      :bordered="false"
      :segmented="false"
      class="avatar-preview-modal"
    >
      <div class="avatar-preview-container">
        <img
          src="/image.jpg"
          alt="用户头像完整预览"
          class="avatar-preview-image"
          @error="handleAvatarPreviewError"
        />
      </div>

      <template #footer>
        <div class="avatar-preview-footer">
          <n-text depth="3" style="font-size: 12px;">
            管理员头像
          </n-text>
          <n-button @click="showAvatarPreview = false" type="primary">
            关闭
          </n-button>
        </div>
      </template>
    </n-modal>

    <!-- 发送邮件弹窗 -->
    <n-modal
      v-model:show="showComposeModal"
      preset="card"
      title="发送邮件"
      :bordered="false"
      :segmented="false"
      :mask-closable="false"
      :style="{ width: '760px', maxWidth: '94vw' }"
      class="compose-mail-modal"
    >
      <div class="compose-modal-subtitle">
        <n-text depth="3">
          {{ emailStore.selectedAddress?.address ? `发件邮箱：${emailStore.selectedAddress.address}` : '请先选择一个邮箱地址' }}
        </n-text>
      </div>

      <SendMailComposer
        v-if="showComposeModal"
        ref="sendMailComposerRef"
        :key="composeModalKey"
        :from-address="emailStore.selectedAddress"
        @sent="handleMailSent"
        @cancel="closeComposeModal"
      />

      <template #footer>
        <div class="compose-modal-footer">
          <n-button @click="closeComposeModal" :disabled="sendingMail">
            取消
          </n-button>
          <n-button
            type="primary"
            :loading="sendingMail"
            :disabled="!emailStore.selectedAddress?.address"
            @click="sendCurrentMail"
          >
            <template #icon>
              <n-icon>
                <SendIcon />
              </n-icon>
            </template>
            发送邮件
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  NIcon,
  NButton,
  NBadge,
  NSpin,
  NModal,
  NText,
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
import SendMailComposer from './SendMailComposer.vue'
import CosmicBackground from './CosmicBackground.vue'

const emailStore = useEmailStore()
const uiStore = useUiStore()
const authStore = useAuthStore()
const message = useMessage()

// 背景图片状态
const backgroundLoaded = ref(false)
const backgroundError = ref(false)
const appBackgroundUrl = '/image/hero-bg.webp'

// 界面状态管理
const showAvatarPreview = ref(false)
const showComposeModal = ref(false)
const sendingMail = ref(false)
const composeModalKey = ref(0)
const sendMailComposerRef = ref<InstanceType<typeof SendMailComposer> | null>(null)

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
    console.error(`❌ Failed to load background image: ${appBackgroundUrl}`)
    console.log('💡 Please ensure the background asset is in the public directory')
  }
  img.src = appBackgroundUrl
}

async function initializeApp() {
  try {
    // 检查背景图片
    checkBackgroundImage()

    // 初始化UI设置
    uiStore.initUTCDateSetting()

    // 首先初始化认证（可能会加载邮箱池）
    await authStore.initAuth()

    // 然后初始化邮箱存储（如果认证没有加载邮箱池）
    await emailStore.initializeStore()

    if (authStore.hasValidAuth) {
      await emailStore.loadAddresses()
      await emailStore.loadUserSettings()
      emailStore.startAutoRefresh(30000)
    }

    console.log('✅ App initialization completed')
  } catch (error) {
    console.error('❌ App initialization failed:', error)
  }
}

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

function openComposeModal() {
  if (!emailStore.selectedAddress?.address) {
    message.warning('请先选择一个发件邮箱')
    return
  }

  composeModalKey.value += 1
  showComposeModal.value = true
  console.log('📧 Opening compose modal from:', emailStore.selectedAddress.address)
}

function closeComposeModal() {
  if (sendingMail.value) return
  showComposeModal.value = false
}

async function sendCurrentMail() {
  if (!emailStore.selectedAddress?.address) {
    message.warning('请先选择一个发件邮箱')
    return
  }

  if (!sendMailComposerRef.value) {
    message.error('邮件编辑器未就绪')
    return
  }

  sendingMail.value = true
  try {
    await sendMailComposerRef.value.sendMail()
  } finally {
    sendingMail.value = false
  }
}

function handleMailSent() {
  showComposeModal.value = false
  message.success('邮件发送成功')
}

// 头像加载错误处理
function handleAvatarError(event: Event) {
  const img = event.target as HTMLImageElement
  // 设置默认头像或隐藏
  img.style.display = 'none'
  console.log('⚠️ Avatar image failed to load')
}

// 头像预览错误处理
function handleAvatarPreviewError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzk5OTk5OSIgZm9udC1zaXplPSIxNiI+5aS05YOP5Yqg6L295aSx6LSlPC90ZXh0Pgo8L3N2Zz4K'
  console.log('⚠️ Avatar preview image failed to load')
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

onMounted(initializeApp)

onUnmounted(() => {
  emailStore.stopAutoRefresh()
  emailStore.stopBackgroundSync()
})
</script>

<style scoped>
.temp-email-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  color: var(--n-text-color);
  --app-panel: rgba(248, 252, 255, 0.68);
  --app-panel-strong: rgba(255, 255, 255, 0.8);
  --app-panel-soft: rgba(239, 247, 252, 0.58);
  --app-border: rgba(116, 146, 174, 0.24);
  --app-border-strong: rgba(255, 255, 255, 0.62);
  --app-shadow: 0 18px 48px rgba(48, 77, 108, 0.16);
  --app-shadow-soft: 0 8px 24px rgba(48, 77, 108, 0.1);
  --app-accent-soft: rgba(79, 143, 199, 0.14);
}

[data-theme="dark"] .temp-email-app {
  --app-panel: rgba(11, 24, 42, 0.62);
  --app-panel-strong: rgba(15, 31, 52, 0.76);
  --app-panel-soft: rgba(8, 19, 34, 0.5);
  --app-border: rgba(148, 190, 225, 0.18);
  --app-border-strong: rgba(148, 190, 225, 0.26);
  --app-shadow: 0 22px 56px rgba(0, 0, 0, 0.34);
  --app-shadow-soft: 0 10px 28px rgba(0, 0, 0, 0.24);
  --app-accent-soft: rgba(114, 184, 232, 0.16);
}

/* 背景图片层 - 参考VSCode背景插件方法 */
.app-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/image/hero-bg.webp');
  background-size: cover;
  background-position: center right;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: -2;
  transform: scale(1.03); /* 轻微缩放避免边缘 */
  filter: saturate(0.96) contrast(0.98);
}

.app-cosmic-effects {
  --cosmic-z-index: 0;
  --cosmic-opacity: 0.88;
}

.app-cosmic-overlay {
  --cosmic-z-index: 2;
  --cosmic-opacity: 0.34;
}

/* 背景遮罩层 - 提供更好的可读性 */
.app-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(
      135deg,
      rgba(241, 248, 253, 0.82) 0%,
      rgba(241, 248, 253, 0.66) 34%,
      rgba(241, 248, 253, 0.48) 60%,
      rgba(241, 248, 253, 0.7) 100%
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(195, 220, 239, 0.16) 100%
    );
  backdrop-filter: blur(1px);
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
  background:
    linear-gradient(
      135deg,
      rgba(7, 17, 31, 0.82) 0%,
      rgba(7, 17, 31, 0.7) 34%,
      rgba(7, 17, 31, 0.48) 58%,
      rgba(7, 17, 31, 0.76) 100%
    ),
    radial-gradient(circle at 76% 16%, rgba(88, 158, 212, 0.12), transparent 32%);
  backdrop-filter: blur(1.5px);
}

[data-theme="dark"] .app-cosmic-effects {
  --cosmic-opacity: 1;
}

[data-theme="dark"] .app-cosmic-overlay {
  --cosmic-opacity: 0.5;
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
    #dbeaf5 0%,
    #8fbdda 100%
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
  border-bottom: 1px solid var(--app-border);
  background: var(--app-panel-strong);
  backdrop-filter: blur(18px) saturate(1.14);
  box-shadow: var(--app-shadow-soft);
  z-index: 100;
}

/* 深色模式下的头部样式 */
[data-theme="dark"] .app-header {
  background: rgba(8, 19, 34, 0.82);
  border-bottom: 1px solid var(--app-border);
  box-shadow: var(--app-shadow-soft);
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

.app-header :deep(.n-button) {
  color: var(--n-text-color-2);
}

.app-header :deep(.n-button:hover) {
  background: var(--app-accent-soft);
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
  border: 2px solid rgba(255, 255, 255, 0.46);
  background: var(--app-panel-soft);
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
  border-color: rgba(148, 190, 225, 0.26);
  background: rgba(8, 19, 34, 0.72);
}

[data-theme="dark"] .user-avatar:hover {
  border-color: var(--n-primary-color);
}

/* 头像预览弹窗样式 */
.avatar-preview-modal {
  max-width: 500px;
}

.avatar-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: var(--n-card-color);
  border-radius: 8px;
}

.avatar-preview-image {
  max-width: 100%;
  max-height: 400px;
  width: auto;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.avatar-preview-image:hover {
  transform: scale(1.02);
}

.avatar-preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
}

.compose-modal-subtitle {
  margin: -4px 0 12px;
  padding: 10px 12px;
  border: 1px solid var(--app-border);
  border-radius: 6px;
  background: var(--app-panel-soft);
}

.compose-mail-modal :deep(.n-card) {
  background:
    linear-gradient(145deg, rgba(248, 252, 255, 0.96), rgba(233, 243, 251, 0.94));
  border: 1px solid rgba(255, 255, 255, 0.62);
  box-shadow: 0 28px 80px rgba(48, 77, 108, 0.22);
  backdrop-filter: blur(20px) saturate(1.1);
}

.compose-mail-modal :deep(.send-mail-composer) {
  height: min(68vh, 620px);
}

.compose-mail-modal :deep(.composer-content) {
  padding: 6px 2px 0;
}

.compose-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

[data-theme="dark"] .compose-mail-modal :deep(.n-card) {
  background:
    linear-gradient(145deg, rgba(15, 31, 52, 0.96), rgba(9, 22, 39, 0.94));
  border: 1px solid rgba(148, 190, 225, 0.22);
  box-shadow: 0 32px 86px rgba(0, 0, 0, 0.42);
}

/* 深色模式下的预览弹窗 */
[data-theme="dark"] .avatar-preview-image {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* 移动端预览弹窗优化 */
@media (max-width: 768px) {
  .avatar-preview-modal {
    max-width: 90vw;
  }

  .avatar-preview-container {
    padding: 16px;
  }

  .avatar-preview-image {
    max-height: 300px;
  }
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
  background: var(--app-panel);
  backdrop-filter: blur(18px) saturate(1.08);
  border-radius: 8px;
  border: 1px solid var(--app-border-strong);
  box-shadow:
    var(--app-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.42);
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
  background: var(--app-panel);
  border: 1px solid var(--app-border-strong);
  box-shadow:
    var(--app-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

[data-theme="dark"] .column::before {
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%);
}

.column-header {
  flex-shrink: 0;
  padding: 14px 18px;
  border-bottom: 1px solid var(--app-border);
  background: var(--app-panel-strong);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

[data-theme="dark"] .column-header {
  background: rgba(15, 31, 52, 0.82);
}

.column-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--n-text-color);
  margin: 0;
  line-height: 1.2;
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
  background: rgba(241, 248, 253, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

[data-theme="dark"] .global-loading {
  background: rgba(7, 17, 31, 0.82);
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
