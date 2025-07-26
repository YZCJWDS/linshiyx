<template>
  <div class="send-mail-address-manager">
    <!-- Address List -->
    <n-scrollbar class="address-list">
      <div v-if="!emailStore.hasAddresses" class="empty-state">
        <n-empty description="暂无邮箱地址">
          <template #extra>
            <n-button type="primary" @click="handleShowCreateModal">
              创建邮箱地址
            </n-button>
          </template>
        </n-empty>
      </div>

      <div v-else class="address-items">
        <div
          v-for="address in emailStore.addresses"
          :key="address.id"
          class="address-item"
          :class="{ 
            'selected': selectedFromAddress?.id === address.id,
            'has-new-mails': getUnreadCount(address) > 0 
          }"
          @click="handleSelectFromAddress(address)"
        >
          <div class="address-info">
            <div class="address-main">
              <span class="address-text">{{ address.address }}</span>
              <n-badge
                v-if="getUnreadCount(address) > 0"
                :value="getUnreadCount(address)"
                :max="99"
                type="error"
                class="new-mail-badge"
              />
            </div>
            <div class="address-meta">
              <span class="address-date">{{ formatDate(address.created_at) }}</span>
            </div>
          </div>

          <div class="address-actions">
            <n-button
              size="tiny"
              quaternary
              circle
              @click.stop="copyEmailAddress(address.address)"
              title="复制邮箱地址"
            >
              <template #icon>
                <n-icon size="14">
                  <CopyIcon />
                </n-icon>
              </template>
            </n-button>

            <n-popconfirm
              @positive-click="handleDeleteEmail(address.id)"
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
                  title="删除邮箱地址"
                >
                  <template #icon>
                    <n-icon size="14">
                      <DeleteIcon />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              确定要删除这个邮箱地址吗？
            </n-popconfirm>
          </div>
        </div>
      </div>
    </n-scrollbar>

    <!-- Create Address Modal -->
    <n-modal
      v-model:show="showCreateModal"
      preset="card"
      title="创建新邮箱地址"
      class="create-modal"
      :mask-closable="false"
    >
      <n-form ref="formRef" :model="form" :rules="rules" size="large" class="modal-form">
        <n-form-item path="name" label="邮箱前缀" class="form-item">
          <n-input
            v-model:value="form.name"
            placeholder="输入前缀或留空随机生成"
            :disabled="loading.creating"
            size="large"
            class="form-input"
          >
            <template #suffix>
              <n-button
                text
                size="medium"
                @click="generateRandomPrefix"
                :disabled="loading.creating"
                title="随机生成前缀"
                class="dice-button"
              >
                <n-icon size="18">
                  <DiceIcon />
                </n-icon>
              </n-button>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="domain" label="邮箱域名" class="form-item">
          <n-select
            v-model:value="form.domain"
            :options="domainOptions"
            placeholder="选择域名"
            :disabled="loading.creating"
            size="large"
            class="form-select"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <div class="modal-footer">
          <n-button @click="showCreateModal = false" :disabled="loading.creating">
            取消
          </n-button>
          <n-button
            type="primary"
            @click="handleCreateEmailAndClose"
            :loading="loading.creating"
          >
            创建邮箱
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  NScrollbar,
  NEmpty,
  NButton,
  NBadge,
  NIcon,
  NPopconfirm,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  useMessage,
  type FormInst,
  type FormRules
} from 'naive-ui'
import {
  Copy as CopyIcon,
  Trash as DeleteIcon,
  Dice as DiceIcon
} from '@vicons/ionicons5'
import { useEmailStore, useUiStore } from '@/stores'
import { generateRandomString, formatRelativeTime, copyToClipboard, COMMON_DOMAINS } from '@/utils/helpers'
import type { EmailAddress } from '@/types'

const emailStore = useEmailStore()
const uiStore = useUiStore()
const message = useMessage()

// State
const selectedFromAddress = ref<EmailAddress | null>(null)
const showCreateModal = ref(false)
const formRef = ref<FormInst | null>(null)

// Form state
const form = reactive({
  name: '',
  domain: COMMON_DOMAINS[0]
})

const loading = reactive({
  creating: false
})

// Computed
const domainOptions = computed(() => 
  COMMON_DOMAINS.map(domain => ({
    label: domain,
    value: domain
  }))
)

// Form validation rules
const rules: FormRules = {
  domain: [
    { required: true, message: '请选择邮箱域名', trigger: 'change' }
  ]
}

// Methods
function handleSelectFromAddress(address: EmailAddress) {
  selectedFromAddress.value = address
  console.log('📧 Selected from address:', address.address)
}

function handleShowCreateModal() {
  showCreateModal.value = true
  form.name = ''
  form.domain = COMMON_DOMAINS[0]
}

function generateRandomPrefix() {
  form.name = generateRandomString(8)
}

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

async function handleDeleteEmail(id: string) {
  await emailStore.deleteAddress(id)
  if (selectedFromAddress.value?.id === id) {
    selectedFromAddress.value = null
  }
}

async function copyEmailAddress(address: string) {
  const success = await copyToClipboard(address)
  if (success) {
    message.success('邮箱地址已复制到剪贴板')
  } else {
    message.error('复制邮箱地址失败')
  }
}

function getUnreadCount(address: EmailAddress): number {
  return emailStore.getNewMailCount(address.address)
}

function formatDate(dateString: string) {
  return formatRelativeTime(dateString, uiStore.useUTCDate)
}

// Expose selected address for parent component
defineExpose({
  selectedFromAddress
})
</script>

<style scoped>
.send-mail-address-manager {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.address-list {
  flex: 1;
  padding: 8px;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
}

.address-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.address-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.5);
}

.address-item:hover {
  background: rgba(147, 112, 219, 0.1);
  border-color: rgba(147, 112, 219, 0.3);
  transform: translateY(-1px);
}

.address-item.selected {
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

.address-item.has-new-mails {
  border-left: 3px solid #e74c3c;
}

[data-theme="dark"] .address-item {
  background: rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .address-item:hover {
  background: rgba(147, 112, 219, 0.15);
  border-color: rgba(147, 112, 219, 0.4);
}

[data-theme="dark"] .address-item.selected {
  background: linear-gradient(145deg,
    rgba(147, 112, 219, 0.2) 0%,
    rgba(138, 43, 226, 0.12) 100%);
  border: 1px solid rgba(147, 112, 219, 0.5);
  box-shadow:
    inset 2px 2px 4px rgba(147, 112, 219, 0.3),
    inset -2px -2px 4px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(147, 112, 219, 0.2);
}

.address-info {
  flex: 1;
  min-width: 0;
}

.address-main {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.address-text {
  font-weight: 500;
  color: var(--n-text-color);
  font-size: 14px;
  word-break: break-all;
}

.new-mail-badge {
  flex-shrink: 0;
}

.address-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.address-date {
  font-size: 12px;
  color: var(--n-text-color-disabled);
}

.address-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.address-item:hover .address-actions {
  opacity: 1;
}

.create-modal {
  max-width: 500px;
}

.modal-form {
  margin-top: 16px;
}

.form-item {
  margin-bottom: 20px;
}

.form-input,
.form-select {
  width: 100%;
}

.dice-button {
  color: var(--n-text-color-disabled);
  transition: color 0.2s ease;
}

.dice-button:hover {
  color: var(--n-primary-color);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
