<template>
  <div class="email-manager">
    <!-- Header with Create Button -->
    <div class="manager-header">
      <div class="header-title">
        <n-icon size="20">
          <MailIcon />
        </n-icon>
        我的邮箱
        <n-badge
          v-if="emailStore.addresses.length > 0"
          :value="emailStore.addresses.length"
          :max="99"
          type="info"
          style="margin-left: 8px;"
        />
      </div>

      <div class="header-actions">
        <n-button
          type="primary"
          size="small"
          @click="showCreateModal = true"
          :loading="loading.creating"
        >
          <template #icon>
            <n-icon>
              <AddIcon />
            </n-icon>
          </template>
          生成新邮箱
        </n-button>

        <n-button
          size="small"
          quaternary
          circle
          @click="handleRefreshMails"
          :loading="loading.mails"
          title="刷新当前邮箱的邮件"
        >
          <template #icon>
            <n-icon>
              <RefreshIcon />
            </n-icon>
          </template>
        </n-button>
      </div>
    </div>

    <!-- Email List Section -->
    <div class="email-list-section">
      <div class="email-list">
        <n-scrollbar style="max-height: 100%;">
          <n-empty
            v-if="!emailStore.hasAddresses && !loading.addresses"
            description="还没有创建邮箱地址"
            size="small"
          >
            <template #icon>
              <n-icon size="48" color="#ccc">
                <MailIcon />
              </n-icon>
            </template>
            <template #extra>
              <n-text depth="3" style="font-size: 12px;">
                点击上方"生成新邮箱"来创建您的第一个临时邮箱
              </n-text>
            </template>
          </n-empty>

          <n-spin v-else-if="loading.addresses" class="loading-spin" />

          <div v-else class="email-items">
            <div
              v-for="address in emailStore.addresses"
              :key="address.id"
              class="email-item"
              :class="{ 
                'email-item--selected': emailStore.selectedAddress?.id === address.id 
              }"
              @click="handleSelectEmail(address)"
            >
              <div class="email-item-content">
                <div class="email-address">
                  <n-icon size="16" class="email-icon">
                    <MailIcon />
                  </n-icon>
                  <span class="address-text">{{ address.address }}</span>
                  <!-- 新邮件红点提醒 -->
                  <n-badge
                    v-if="getUnreadCount(address) > 0"
                    :value="getUnreadCount(address)"
                    :max="99"
                    type="error"
                    class="unread-badge"
                  />
                </div>
                <div class="email-meta">
                  <span class="email-name">{{ address.name }}</span>
                  <span class="email-date">{{ formatDate(address.created_at) }}</span>
                </div>
              </div>
              
              <div class="email-actions">
                <n-button
                  size="tiny"
                  quaternary
                  circle
                  @click.stop="copyEmailAddress(address.address)"
                  title="Copy Address"
                >
                  <template #icon>
                    <n-icon size="14">
                      <CopyIcon />
                    </n-icon>
                  </template>
                </n-button>
                
                <n-popconfirm
                  @positive-click="handleDeleteEmail(address.id)"
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
                      title="Delete Address"
                    >
                      <template #icon>
                        <n-icon size="14">
                          <DeleteIcon />
                        </n-icon>
                      </template>
                    </n-button>
                  </template>
                  Are you sure you want to delete this email address?
                </n-popconfirm>
              </div>
            </div>
          </div>
        </n-scrollbar>
      </div>
    </div>

    <!-- Create Email Modal -->
    <n-modal
      v-model:show="showCreateModal"
      preset="card"
      title="生成新邮箱"
      size="small"
      :bordered="false"
      :segmented="true"
    >
      <n-form ref="formRef" :model="form" :rules="rules" size="medium">
        <n-form-item path="name" label="邮箱前缀">
          <n-input
            v-model:value="form.name"
            placeholder="输入前缀或留空随机生成"
            :disabled="loading.creating"
          >
            <template #suffix>
              <n-button
                text
                size="small"
                @click="generateRandomPrefix"
                :disabled="loading.creating"
                title="随机生成前缀"
              >
                <n-icon size="16">
                  <DiceIcon />
                </n-icon>
              </n-button>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="domain" label="邮箱域名">
          <n-select
            v-model:value="form.domain"
            :options="domainOptions"
            placeholder="选择域名"
            :disabled="loading.creating"
          />
        </n-form-item>

        <div class="modal-actions">
          <n-button
            @click="showCreateModal = false"
            :disabled="loading.creating"
          >
            取消
          </n-button>
          <n-button
            type="primary"
            :loading="loading.creating"
            @click="handleCreateEmailAndClose"
          >
            <template #icon>
              <n-icon>
                <AddIcon />
              </n-icon>
            </template>
            生成邮箱
          </n-button>
        </div>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NIcon,
  NScrollbar,
  NEmpty,
  NSpin,
  NPopconfirm,
  NBadge,
  NText,
  NModal,
  useMessage,
  type FormInst,
  type FormRules
} from 'naive-ui'
import {
  Add as AddIcon,
  Mail as MailIcon,
  Refresh as RefreshIcon,
  Copy as CopyIcon,
  Trash as DeleteIcon,
  Dice as DiceIcon
} from '@vicons/ionicons5'
import { useEmailStore } from '@/stores'
import { generateRandomString, formatRelativeTime, copyToClipboard, COMMON_DOMAINS } from '@/utils/helpers'
import type { EmailAddress } from '@/types'

const emailStore = useEmailStore()
const message = useMessage()

// Modal state
const showCreateModal = ref(false)

// Form state
const formRef = ref<FormInst | null>(null)
const form = reactive({
  name: '',
  domain: 'yzcjwds.xyz'
})

// Loading states
const loading = computed(() => emailStore.loading)

// Domain options for select - 从store获取
const domainOptions = computed(() => {
  const domains = emailStore.userSettings?.domains || ['yzcjwds.xyz']
  return domains.map(domain => ({
    label: domain,
    value: domain
  }))
})

// Form validation rules
const rules: FormRules = {
  domain: [
    { required: true, message: 'Please select a domain', trigger: 'change' }
  ]
}

// Generate random prefix
function generateRandomPrefix() {
  form.name = generateRandomString(8)
}

// Handle create email and close modal
async function handleCreateEmailAndClose() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    const prefix = form.name.trim() || generateRandomString(8)
    await emailStore.createAddress(prefix, form.domain)

    // Reset form and close modal
    form.name = ''
    form.domain = COMMON_DOMAINS[0]
    showCreateModal.value = false

    message.success('邮箱创建成功！')
  } catch (error) {
    console.error('Create email error:', error)
  }
}

// Handle select email
function handleSelectEmail(address: EmailAddress) {
  emailStore.selectAddress(address)
}

// Handle delete email
async function handleDeleteEmail(id: string) {
  await emailStore.deleteAddress(id)
}

// Copy email address to clipboard
async function copyEmailAddress(address: string) {
  const success = await copyToClipboard(address)
  if (success) {
    message.success('邮箱地址已复制到剪贴板')
  } else {
    message.error('复制邮箱地址失败')
  }
}

// Refresh mails for selected address
async function handleRefreshMails() {
  if (emailStore.selectedAddress) {
    await emailStore.loadMails(emailStore.selectedAddress.address)
    message.success('邮件列表已刷新')
  } else {
    message.warning('请先选择一个邮箱地址')
  }
}



// Get unread mail count for an address
function getUnreadCount(address: EmailAddress): number {
  // 如果当前选中的地址就是这个地址，返回0（因为用户正在查看）
  if (emailStore.selectedAddress?.id === address.id) {
    return 0
  }

  // 返回该地址的邮件数量（作为未读数量）
  // 注意：这里使用 mail_count 字段，如果后端有专门的未读数量字段可以替换
  return parseInt(address.mail_count?.toString() || '0')
}

// Format date for display
function formatDate(dateString: string) {
  return formatRelativeTime(dateString)
}
</script>

<style scoped>
.email-manager {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.manager-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--n-card-color);
  border: 1px solid var(--n-border-color);
  border-radius: 6px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  color: var(--n-text-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.email-list-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--n-card-color);
  border: 1px solid var(--n-border-color);
  border-radius: 6px;
  overflow: hidden;
}

.email-list {
  flex: 1;
  min-height: 0;
  padding: 8px;
}

.loading-spin {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.email-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.email-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid var(--n-border-color);
  background: var(--n-card-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.email-item:hover {
  border-color: var(--n-primary-color);
  background: var(--n-primary-color-hover);
}

.email-item--selected {
  border-color: var(--n-primary-color);
  background: var(--n-primary-color-suppl);
}

.email-item-content {
  flex: 1;
  min-width: 0;
}

.email-address {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  position: relative;
}

.unread-badge {
  margin-left: auto;
  flex-shrink: 0;
}

.email-icon {
  color: var(--n-primary-color);
  flex-shrink: 0;
}

.address-text {
  font-weight: 500;
  color: var(--n-text-color);
  font-size: 13px;
  word-break: break-all;
}

.email-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.email-name {
  font-size: 12px;
  color: var(--n-text-color-2);
  font-weight: 500;
}

.email-date {
  font-size: 11px;
  color: var(--n-text-color-3);
  flex-shrink: 0;
}

.email-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.email-item:hover .email-actions {
  opacity: 1;
}

.quick-actions {
  flex-shrink: 0;
  padding-top: 8px;
  border-top: 1px solid var(--n-border-color);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .email-manager {
    padding: 12px;
    gap: 12px;
  }
  
  .email-item {
    padding: 10px;
  }
  
  .email-actions {
    opacity: 1; /* Always show on mobile */
  }

  .manager-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .header-actions {
    justify-content: space-between;
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
</style>
