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
            <SendMailAddressManager @select="handleFromAddressSelected" />
          </div>
        </div>

        <!-- Column 2: Sent Mails List -->
        <div class="column mail-list-column">
          <div class="column-header">
            <h2 class="column-title">已发送</h2>
            <div class="header-actions">
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
              <n-text depth="3" style="margin-right: 12px; font-size: 12px;">
                {{ selectedFromAddress?.address ? `从 ${selectedFromAddress.address} 发送` : '请先选择发件邮箱' }}
              </n-text>

              <n-button
                size="small"
                @click="cancelCompose"
              >
                取消
              </n-button>

              <n-button
                type="primary"
                size="small"
                @click="handleSendMail"
                :loading="sending"
                :disabled="!selectedFromAddress?.address"
              >
                <template #icon>
                  <n-icon>
                    <SendIcon />
                  </n-icon>
                </template>
                {{ sending ? '发送中...' : '发送邮件' }}
              </n-button>
            </div>
          </div>
          <div class="column-content">
            <SendMailComposer
              v-if="showCompose"
              ref="sendMailComposerRef"
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
import { ref } from 'vue'
import {
  NIcon,
  NButton,
  NBadge,
  NText,
  useMessage
} from 'naive-ui'
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@vicons/ionicons5'
import { useEmailStore } from '@/stores'
import type { EmailAddress } from '@/types'
import SendMailAddressManager from './SendMailAddressManager.vue'
import SendMailComposer from './SendMailComposer.vue'
import SentMailList from './SentMailList.vue'
import SentMailDetail from './SentMailDetail.vue'

// Define emits
defineEmits<{
  back: []
}>()

const emailStore = useEmailStore()
const message = useMessage()

// Refs
const sentMailListRef = ref()
const sentMailDetailRef = ref()
const sendMailComposerRef = ref()

// State
const showCompose = ref(false)
const selectedFromAddress = ref<EmailAddress | null>(null)
const selectedSentMail = ref(null)
const loading = ref({
  sentMails: false
})

const sending = ref(false)

// Methods
function handleFromAddressSelected(address: EmailAddress | null) {
  selectedFromAddress.value = address
  if (!address) {
    showCompose.value = false
  }
}

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

async function handleSendMail() {
  if (!selectedFromAddress.value?.address) {
    message.error('请先选择发件邮箱')
    return
  }

  if (!sendMailComposerRef.value) {
    message.error('邮件编辑器未就绪')
    return
  }

  // 调用SendMailComposer的发送方法
  try {
    await sendMailComposerRef.value.sendMail()
  } catch (error) {
    console.error('Failed to send mail from parent:', error)
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

</script>

<style scoped>
.send-mail-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  color: var(--n-text-color);
  --send-panel: rgba(248, 252, 255, 0.74);
  --send-panel-strong: rgba(255, 255, 255, 0.86);
  --send-border: rgba(116, 146, 174, 0.24);
  --send-border-strong: rgba(255, 255, 255, 0.62);
  --send-shadow: 0 18px 48px rgba(48, 77, 108, 0.16);
  --send-shadow-soft: 0 8px 24px rgba(48, 77, 108, 0.1);
}

[data-theme="dark"] .send-mail-app {
  --send-panel: rgba(11, 24, 42, 0.76);
  --send-panel-strong: rgba(15, 31, 52, 0.86);
  --send-border: rgba(148, 190, 225, 0.18);
  --send-border-strong: rgba(148, 190, 225, 0.26);
  --send-shadow: 0 22px 56px rgba(0, 0, 0, 0.34);
  --send-shadow-soft: 0 10px 28px rgba(0, 0, 0, 0.24);
}

.app-header {
  background: var(--send-panel-strong);
  backdrop-filter: blur(18px) saturate(1.14);
  border-bottom: 1px solid var(--send-border);
  padding: 12px 24px;
  box-shadow: var(--send-shadow-soft);
  z-index: 100;
}

[data-theme="dark"] .app-header {
  background: rgba(8, 19, 34, 0.86);
  border-bottom-color: var(--send-border);
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

.app-header :deep(.n-button) {
  color: var(--n-text-color-2);
}

.app-header :deep(.n-button:hover) {
  background: var(--n-primary-color-suppl);
  color: var(--n-primary-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-main {
  flex: 1;
  overflow: hidden;
  padding: 12px 8px;
}

.three-column-layout {
  display: grid;
  grid-template-columns: 280px 350px 1fr;
  gap: 12px;
  height: 100%;
  max-width: 100%;
}

.column {
  background: var(--send-panel);
  backdrop-filter: blur(18px) saturate(1.08);
  border-radius: 8px;
  border: 1px solid var(--send-border-strong);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    var(--send-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.42);
}

[data-theme="dark"] .column {
  background: var(--send-panel);
  border-color: var(--send-border-strong);
  box-shadow:
    var(--send-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.column-header {
  padding: 14px 18px;
  border-bottom: 1px solid var(--send-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--send-panel-strong);
  backdrop-filter: blur(12px);
}

[data-theme="dark"] .column-header {
  border-bottom-color: var(--send-border);
  background: rgba(15, 31, 52, 0.82);
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
