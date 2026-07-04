<template>
  <div class="sent-mail-list">
    <n-scrollbar class="mail-list">
      <!-- Local Storage Info -->
      <div class="local-storage-info">
        <n-card size="small" embedded>
          <template #header>
            <div style="display: flex; align-items: center; gap: 8px;">
              <n-icon size="20" color="var(--n-primary-color)">
                <FolderIcon />
              </n-icon>
              <span>本地记录存储</span>
            </div>
          </template>

          <n-space vertical size="small">
            <n-text depth="2">
              📁 每次发送邮件后，完整记录会自动保存到您选择的本地文件夹
            </n-text>
            <n-text depth="3" style="font-size: 12px;">
              • 首次发送时会提示选择保存位置<br>
              • 记录包含发送时间、收发件人、主题和完整内容<br>
              • 文件格式为JSON，可用任何文本编辑器查看
            </n-text>
          </n-space>
        </n-card>
      </div>

      <!-- Empty State -->
      <div v-if="sentMails.length === 0" class="empty-state">
        <n-empty description="已发送邮件记录保存在本地文件中">
          <template #icon>
            <n-icon size="48">
              <MailIcon />
            </n-icon>
          </template>
          <template #extra>
            <n-text depth="3">
              点击"发送新邮件"开始发送，记录将自动保存到本地
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
  NCard,
  NSpace,
  useMessage
} from 'naive-ui'
import {
  Mail as MailIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  Trash as DeleteIcon,
  Folder as FolderIcon
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
  --sent-item: rgba(255, 255, 255, 0.74);
  --sent-hover: rgba(79, 143, 199, 0.1);
  --sent-selected: linear-gradient(90deg, rgba(79, 143, 199, 0.18), rgba(255, 255, 255, 0.84));
  --sent-border: rgba(116, 146, 174, 0.22);
  --sent-shadow: 0 8px 22px rgba(48, 77, 108, 0.1);
}

[data-theme="dark"] .sent-mail-list {
  --sent-item: rgba(12, 26, 45, 0.74);
  --sent-hover: rgba(114, 184, 232, 0.13);
  --sent-selected: linear-gradient(90deg, rgba(114, 184, 232, 0.22), rgba(12, 26, 45, 0.9));
  --sent-border: rgba(148, 190, 225, 0.16);
  --sent-shadow: 0 8px 22px rgba(0, 0, 0, 0.22);
}

.mail-list {
  flex: 1;
  padding: 8px;
}

.local-storage-info {
  margin: 8px;
  margin-bottom: 16px;
}

.local-storage-info :deep(.n-card-header) {
  padding: 12px 16px;
}

.local-storage-info :deep(.n-card__content) {
  padding: 12px 16px;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
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
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--sent-border);
  background: var(--sent-item);
}

.mail-item:hover {
  background: var(--sent-hover);
  border-color: var(--n-primary-color);
  transform: translateY(-1px);
  box-shadow: var(--sent-shadow);
}

.mail-item.selected {
  background: var(--sent-selected);
  border: 1px solid var(--n-primary-color);
  box-shadow: inset 3px 0 0 var(--n-primary-color), var(--sent-shadow);
  transform: none;
}

[data-theme="dark"] .mail-item {
  background: var(--sent-item);
  border-color: var(--sent-border);
}

[data-theme="dark"] .mail-item:hover {
  background: var(--sent-hover);
  border-color: var(--n-primary-color);
}

[data-theme="dark"] .mail-item.selected {
  background: var(--sent-selected);
  border: 1px solid var(--n-primary-color);
  box-shadow: inset 3px 0 0 var(--n-primary-color), var(--sent-shadow);
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
