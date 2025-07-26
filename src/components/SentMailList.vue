<template>
  <div class="sent-mail-list">
    <n-scrollbar class="mail-list">
      <!-- Empty State -->
      <div v-if="sentMails.length === 0" class="empty-state">
        <n-empty description="暂无已发送邮件">
          <template #icon>
            <n-icon size="48">
              <MailIcon />
            </n-icon>
          </template>
          <template #extra>
            <n-text depth="3">
              点击"撰写邮件"开始发送您的第一封邮件
            </n-text>
          </template>
        </n-empty>
      </div>

      <!-- Mail Items -->
      <div v-else class="mail-items">
        <div
          v-for="mail in sentMails"
          :key="mail.id"
          class="mail-item"
          :class="{ 'selected': selectedMail?.id === mail.id }"
          @click="handleSelectMail(mail)"
        >
          <div class="mail-info">
            <div class="mail-header">
              <div class="mail-to">
                <n-icon size="14" class="to-icon">
                  <ArrowForwardIcon />
                </n-icon>
                <span class="to-address">{{ mail.to_mail }}</span>
              </div>
              <div class="mail-date">
                {{ formatDate(mail.sent_at) }}
              </div>
            </div>
            
            <div class="mail-subject">
              {{ mail.subject || '(无主题)' }}
            </div>
            
            <div class="mail-preview">
              {{ getContentPreview(mail.content) }}
            </div>
            
            <div class="mail-meta">
              <n-tag
                :type="mail.is_html ? 'info' : 'default'"
                size="small"
                round
              >
                {{ mail.is_html ? 'HTML' : '文本' }}
              </n-tag>
              
              <n-tag
                :type="mail.status === 'sent' ? 'success' : 'warning'"
                size="small"
                round
              >
                {{ getStatusText(mail.status) }}
              </n-tag>
            </div>
          </div>

          <div class="mail-actions">
            <n-button
              size="tiny"
              quaternary
              circle
              @click.stop="handleResendMail(mail)"
              title="重新发送"
            >
              <template #icon>
                <n-icon size="14">
                  <RefreshIcon />
                </n-icon>
              </template>
            </n-button>

            <n-popconfirm
              @positive-click="handleDeleteMail(mail.id)"
              negative-text="取消"
              positive-text="删除"
            >
              <template #trigger>
                <n-button
                  size="tiny"
                  quaternary
                  circle
                  type="error"
                  @click.stop
                  title="删除邮件"
                >
                  <template #icon>
                    <n-icon size="14">
                      <DeleteIcon />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              确定要删除这封已发送的邮件记录吗？
            </n-popconfirm>
          </div>
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
  NText,
  NTag,
  NButton,
  NPopconfirm,
  useMessage
} from 'naive-ui'
import {
  Mail as MailIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  Trash as DeleteIcon
} from '@vicons/ionicons5'
import { formatRelativeTime } from '@/utils/helpers'
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

// State - 模拟数据，实际应该从API获取
const sentMails = ref<SentMail[]>([
  // 这里可以添加一些示例数据用于测试
])

const selectedMail = ref<SentMail | null>(null)

// Methods
function handleSelectMail(mail: SentMail) {
  selectedMail.value = mail
  console.log('📧 Selected sent mail:', mail.id)
}

function handleResendMail(mail: SentMail) {
  console.log('🔄 Resending mail:', mail.id)
  message.info('重新发送功能开发中')
  // TODO: 实现重新发送逻辑
}

function handleDeleteMail(mailId: string) {
  const index = sentMails.value.findIndex(mail => mail.id === mailId)
  if (index > -1) {
    sentMails.value.splice(index, 1)
    if (selectedMail.value?.id === mailId) {
      selectedMail.value = null
    }
    message.success('已删除邮件记录')
  }
}

function getContentPreview(content: string): string {
  if (!content) return '(无内容)'
  
  // 移除HTML标签
  const textContent = content.replace(/<[^>]*>/g, '')
  
  // 截取前100个字符
  return textContent.length > 100 
    ? textContent.substring(0, 100) + '...'
    : textContent
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
      return '未知'
  }
}

function formatDate(dateString: string) {
  return formatRelativeTime(dateString, uiStore.useUTCDate)
}

// Expose selected mail for parent component
defineExpose({
  selectedMail
})
</script>

<style scoped>
.sent-mail-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mail-list {
  flex: 1;
  padding: 8px;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.mail-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mail-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.5);
}

.mail-item:hover {
  background: rgba(147, 112, 219, 0.1);
  border-color: rgba(147, 112, 219, 0.3);
  transform: translateY(-1px);
}

.mail-item.selected {
  background: linear-gradient(145deg,
    rgba(147, 112, 219, 0.15) 0%,
    rgba(138, 43, 226, 0.08) 100%);
  border: 1px solid rgba(147, 112, 219, 0.4);
  box-shadow:
    inset 2px 2px 4px rgba(147, 112, 219, 0.2),
    inset -2px -2px 4px rgba(255, 255, 255, 0.1),
    0 2px 8px rgba(147, 112, 219, 0.15);
  transform: translateY(1px);
}

[data-theme="dark"] .mail-item {
  background: rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .mail-item:hover {
  background: rgba(147, 112, 219, 0.15);
  border-color: rgba(147, 112, 219, 0.4);
}

[data-theme="dark"] .mail-item.selected {
  background: linear-gradient(145deg,
    rgba(147, 112, 219, 0.2) 0%,
    rgba(138, 43, 226, 0.12) 100%);
  border: 1px solid rgba(147, 112, 219, 0.5);
  box-shadow:
    inset 2px 2px 4px rgba(147, 112, 219, 0.3),
    inset -2px -2px 4px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(147, 112, 219, 0.2);
}

.mail-info {
  flex: 1;
  min-width: 0;
}

.mail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.mail-to {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.to-icon {
  color: var(--n-text-color-disabled);
  flex-shrink: 0;
}

.to-address {
  font-size: 13px;
  color: var(--n-text-color);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mail-date {
  font-size: 12px;
  color: var(--n-text-color-disabled);
  flex-shrink: 0;
}

.mail-subject {
  font-size: 14px;
  font-weight: 600;
  color: var(--n-text-color);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mail-preview {
  font-size: 13px;
  color: var(--n-text-color-disabled);
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mail-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.mail-actions {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  margin-left: 12px;
}

.mail-item:hover .mail-actions {
  opacity: 1;
}

/* Responsive design */
@media (max-width: 768px) {
  .mail-item {
    padding: 12px;
  }
  
  .mail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .mail-actions {
    opacity: 1;
    margin-left: 8px;
  }
}
</style>
