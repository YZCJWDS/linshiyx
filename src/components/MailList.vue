<template>
  <div class="mail-list">
    <!-- No Address Selected State -->
    <div v-if="!emailStore.selectedAddress" class="empty-state">
      <n-empty description="选择邮箱地址查看邮件" size="large">
        <template #icon>
          <n-icon size="64" color="#ccc">
            <MailIcon />
          </n-icon>
        </template>
        <template #extra>
          <n-text depth="3">
            从左侧面板选择一个邮箱地址来查看收到的邮件
          </n-text>
        </template>
      </n-empty>
    </div>

    <!-- Mail List Content -->
    <div v-else class="mail-list-content">
      <!-- Mail List Header -->
      <div class="mail-list-header">
        <div class="selected-address-info">
          <n-icon size="16" class="address-icon">
            <MailIcon />
          </n-icon>
          <span class="address-text">{{ emailStore.selectedAddress.address }}</span>
          <n-button
            size="tiny"
            quaternary
            circle
            @click="copyAddress"
            title="复制地址"
          >
            <template #icon>
              <n-icon size="12">
                <CopyIcon />
              </n-icon>
            </template>
          </n-button>
        </div>
        
        <div class="mail-actions">
          <n-button
            size="small"
            quaternary
            circle
            @click="refreshMails"
            :loading="loading.mails"
            title="刷新"
          >
            <template #icon>
              <n-icon>
                <RefreshIcon />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="search-section">
        <n-input
          v-model:value="searchKeyword"
          placeholder="搜索邮件..."
          clearable
          size="small"
          @input="handleSearch"
        >
          <template #prefix>
            <n-icon size="16">
              <SearchIcon />
            </n-icon>
          </template>
        </n-input>
      </div>

      <!-- Mail Items -->
      <div class="mail-items-container">
        <n-scrollbar style="max-height: 100%;">
          <!-- Loading State -->
          <n-spin v-if="loading.mails" class="loading-spin" />
          
          <!-- Empty State -->
          <n-empty 
            v-else-if="!filteredMails.length"
            :description="searchKeyword ? 'No emails found matching your search' : 'No emails received yet'"
            size="small"
          >
            <template #icon>
              <n-icon size="48" color="#ccc">
                <InboxIcon />
              </n-icon>
            </template>
          </n-empty>

          <!-- Mail List -->
          <div v-else class="mail-items">
            <div
              v-for="mail in filteredMails"
              :key="mail.id"
              class="mail-item"
              :class="{ 
                'mail-item--selected': emailStore.selectedMail?.id === mail.id,
                'mail-item--unread': isUnread(mail)
              }"
              @click="handleSelectMail(mail)"
            >
              <div class="mail-item-content">
                <!-- Mail Header -->
                <div class="mail-header">
                  <div class="mail-from">
                    <n-icon size="14" class="from-icon">
                      <PersonIcon />
                    </n-icon>
                    <span class="from-text">{{ truncateText(mail.source, 25) }}</span>
                  </div>
                  <div class="mail-time">
                    {{ formatDate(mail.created_at) }}
                  </div>
                </div>

                <!-- Mail Subject -->
                <div class="mail-subject">
                  {{ getDecodedSubject(mail) }}
                </div>

                <!-- Mail Preview -->
                <div class="mail-preview">
                  {{ getMailPreview(mail) }}
                </div>

                <!-- Mail Meta -->
                <div class="mail-meta">
                  <div class="mail-tags">
                    <n-tag v-if="mail.is_html" size="tiny" type="info">HTML</n-tag>
                    <n-tag v-if="hasAttachments(mail)" size="tiny" type="warning">
                      <template #icon>
                        <n-icon size="12">
                          <AttachIcon />
                        </n-icon>
                      </template>
                      {{ getAttachmentCount(mail) }}
                    </n-tag>
                  </div>
                </div>
              </div>

              <!-- Mail Actions -->
              <div class="mail-item-actions">
                <n-popconfirm
                  @positive-click="handleDeleteMail(mail.id)"
                  negative-text="Cancel"
                  positive-text="Delete"
                >
                  <template #trigger>
                    <n-button
                      size="tiny"
                      quaternary
                      circle
                      type="error"
                      @click.stop
                      title="Delete Email"
                    >
                      <template #icon>
                        <n-icon size="14">
                          <DeleteIcon />
                        </n-icon>
                      </template>
                    </n-button>
                  </template>
                  Are you sure you want to delete this email?
                </n-popconfirm>
              </div>
            </div>
          </div>
        </n-scrollbar>
      </div>

      <!-- Mail Count Info -->
      <div class="mail-count-info">
        <n-text depth="3" size="small">
          {{ filteredMails.length }} email{{ filteredMails.length !== 1 ? 's' : '' }}
          {{ searchKeyword ? `found for "${searchKeyword}"` : 'total' }}
        </n-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  NEmpty,
  NIcon,
  NText,
  NButton,
  NInput,
  NScrollbar,
  NSpin,
  NPopconfirm,
  NTag,
  useMessage
} from 'naive-ui'
import {
  Mail as MailIcon,
  Copy as CopyIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Archive as InboxIcon,
  Person as PersonIcon,
  Attach as AttachIcon,
  Trash as DeleteIcon
} from '@vicons/ionicons5'
import { useEmailStore } from '@/stores'
import { 
  formatRelativeTime, 
  truncateText, 
  extractTextFromHtml, 
  copyToClipboard,
  debounce 
} from '@/utils/helpers'
import type { EmailMessage } from '@/types'

const emailStore = useEmailStore()
const message = useMessage()

// Local state
const searchKeyword = ref('')
const readEmails = ref<Set<string>>(new Set())

// Computed
const loading = computed(() => emailStore.loading)

const filteredMails = computed(() => {
  let mails = emailStore.selectedAddressMails

  // Apply search filter
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    mails = mails.filter(mail => 
      mail.subject.toLowerCase().includes(keyword) ||
      mail.source.toLowerCase().includes(keyword) ||
      extractTextFromHtml(mail.message).toLowerCase().includes(keyword)
    )
  }

  // Sort by date (newest first)
  return [...mails].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
})

// Methods
function handleSelectMail(mail: EmailMessage) {
  emailStore.selectMail(mail)
  readEmails.value.add(mail.id)
}

function handleDeleteMail(id: string) {
  emailStore.deleteMail(id)
}

async function refreshMails() {
  if (emailStore.selectedAddress) {
    await emailStore.loadMails(emailStore.selectedAddress.address)
    message.success('Emails refreshed')
  }
}

async function copyAddress() {
  if (emailStore.selectedAddress) {
    const success = await copyToClipboard(emailStore.selectedAddress.address)
    if (success) {
      message.success('Email address copied to clipboard')
    } else {
      message.error('Failed to copy email address')
    }
  }
}

const debouncedSearch = debounce(() => {
  // Search is handled by computed property
}, 300)

function handleSearch() {
  debouncedSearch()
}

function formatDate(dateString: string) {
  return formatRelativeTime(dateString)
}

function getMailPreview(mail: EmailMessage): string {
  const text = extractTextFromHtml(mail.message)
  return truncateText(text, 80)
}

function isUnread(mail: EmailMessage): boolean {
  return !readEmails.value.has(mail.id)
}

function hasAttachments(mail: EmailMessage): boolean {
  return mail.attachments && mail.attachments.length > 0
}

function getAttachmentCount(mail: EmailMessage): string {
  if (!mail.attachments) return '0'
  return mail.attachments.length.toString()
}

// 解码邮件主题
function getDecodedSubject(mail: EmailMessage): string {
  let subject = mail.subject || ''

  // 如果主题为空，尝试从原始邮件中提取
  if (!subject) {
    // 尝试从 raw 字段提取
    const rawContent = mail.raw || mail.message || ''
    if (rawContent) {
      // 查找 Subject 行，支持多行折叠
      const subjectMatch = rawContent.match(/^Subject:\s*(.+?)(?=\r?\n[^\s]|\r?\n\r?\n|$)/ms)
      if (subjectMatch) {
        subject = subjectMatch[1]
          .replace(/\r?\n\s+/g, ' ') // 处理多行折叠
          .trim()
      }
    }
  }

  if (!subject) return '(无主题)'

  // 解码 RFC 2047 编码的主题 (=?charset?encoding?encoded-text?=)
  try {
    subject = subject.replace(/=\?([^?]+)\?([BQ])\?([^?]+)\?=/gi, (match, charset, encoding, encodedText) => {
      try {
        if (encoding.toUpperCase() === 'B') {
          // Base64 解码
          const decoded = atob(encodedText)
          // 转换为 UTF-8
          return decodeURIComponent(escape(decoded))
        } else if (encoding.toUpperCase() === 'Q') {
          // Quoted-Printable 解码
          return encodedText.replace(/_/g, ' ').replace(/=([0-9A-F]{2})/gi, (match, hex) => {
            return String.fromCharCode(parseInt(hex, 16))
          })
        }
      } catch (error) {
        console.warn('Failed to decode subject part:', error)
      }
      return match
    })
  } catch (error) {
    console.warn('Failed to decode subject:', error)
  }

  return subject || '(No Subject)'
}

// Watch for address changes to clear read status
watch(() => emailStore.selectedAddress, () => {
  readEmails.value.clear()
  searchKeyword.value = ''
})
</script>

<style scoped>
.mail-list {
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

.mail-list-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.mail-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--n-border-color);
}

.selected-address-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.address-icon {
  color: var(--n-primary-color);
  flex-shrink: 0;
}

.address-text {
  font-weight: 500;
  color: var(--n-text-color);
  font-size: 13px;
  word-break: break-all;
}

.mail-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.search-section {
  flex-shrink: 0;
}

.mail-items-container {
  flex: 1;
  min-height: 0;
}

.loading-spin {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.mail-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mail-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid var(--n-border-color);
  background: var(--n-card-color);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.mail-item:hover {
  border-color: var(--n-primary-color);
  background: var(--n-primary-color-hover);
}

.mail-item--selected {
  border-color: var(--n-primary-color) !important;
  background: linear-gradient(90deg,
    rgba(24, 160, 251, 0.15) 0%,
    rgba(24, 160, 251, 0.08) 50%,
    rgba(24, 160, 251, 0.03) 100%) !important;
  box-shadow:
    0 0 0 1px rgba(24, 160, 251, 0.3),
    0 2px 8px rgba(24, 160, 251, 0.15);
  transform: translateX(4px);
  position: relative;
  transition: all 0.2s ease;
}

.mail-item--selected::before {
  content: '';
  position: absolute;
  left: -2px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg,
    var(--n-primary-color) 0%,
    rgba(24, 160, 251, 0.8) 100%);
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 4px rgba(24, 160, 251, 0.4);
}

/* 深色模式下的选中效果 */
[data-theme="dark"] .mail-item--selected {
  background: linear-gradient(90deg,
    rgba(99, 179, 237, 0.2) 0%,
    rgba(99, 179, 237, 0.12) 50%,
    rgba(99, 179, 237, 0.05) 100%) !important;
  box-shadow:
    0 0 0 1px rgba(99, 179, 237, 0.4),
    0 2px 8px rgba(99, 179, 237, 0.2);
}

.mail-item--unread {
  border-left: 3px solid var(--n-primary-color);
}

.mail-item--unread .mail-subject {
  font-weight: 600;
}

.mail-item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.mail-from {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.from-icon {
  color: var(--n-text-color-2);
  flex-shrink: 0;
}

.from-text {
  font-size: 12px;
  color: var(--n-text-color-2);
  font-weight: 500;
}

.mail-time {
  font-size: 11px;
  color: var(--n-text-color-3);
  flex-shrink: 0;
}

.mail-subject {
  font-size: 14px;
  color: var(--n-text-color);
  font-weight: 500;
  line-height: 1.3;
  word-break: break-word;
}

.mail-preview {
  font-size: 12px;
  color: var(--n-text-color-2);
  line-height: 1.4;
  word-break: break-word;
}

.mail-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mail-tags {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mail-item-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  margin-left: 8px;
}

.mail-item:hover .mail-item-actions {
  opacity: 1;
}

.mail-count-info {
  flex-shrink: 0;
  padding-top: 8px;
  border-top: 1px solid var(--n-border-color);
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .mail-list-content {
    padding: 12px;
    gap: 10px;
  }

  .mail-item {
    padding: 10px;
  }

  .mail-item-actions {
    opacity: 1;
  }

  .mail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .mail-time {
    align-self: flex-end;
  }
}
</style>
