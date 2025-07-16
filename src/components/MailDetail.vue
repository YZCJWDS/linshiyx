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
            {{ getDecodedSubject() }}
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
          <span class="body-title">邮件内容</span>
          <div class="view-options">
            <n-space size="small">
              <!-- 视图模式切换 -->
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

              <!-- 显示模式设置 (只在正常视图时显示) -->
              <template v-if="viewMode === 'rendered'">
                <n-switch
                  v-model:value="settingsStore.preferShowTextMail"
                  size="small"
                  @update:value="settingsStore.saveSettings"
                >
                  <template #checked>文本模式</template>
                  <template #unchecked>富文本模式</template>
                </n-switch>

                <n-switch
                  v-if="isHtmlMail && !settingsStore.preferShowTextMail"
                  v-model:value="settingsStore.useIframeShowMail"
                  size="small"
                  @update:value="settingsStore.saveSettings"
                >
                  <template #checked>iframe渲染</template>
                  <template #unchecked>安全渲染</template>
                </n-switch>
              </template>
            </n-space>
          </div>
        </div>

        <div class="mail-body-content">
          <n-scrollbar style="max-height: 100%;">
            <!-- Rendered View - 完全按照示例前端的逻辑 -->
            <div v-if="viewMode === 'rendered'" class="rendered-content">
              <!-- 文本模式：显示 text 字段或从 message 提取的文本 -->
              <pre
                v-if="settingsStore.preferShowTextMail"
                class="text-display"
              >{{ getDisplayText() }}</pre>

              <!-- iframe模式：直接显示 message 内容 -->
              <iframe
                v-else-if="settingsStore.useIframeShowMail"
                :srcdoc="getDisplayMessage()"
                class="html-iframe"
                sandbox="allow-same-origin"
                @load="handleIframeLoad"
              />

              <!-- 安全渲染模式：使用 ShadowHtmlComponent -->
              <ShadowHtmlComponent
                v-else
                :html-content="getDisplayMessage()"
                class="shadow-content"
              />
            </div>

            <!-- Source View -->
            <div v-else class="source-content">
              <pre class="source-code">{{ getRawContent() || '邮件内容为空' }}</pre>
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
  NSwitch,
  NSpace,
  NAlert,
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
import { useEmailStore, useSettingsStore } from '@/stores'
import { formatDate, copyToClipboard, extractTextFromHtml } from '@/utils/helpers'
import type { EmailAttachment } from '@/types'
import ShadowHtmlComponent from './ShadowHtmlComponent.vue'

const emailStore = useEmailStore()
const settingsStore = useSettingsStore()
const message = useMessage()

// Local state
const viewMode = ref<'rendered' | 'source'>('rendered')

// 解码邮件主题
function getDecodedSubject(): string {
  const mail = emailStore.selectedMail
  if (!mail) return '(No Subject)'

  let subject = mail.subject || ''

  // 调试信息
  console.log('=== Subject Debug ===')
  console.log('Original subject field:', mail.subject)
  console.log('Subject length:', subject.length)

  // 如果主题为空，尝试从原始邮件中提取
  if (!subject) {
    console.log('Trying to extract subject from raw message...')

    // 尝试从 raw 字段提取
    const rawContent = mail.raw || mail.message || ''
    if (rawContent) {
      console.log('Raw content available, length:', rawContent.length)

      // 查找 Subject 行，支持多行折叠
      const subjectMatch = rawContent.match(/^Subject:\s*(.+?)(?=\r?\n[^\s]|\r?\n\r?\n|$)/ms)
      if (subjectMatch) {
        subject = subjectMatch[1]
          .replace(/\r?\n\s+/g, ' ') // 处理多行折叠
          .trim()
        console.log('Extracted subject from raw:', subject)
      } else {
        console.log('No Subject line found in raw message')
        // 尝试查找所有可能的主题行
        const allSubjectMatches = rawContent.match(/Subject:[^\r\n]*/gi)
        console.log('All Subject lines found:', allSubjectMatches)
      }
    } else {
      console.log('No raw content available')
    }
  }

  if (!subject) {
    console.log('No subject found, returning default')
    return '(无主题)'
  }

  console.log('Processing subject:', subject)

  // 解码 RFC 2047 编码的主题 (=?charset?encoding?encoded-text?=)
  try {
    const originalSubject = subject
    subject = subject.replace(/=\?([^?]+)\?([BQ])\?([^?]+)\?=/gi, (match, charset, encoding, encodedText) => {
      console.log('Decoding subject part:', { charset, encoding, encodedText })
      try {
        if (encoding.toUpperCase() === 'B') {
          // Base64 解码
          const decoded = atob(encodedText)
          // 转换为 UTF-8
          const result = decodeURIComponent(escape(decoded))
          console.log('Base64 decoded result:', result)
          return result
        } else if (encoding.toUpperCase() === 'Q') {
          // Quoted-Printable 解码
          const result = encodedText.replace(/_/g, ' ').replace(/=([0-9A-F]{2})/gi, (match, hex) => {
            return String.fromCharCode(parseInt(hex, 16))
          })
          console.log('Quoted-Printable decoded result:', result)
          return result
        }
      } catch (error) {
        console.warn('Failed to decode subject part:', error)
      }
      return match
    })

    if (originalSubject !== subject) {
      console.log('Subject decoded from:', originalSubject, 'to:', subject)
    }
  } catch (error) {
    console.warn('Failed to decode subject:', error)
  }

  const finalSubject = subject || '(无主题)'
  console.log('Final subject:', finalSubject)
  console.log('==================')

  return finalSubject
}

// 解析邮件内容
function getMailContent(): string {
  const mail = emailStore.selectedMail
  if (!mail) return ''

  const rawContent = mail.message || mail.raw || mail.body || mail.content || ''

  // 如果内容包含 MIME 结构，尝试解析
  if (rawContent.includes('Content-Type:')) {
    console.log('📧 Detected MIME content, parsing...')
    return parseEmailContent(rawContent)
  }

  return rawContent
}

// 解码 Quoted-Printable 内容
function decodeQuotedPrintable(content: string): string {
  return content
    // 解码 =XX 格式的十六进制字符
    .replace(/=([0-9A-F]{2})/gi, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16))
    })
    // 移除软换行（行末的 =）
    .replace(/=\r?\n/g, '')
    // 处理其他常见的 QP 编码
    .replace(/=\r/g, '')
    .replace(/=\n/g, '')
}

// 解析 MIME 邮件内容
function parseEmailContent(rawEmail: string): string {
  try {
    console.log('🔍 Parsing email content...')

    // 1. 查找 Base64 编码的文本内容
    const base64Matches = rawEmail.match(/Content-Type: text\/plain[\s\S]*?Content-Transfer-Encoding: base64\s*\n\s*([A-Za-z0-9+/=\s]+)/i)

    if (base64Matches && base64Matches[1]) {
      console.log('📦 Found Base64 encoded content')
      // 清理 base64 字符串（移除换行和空格）
      const base64Content = base64Matches[1].replace(/\s/g, '')

      try {
        // 解码 base64
        const decodedContent = atob(base64Content)

        // 尝试解码 UTF-8
        const utf8Content = decodeURIComponent(escape(decodedContent))

        // 清理内容（移除多余的换行）
        const cleanContent = utf8Content.replace(/\r?\n/g, '\n').trim()
        console.log('✅ Base64 decoded successfully')
        return cleanContent
      } catch (decodeError) {
        console.warn('❌ Failed to decode base64 content:', decodeError)
        return decodedContent.trim()
      }
    }

    // 2. 查找 Quoted-Printable 编码的文本内容
    const qpMatches = rawEmail.match(/Content-Type: text\/plain[\s\S]*?Content-Transfer-Encoding: quoted-printable\s*\n\s*([\s\S]*?)(?=\n----|\n--\w|$)/i)

    if (qpMatches && qpMatches[1]) {
      console.log('📝 Found Quoted-Printable encoded content')
      try {
        const qpContent = qpMatches[1]
        const decodedContent = decodeQuotedPrintable(qpContent)

        // 清理内容
        const cleanContent = decodedContent
          .replace(/\r?\n/g, '\n')
          .replace(/\n\s*\n\s*\n/g, '\n\n') // 合并多个空行
          .trim()

        console.log('✅ Quoted-Printable decoded successfully')
        return cleanContent
      } catch (decodeError) {
        console.warn('❌ Failed to decode quoted-printable content:', decodeError)
        return qpMatches[1].trim()
      }
    }

    // 3. 查找普通文本内容
    const textMatch = rawEmail.match(/Content-Type: text\/plain[\s\S]*?\n\n([\s\S]*?)(?=\n-----|$)/i)
    if (textMatch && textMatch[1]) {
      console.log('📄 Found plain text content')
      return textMatch[1].trim()
    }

    // 4. 最后尝试提取邮件正文（在所有头信息之后）
    const bodyMatch = rawEmail.match(/\n\n([\s\S]*?)(?=\n------|\n--\s*$|$)/)
    if (bodyMatch && bodyMatch[1]) {
      const bodyContent = bodyMatch[1].trim()
      // 如果不是 MIME 边界，返回内容
      if (!bodyContent.startsWith('------') && !bodyContent.startsWith('This is a multi-part')) {
        console.log('📋 Found body content')
        return bodyContent
      }
    }

    console.warn('⚠️ No parseable content found')
    return '邮件内容解析失败'
  } catch (error) {
    console.error('❌ Error parsing email content:', error)
    return '邮件内容解析出错'
  }
}

// Computed
const hasAttachments = computed(() => {
  return emailStore.selectedMail?.attachments && emailStore.selectedMail.attachments.length > 0
})

const isHtmlMail = computed(() => {
  const mail = emailStore.selectedMail
  if (!mail) return false

  // 简化HTML检测逻辑，按照示例前端的方式
  return mail.is_html === true || mail.is_html === 'true'
})

const sanitizedHtmlContent = computed(() => {
  const content = getDisplayMessage()
  if (!content) return '<p>邮件内容为空</p>'

  // Basic HTML sanitization - remove dangerous elements and attributes
  let html = content

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

// 获取显示文本 - 完全按照示例前端的逻辑
function getDisplayText(): string {
  const mail = emailStore.selectedMail
  if (!mail) return '没有选中邮件'

  console.log('Getting display text for mail:', mail)

  // 示例前端使用 S.value.text，但如果没有text字段，从content提取
  if (mail.text) {
    console.log('Using mail.text:', mail.text.substring(0, 100) + '...')
    return mail.text
  }

  // 示例前端主要使用 content 字段
  if (mail.content) {
    console.log('Extracting text from mail.content')
    return extractTextFromHtml(mail.content)
  }

  // 最后尝试其他字段
  const fallback = mail.message || mail.body || mail.raw || '邮件内容为空'
  console.log('Using fallback content:', fallback.substring(0, 100) + '...')
  return fallback
}

// 获取显示消息 - 完全按照示例前端的逻辑
function getDisplayMessage(): string {
  const mail = emailStore.selectedMail
  if (!mail) return '<p>没有选中邮件</p>'

  console.log('Getting display message for mail:', mail)

  // 示例前端主要使用 S.value.content 字段（不是message！）
  if (mail.content) {
    console.log('Using mail.content for display:', mail.content.substring(0, 100) + '...')
    return mail.content
  }

  // 如果没有 content 字段，尝试 message
  if (mail.message) {
    console.log('Using mail.message for display')
    return mail.message
  }

  // 最后尝试其他字段
  if (mail.body) {
    console.log('Using mail.body for display')
    return mail.body
  }

  // 最后返回纯文本包装在HTML中
  const textContent = mail.text || mail.raw || '邮件内容为空'
  console.log('Wrapping text content in HTML')
  return `<pre style="white-space: pre-wrap; font-family: inherit;">${textContent}</pre>`
}

// 获取原始内容
function getRawContent(): string {
  const mail = emailStore.selectedMail
  if (!mail) return ''

  return mail.raw || mail.message || mail.body || mail.content || mail.text || ''
}

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
  padding: 16px;
}

.html-content {
  height: 100%;
}

.html-iframe {
  width: 100%;
  min-height: 300px;
  border: none;
  background: white;
}

.text-content {
  height: 100%;
}

.text-display {
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
  color: var(--n-text-color);
  font-family: inherit;
  background: transparent;
  border: none;
}

.shadow-content {
  height: 100%;
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
