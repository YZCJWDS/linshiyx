<template>
  <div class="mail-detail">
    <!-- No Mail Selected State -->
    <div v-if="!emailStore.selectedMail" class="empty-state">
      <n-empty description="选择邮件查看内容" size="large">
        <template #icon>
          <n-icon size="64" color="#ccc">
            <DocumentIcon />
          </n-icon>
        </template>
        <template #extra>
          <n-text depth="3">
            从邮件列表中选择一封邮件来查看完整内容
          </n-text>
        </template>
      </n-empty>
    </div>

    <!-- Mail Content -->
    <div v-else class="mail-content">
      <!-- Mail Header -->
      <div class="mail-header">
        <div class="mail-header-main">
          <h3 class="mail-subject">
            {{ emailStore.selectedMail.subject || '(No Subject)' }}
          </h3>
          
          <div class="mail-meta-info">
            <div class="mail-from">
              <n-icon size="16" class="meta-icon">
                <PersonIcon />
              </n-icon>
              <span class="meta-label">发件人:</span>
              <span class="meta-value">{{ emailStore.selectedMail.source }}</span>
            </div>

            <div class="mail-to">
              <n-icon size="16" class="meta-icon">
                <MailIcon />
              </n-icon>
              <span class="meta-label">收件人:</span>
              <span class="meta-value">{{ emailStore.selectedMail.address }}</span>
            </div>

            <div class="mail-date">
              <n-icon size="16" class="meta-icon">
                <TimeIcon />
              </n-icon>
              <span class="meta-label">日期:</span>
              <span class="meta-value">{{ formatDate(emailStore.selectedMail.created_at) }}</span>
            </div>
          </div>
        </div>

        <div class="mail-actions">
          <n-button
            size="small"
            quaternary
            circle
            @click="copyMailContent"
            title="Copy Content"
          >
            <template #icon>
              <n-icon>
                <CopyIcon />
              </n-icon>
            </template>
          </n-button>
          
          <n-button
            size="small"
            quaternary
            circle
            @click="downloadMail"
            title="Download Email"
          >
            <template #icon>
              <n-icon>
                <DownloadIcon />
              </n-icon>
            </template>
          </n-button>
          
          <n-popconfirm
            @positive-click="handleDeleteMail"
            negative-text="Cancel"
            positive-text="Delete"
          >
            <template #trigger>
              <n-button
                size="small"
                quaternary
                circle
                type="error"
                title="Delete Email"
              >
                <template #icon>
                  <n-icon>
                    <DeleteIcon />
                  </n-icon>
                </template>
              </n-button>
            </template>
            Are you sure you want to delete this email?
          </n-popconfirm>
        </div>
      </div>

      <!-- Attachments Section -->
      <div v-if="hasAttachments" class="attachments-section">
        <div class="attachments-header">
          <n-icon size="16">
            <AttachIcon />
          </n-icon>
          <span class="attachments-title">
            Attachments ({{ emailStore.selectedMail.attachments?.length }})
          </span>
        </div>
        
        <div class="attachments-list">
          <div
            v-for="(attachment, index) in emailStore.selectedMail.attachments"
            :key="index"
            class="attachment-item"
          >
            <div class="attachment-info">
              <n-icon size="20" class="attachment-icon">
                <DocumentIcon />
              </n-icon>
              <div class="attachment-details">
                <span class="attachment-name">{{ attachment.filename }}</span>
                <span class="attachment-meta">
                  {{ attachment.content_type }} • {{ formatFileSize(attachment.size) }}
                </span>
              </div>
            </div>
            
            <n-button
              size="small"
              quaternary
              @click="downloadAttachment(attachment)"
              title="Download Attachment"
            >
              <template #icon>
                <n-icon>
                  <DownloadIcon />
                </n-icon>
              </template>
            </n-button>
          </div>
        </div>
      </div>

      <!-- Mail Body -->
      <div class="mail-body">
        <div class="mail-body-header">
          <span class="body-title">Message Content</span>
          <div class="view-options">
            <n-button-group size="small">
              <n-button
                :type="viewMode === 'rendered' ? 'primary' : 'default'"
                @click="viewMode = 'rendered'"
                size="small"
              >
                正常视图
              </n-button>
              <n-button
                :type="viewMode === 'source' ? 'primary' : 'default'"
                @click="viewMode = 'source'"
                size="small"
              >
                源码视图
              </n-button>
            </n-button-group>
          </div>
        </div>

        <div class="mail-body-content">
          <n-scrollbar style="max-height: 100%;">
            <!-- Rendered View -->
            <div v-if="viewMode === 'rendered'" class="rendered-content">
              <iframe
                v-if="emailStore.selectedMail.is_html"
                :srcdoc="sanitizedHtmlContent"
                class="html-iframe"
                sandbox="allow-same-origin"
                @load="handleIframeLoad"
              />
              <div v-else class="text-content">
                <!-- 智能显示邮件内容 -->
                <div v-if="getMailContent()">
                  {{ getMailContent() }}
                </div>
                <div v-else class="no-content">
                  <n-alert type="info" title="邮件内容为空">
                    这封邮件没有文本内容。
                  </n-alert>
                </div>
              </div>
            </div>

            <!-- Source View -->
            <div v-else class="source-content">
              <pre class="source-code">{{ getMailContent() || '邮件内容为空' }}</pre>
            </div>
          </n-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NEmpty,
  NIcon,
  NText,
  NButton,
  NButtonGroup,
  NScrollbar,
  NPopconfirm,
  useMessage
} from 'naive-ui'
import {
  Document as DocumentIcon,
  Person as PersonIcon,
  Mail as MailIcon,
  Time as TimeIcon,
  Copy as CopyIcon,
  Download as DownloadIcon,
  Trash as DeleteIcon,
  Attach as AttachIcon
} from '@vicons/ionicons5'
import { useEmailStore } from '@/stores'
import { formatDate, copyToClipboard, extractTextFromHtml } from '@/utils/helpers'
import type { EmailAttachment } from '@/types'

const emailStore = useEmailStore()
const message = useMessage()

// Local state
const viewMode = ref<'rendered' | 'source'>('rendered')

// 智能获取邮件内容
function getMailContent(): string {
  const mail = emailStore.selectedMail
  if (!mail) return ''

  // 按优先级尝试不同的内容字段
  return mail.message ||
         mail.raw ||
         mail.body ||
         mail.content ||
         ''
}

// Computed
const hasAttachments = computed(() => {
  return emailStore.selectedMail?.attachments && emailStore.selectedMail.attachments.length > 0
})

const sanitizedHtmlContent = computed(() => {
  if (!emailStore.selectedMail?.message) return ''

  // Basic HTML sanitization - remove dangerous elements and attributes
  let html = emailStore.selectedMail.message

  // Remove script tags and their content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove dangerous attributes
  html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  html = html.replace(/\s*javascript\s*:/gi, '')

  // Add base styles for better rendering
  const styles = `
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 16px;
        word-wrap: break-word;
      }
      img { max-width: 100%; height: auto; }
      table { border-collapse: collapse; width: 100%; }
      td, th { padding: 8px; border: 1px solid #ddd; }
      a { color: #0066cc; }
      pre { white-space: pre-wrap; }
    </style>
  `

  return styles + html
})

// Methods
async function copyMailContent() {
  if (!emailStore.selectedMail) return

  const content = emailStore.selectedMail.is_html
    ? extractTextFromHtml(emailStore.selectedMail.message)
    : emailStore.selectedMail.message

  const success = await copyToClipboard(content)
  if (success) {
    message.success('Email content copied to clipboard')
  } else {
    message.error('Failed to copy email content')
  }
}

function downloadMail() {
  if (!emailStore.selectedMail) return

  const mail = emailStore.selectedMail
  const content = `Subject: ${mail.subject || '(No Subject)'}
From: ${mail.source}
To: ${mail.address}
Date: ${formatDate(mail.created_at)}

${mail.message}`

  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `email-${mail.id}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  message.success('Email downloaded')
}

function downloadAttachment(attachment: EmailAttachment) {
  try {
    // Decode base64 content
    const binaryString = atob(attachment.content)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const blob = new Blob([bytes], { type: attachment.content_type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = attachment.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    message.success(`Downloaded ${attachment.filename}`)
  } catch (error) {
    console.error('Download attachment error:', error)
    message.error('Failed to download attachment')
  }
}

function handleDeleteMail() {
  if (emailStore.selectedMail) {
    emailStore.deleteMail(emailStore.selectedMail.id)
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function handleIframeLoad(event: Event) {
  const iframe = event.target as HTMLIFrameElement
  try {
    // Adjust iframe height to content
    if (iframe.contentDocument) {
      const height = iframe.contentDocument.body.scrollHeight
      iframe.style.height = Math.min(height + 20, 600) + 'px'
    }
  } catch (error) {
    // Cross-origin restrictions may prevent access
    console.warn('Cannot access iframe content:', error)
  }
}
</script>

<style scoped>
.mail-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.mail-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.mail-header {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--n-border-color);
}

.mail-header-main {
  flex: 1;
  min-width: 0;
}

.mail-subject {
  font-size: 18px;
  font-weight: 600;
  color: var(--n-text-color);
  margin: 0 0 12px 0;
  line-height: 1.3;
  word-break: break-word;
}

.mail-meta-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mail-from,
.mail-to,
.mail-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.meta-icon {
  color: var(--n-text-color-2);
  flex-shrink: 0;
}

.meta-label {
  font-weight: 500;
  color: var(--n-text-color-2);
  min-width: 40px;
}

.meta-value {
  color: var(--n-text-color);
  word-break: break-all;
}

.mail-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.attachments-section {
  flex-shrink: 0;
  border: 1px solid var(--n-border-color);
  border-radius: 6px;
  overflow: hidden;
}

.attachments-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--n-card-color);
  border-bottom: 1px solid var(--n-border-color);
  font-weight: 500;
  color: var(--n-text-color);
}

.attachments-title {
  font-size: 14px;
}

.attachments-list {
  display: flex;
  flex-direction: column;
}

.attachment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--n-border-color);
  background: var(--n-card-color);
}

.attachment-item:last-child {
  border-bottom: none;
}

.attachment-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.attachment-icon {
  color: var(--n-text-color-2);
  flex-shrink: 0;
}

.attachment-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.attachment-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--n-text-color);
  word-break: break-all;
}

.attachment-meta {
  font-size: 11px;
  color: var(--n-text-color-3);
}

.mail-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--n-border-color);
  border-radius: 6px;
  overflow: hidden;
}

.mail-body-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--n-card-color);
  border-bottom: 1px solid var(--n-border-color);
}

.body-title {
  font-weight: 500;
  color: var(--n-text-color);
}

.mail-body-content {
  flex: 1;
  min-height: 0;
  background: var(--n-card-color);
}

.rendered-content {
  height: 100%;
}

.html-iframe {
  width: 100%;
  min-height: 300px;
  border: none;
  background: white;
}

.text-content {
  padding: 16px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
  color: var(--n-text-color);
  font-family: inherit;
}

.source-content {
  height: 100%;
  padding: 16px;
}

.source-code {
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.4;
  color: var(--n-text-color);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}

.no-content {
  padding: 16px;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .mail-content {
    padding: 12px;
    gap: 12px;
  }

  .mail-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .mail-actions {
    align-self: flex-end;
  }
}

@media (max-width: 768px) {
  .mail-subject {
    font-size: 16px;
  }

  .mail-meta-info {
    gap: 6px;
  }

  .mail-from,
  .mail-to,
  .mail-date {
    font-size: 12px;
  }

  .attachment-item {
    padding: 10px 12px;
  }

  .mail-body-header {
    padding: 10px 12px;
  }

  .text-content {
    padding: 12px;
  }

  .source-content {
    padding: 12px;
  }
}
</style>
