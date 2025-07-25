<template>
  <div class="send-mail-app">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <n-button
            quaternary
            circle
            @click="$emit('back')"
            title="返回收件箱"
          >
            <template #icon>
              <n-icon>
                <ArrowBackIcon />
              </n-icon>
            </template>
          </n-button>
          <div class="header-title">
            <n-icon size="24">
              <SendIcon />
            </n-icon>
            <h1>发送邮件</h1>
          </div>
        </div>
        
        <div class="header-actions">
          <n-button
            quaternary
            circle
            @click="refreshSentMails"
            :loading="loading.sentMails"
            title="刷新已发送邮件"
          >
            <template #icon>
              <n-icon>
                <RefreshIcon />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </header>

    <!-- Main Content - Three Column Layout -->
    <main class="app-main">
      <div class="three-column-layout">
        <!-- Column 1: Email Addresses -->
        <div class="column email-manager-column">
          <div class="column-header">
            <h2 class="column-title">发件邮箱</h2>
            <n-badge :value="emailStore.addresses.length" :max="99" type="info" />
          </div>
          <div class="column-content">
            <SendMailAddressManager ref="addressManagerRef" />
          </div>
        </div>

        <!-- Column 2: Sent Mails List -->
        <div class="column mail-list-column">
          <div class="column-header">
            <h2 class="column-title">已发送</h2>
            <div class="header-actions">
              <n-button
                size="small"
                @click="requestSendAccess"
                :loading="loading.requestAccess"
                title="申请发送邮件权限"
              >
                <template #icon>
                  <n-icon>
                    <KeyIcon />
                  </n-icon>
                </template>
                申请权限
              </n-button>

              <n-button
                type="primary"
                size="small"
                @click="startCompose"
                :disabled="!selectedFromAddress"
              >
                <template #icon>
                  <n-icon>
                    <AddIcon />
                  </n-icon>
                </template>
                发送新邮件
              </n-button>
            </div>
          </div>
          <div class="column-content">
            <SentMailList ref="sentMailListRef" />
          </div>
        </div>

        <!-- Column 3: Mail Composer / Detail -->
        <div class="column mail-detail-column">
          <div class="column-header">
            <h2 class="column-title">
              {{ showCompose ? '撰写邮件' : (selectedSentMail ? '邮件详情' : '选择邮件或撰写新邮件') }}
            </h2>
            <div v-if="showCompose" class="header-actions">
              <n-button
                size="small"
                @click="cancelCompose"
              >
                取消
              </n-button>
            </div>
          </div>
          <div class="column-content">
            <SendMailComposer
              v-if="showCompose"
              :from-address="selectedFromAddress"
              @sent="handleMailSent"
              @cancel="cancelCompose"
            />
            <SentMailDetail v-else ref="sentMailDetailRef" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  NIcon,
  NButton,
  NBadge,
  useMessage
} from 'naive-ui'
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Key as KeyIcon
} from '@vicons/ionicons5'
import { useEmailStore } from '@/stores'
import { mailApi } from '@/utils/api'
import SendMailAddressManager from './SendMailAddressManager.vue'
import SendMailComposer from './SendMailComposer.vue'
import SentMailList from './SentMailList.vue'
import SendMailPreview from './SendMailPreview.vue'
import SentMailDetail from './SentMailDetail.vue'

// Define emits
defineEmits<{
  back: []
}>()

const emailStore = useEmailStore()
const message = useMessage()

// Refs
const addressManagerRef = ref()
const sentMailListRef = ref()
const sentMailDetailRef = ref()

// State
const showCompose = ref(false)
const selectedFromAddress = ref(null)
const selectedSentMail = ref(null)
const loading = ref({
  sentMails: false,
  requestAccess: false
})

// Methods
function startCompose() {
  if (!selectedFromAddress.value) {
    message.warning('请先选择一个发件邮箱')
    return
  }
  showCompose.value = true
  console.log('📝 Starting mail composition from:', selectedFromAddress.value?.address)
}

function cancelCompose() {
  showCompose.value = false
  console.log('❌ Cancelled mail composition')
}

function handleMailSent() {
  showCompose.value = false
  message.success('邮件发送成功！')
  refreshSentMails()
  console.log('✅ Mail sent successfully')
}

async function requestSendAccess() {
  loading.value.requestAccess = true
  try {
    await mailApi.requestSendAccess()
    message.success('发送权限申请成功！请等待管理员审核。')
    console.log('🔑 Send access requested successfully')
  } catch (error) {
    console.error('Failed to request send access:', error)
    message.error('申请发送权限失败')
  } finally {
    loading.value.requestAccess = false
  }
}

async function refreshSentMails() {
  loading.value.sentMails = true
  try {
    // TODO: 实现获取已发送邮件的逻辑
    console.log('🔄 Refreshing sent mails')
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟加载
  } catch (error) {
    console.error('Failed to refresh sent mails:', error)
    message.error('刷新已发送邮件失败')
  } finally {
    loading.value.sentMails = false
  }
}

// 监听地址选择状态
let addressCheckInterval: NodeJS.Timeout | null = null

onMounted(() => {
  console.log('📧 Send mail app mounted')

  // 监听地址管理器的选中状态
  const checkSelectedAddress = () => {
    if (addressManagerRef.value?.selectedFromAddress) {
      selectedFromAddress.value = addressManagerRef.value.selectedFromAddress
    }
  }

  // 定期检查选中状态
  addressCheckInterval = setInterval(checkSelectedAddress, 100)
})

onUnmounted(() => {
  if (addressCheckInterval) {
    clearInterval(addressCheckInterval)
  }
})
</script>

<style scoped>
.send-mail-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 12px 24px;
  z-index: 100;
}

[data-theme="dark"] .app-header {
  background: rgba(16, 16, 20, 0.95);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title h1 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--n-text-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-main {
  flex: 1;
  overflow: hidden;
  padding: 16px;
}

.three-column-layout {
  display: grid;
  grid-template-columns: 300px 350px 1fr;
  gap: 16px;
  height: 100%;
  max-width: 100%;
}

.column {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .column {
  background: rgba(16, 16, 20, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.column-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

[data-theme="dark"] .column-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.column-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--n-text-color);
}

.column-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Responsive design */
@media (max-width: 1200px) {
  .three-column-layout {
    grid-template-columns: 280px 350px 1fr;
  }
}

@media (max-width: 768px) {
  .three-column-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
  }
  
  .app-main {
    padding: 8px;
  }
}
</style>
