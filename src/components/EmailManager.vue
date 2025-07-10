<template>
  <div class="email-manager">
    <!-- Generate New Email Section -->
    <div class="generate-section">
      <n-card size="small" :bordered="false">
        <template #header>
          <div class="section-header">
            <n-icon size="18">
              <AddIcon />
            </n-icon>
            生成新邮箱
          </div>
        </template>
        
        <n-form ref="formRef" :model="form" :rules="rules" size="small">
          <n-form-item path="name" label="前缀">
            <n-input
              v-model:value="form.name"
              placeholder="输入前缀或留空随机生成"
              :disabled="loading.creating"
            >
              <template #suffix>
                <n-button
                  text
                  size="tiny"
                  @click="generateRandomPrefix"
                  :disabled="loading.creating"
                >
                  <n-icon size="14">
                    <DiceIcon />
                  </n-icon>
                </n-button>
              </template>
            </n-input>
          </n-form-item>
          
          <n-form-item path="domain" label="域名">
            <n-select
              v-model:value="form.domain"
              :options="domainOptions"
              placeholder="选择域名"
              :disabled="loading.creating"
            />
          </n-form-item>
          
          <n-form-item>
            <n-button
              type="primary"
              block
              :loading="loading.creating"
              @click="handleCreateEmail"
            >
              <template #icon>
                <n-icon>
                  <AddIcon />
                </n-icon>
              </template>
              生成邮箱
            </n-button>
          </n-form-item>
        </n-form>
      </n-card>
    </div>

    <!-- Email List Section -->
    <div class="email-list-section">
      <div class="list-header">
        <span class="list-title">
          我的邮箱
          <n-badge
            v-if="emailStore.addresses.length > 0"
            :value="emailStore.addresses.length"
            :max="99"
            type="info"
            style="margin-left: 8px;"
          />
        </span>
        <n-button
          size="small"
          quaternary
          circle
          @click="emailStore.loadAddresses"
          :loading="loading.addresses"
          title="刷新邮箱列表"
        >
          <template #icon>
            <n-icon>
              <RefreshIcon />
            </n-icon>
          </template>
        </n-button>
      </div>

      <div class="email-list">
        <n-scrollbar style="max-height: 400px;">
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

    <!-- Quick Actions -->
    <div class="quick-actions">
      <n-button
        size="small"
        quaternary
        block
        @click="clearAllSelection"
        :disabled="!emailStore.selectedAddress"
      >
        <template #icon>
          <n-icon>
            <ClearIcon />
          </n-icon>
        </template>
        Clear Selection
      </n-button>
    </div>
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
  Close as ClearIcon,
  Dice as DiceIcon
} from '@vicons/ionicons5'
import { useEmailStore } from '@/stores'
import { generateRandomString, formatRelativeTime, copyToClipboard, COMMON_DOMAINS } from '@/utils/helpers'
import type { EmailAddress } from '@/types'

const emailStore = useEmailStore()
const message = useMessage()

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

// Handle create email
async function handleCreateEmail() {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    const prefix = form.name.trim() || generateRandomString(8)
    await emailStore.createAddress(prefix, form.domain)
    
    // Reset form
    form.name = ''
    form.domain = COMMON_DOMAINS[0]
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
    message.success('Email address copied to clipboard')
  } else {
    message.error('Failed to copy email address')
  }
}

// Clear all selection
function clearAllSelection() {
  emailStore.clearSelection()
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

.generate-section {
  flex-shrink: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.email-list-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 4px;
}

.list-title {
  font-weight: 600;
  color: var(--n-text-color);
}

.email-list {
  flex: 1;
  min-height: 0;
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
}
</style>
