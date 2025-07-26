<template>
  <div class="sent-mail-detail">
    <n-scrollbar class="detail-content">
      <div v-if="!selectedMail" class="empty-state">
        <n-empty description="选择一封已发送的邮件查看详情">
          <template #icon>
            <n-icon size="48">
              <MailIcon />
            </n-icon>
          </template>
        </n-empty>
      </div>

      <div v-else class="mail-container">
        <!-- Mail Header -->
        <div class="mail-header">
          <div class="header-top">
            <h2 class="mail-subject">{{ selectedMail.subject || '(无主题)' }}</h2>
            <div class="mail-status">
              <n-tag
                :type="getStatusType(selectedMail.status)"
                size="medium"
                round
              >
                {{ getStatusText(selectedMail.status) }}
              </n-tag>
            </div>
          </div>

          <div class="header-info">
            <div class="info-row">
              <span class="info-label">发件人:</span>
              <span class="info-value">
                {{ selectedMail.from_name ? `${selectedMail.from_name} <${selectedMail.from_mail}>` : selectedMail.from_mail }}
              </span>
            </div>
            
            <div class="info-row">
              <span class="info-label">收件人:</span>
              <span class="info-value">
                {{ selectedMail.to_name ? `${selectedMail.to_name} <${selectedMail.to_mail}>` : selectedMail.to_mail }}
              </span>
            </div>
            
            <div class="info-row">
              <span class="info-label">发送时间:</span>
              <span class="info-value">{{ formatDate(selectedMail.sent_at) }}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">邮件类型:</span>
              <n-tag :type="selectedMail.is_html ? 'info' : 'default'" size="small">
                {{ selectedMail.is_html ? 'HTML邮件' : '纯文本邮件' }}
              </n-tag>
            </div>
          </div>
        </div>

        <!-- Mail Content -->
        <div class="mail-content">
          <div class="content-header">
            <h3>邮件内容</h3>
            <div class="content-actions">
              <n-button
                size="small"
                @click="copyContent"
                title="复制内容"
              >
                <template #icon>
                  <n-icon>
                    <CopyIcon />
                  </n-icon>
                </template>
                复制
              </n-button>
            </div>
          </div>
          
          <div class="content-body">
            <!-- HTML Content -->
            <div v-if="selectedMail.is_html" class="html-content">
              <div class="html-display" v-html="selectedMail.content"></div>
            </div>
            
            <!-- Text Content -->
            <div v-else class="text-content">
              <pre class="text-display">{{ selectedMail.content }}</pre>
            </div>
          </div>
        </div>

        <!-- Mail Actions -->
        <div class="mail-actions">
          <n-button
            @click="handleResend"
            :loading="resending"
          >
            <template #icon>
              <n-icon>
                <RefreshIcon />
              </n-icon>
            </template>
            重新发送
          </n-button>
          
          <n-button
            @click="handleReply"
          >
            <template #icon>
              <n-icon>
                <ReplyIcon />
              </n-icon>
            </template>
            回复
          </n-button>
          
          <n-popconfirm
            @positive-click="handleDelete"
            negative-text="取消"
            positive-text="删除"
          >
            <template #trigger>
              <n-button type="error">
                <template #icon>
                  <n-icon>
                    <DeleteIcon />
                  </n-icon>
                </template>
                删除
              </n-button>
            </template>
            确定要删除这封已发送的邮件记录吗？
          </n-popconfirm>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NScrollbar,
  NEmpty,
  NIcon,
  NTag,
  NButton,
  NPopconfirm,
  useMessage
} from 'naive-ui'
import {
  Mail as MailIcon,
  Copy as CopyIcon,
  Refresh as RefreshIcon,
  ArrowUndo as ReplyIcon,
  Trash as DeleteIcon
} from '@vicons/ionicons5'
import { formatRelativeTime, copyToClipboard } from '@/utils/helpers'
import { useUiStore } from '@/stores'

// Types
interface SentMail {
  id: string
  to_mail: string
  to_name?: string
  from_mail: string
  from_name?: string
  subject: string
  content: string
  is_html: boolean
  status: 'sent' | 'pending' | 'failed'
  sent_at: string
}

const uiStore = useUiStore()
const message = useMessage()

// State
const selectedMail = ref<SentMail | null>(null)
const resending = ref(false)

// Methods
function getStatusType(status: string) {
  switch (status) {
    case 'sent':
      return 'success'
    case 'pending':
      return 'warning'
    case 'failed':
      return 'error'
    default:
      return 'default'
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'sent':
      return '已发送'
    case 'pending':
      return '发送中'
    case 'failed':
      return '发送失败'
    default:
      return '未知状态'
  }
}

function formatDate(dateString: string) {
  return formatRelativeTime(dateString, uiStore.useUTCDate)
}

async function copyContent() {
  if (!selectedMail.value) return
  
  const success = await copyToClipboard(selectedMail.value.content)
  if (success) {
    message.success('邮件内容已复制到剪贴板')
  } else {
    message.error('复制失败')
  }
}

async function handleResend() {
  if (!selectedMail.value) return
  
  resending.value = true
  try {
    console.log('🔄 Resending mail:', selectedMail.value.id)
    // TODO: 实现重新发送逻辑
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟发送
    message.success('邮件重新发送成功')
  } catch (error) {
    console.error('Failed to resend mail:', error)
    message.error('重新发送失败')
  } finally {
    resending.value = false
  }
}

function handleReply() {
  if (!selectedMail.value) return
  
  console.log('💬 Replying to mail:', selectedMail.value.id)
  message.info('回复功能开发中')
  // TODO: 实现回复逻辑，可能需要切换到撰写界面并预填收件人
}

function handleDelete() {
  if (!selectedMail.value) return
  
  console.log('🗑️ Deleting mail:', selectedMail.value.id)
  message.success('邮件记录已删除')
  selectedMail.value = null
  // TODO: 实现删除逻辑，通知父组件更新列表
}

// Expose methods for parent component
defineExpose({
  selectedMail
})
</script>

<style scoped>
.sent-mail-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-content {
  flex: 1;
  padding: 16px;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.mail-container {
  max-width: 100%;
}

.mail-header {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

[data-theme="dark"] .mail-header {
  background: rgba(255, 255, 255, 0.05);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

.mail-subject {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--n-text-color);
  word-break: break-word;
  flex: 1;
}

.mail-status {
  flex-shrink: 0;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-label {
  font-weight: 600;
  color: var(--n-text-color);
  min-width: 80px;
  flex-shrink: 0;
}

.info-value {
  color: var(--n-text-color);
  word-break: break-all;
  flex: 1;
}

.mail-content {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

[data-theme="dark"] .mail-content {
  background: rgba(255, 255, 255, 0.05);
}

.content-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--n-border-color);
  background: rgba(0, 0, 0, 0.02);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

[data-theme="dark"] .content-header {
  background: rgba(255, 255, 255, 0.02);
}

.content-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--n-text-color);
}

.content-actions {
  display: flex;
  gap: 8px;
}

.content-body {
  padding: 16px;
}

.html-content {
  border: 1px solid var(--n-border-color);
  border-radius: 4px;
  background: #fff;
  min-height: 200px;
}

[data-theme="dark"] .html-content {
  background: rgba(255, 255, 255, 0.95);
}

.html-display {
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
}

.text-content {
  border: 1px solid var(--n-border-color);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.02);
  min-height: 200px;
}

[data-theme="dark"] .text-content {
  background: rgba(255, 255, 255, 0.02);
}

.text-display {
  padding: 16px;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: var(--n-text-color);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.mail-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Responsive design */
@media (max-width: 768px) {
  .detail-content {
    padding: 12px;
  }
  
  .mail-header,
  .content-body {
    padding: 16px;
  }
  
  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .info-label {
    min-width: auto;
  }
  
  .mail-actions {
    flex-direction: column;
  }
}
</style>
