<template>
  <div class="send-mail-composer">
    <n-scrollbar class="composer-content">
      <div class="composer-form">
        <n-form ref="formRef" :model="mailForm" :rules="rules" size="large">
          <!-- From Address (Display Only) -->
          <n-form-item label="发件人">
            <n-input
              :value="fromAddress?.address || '请先选择发件邮箱'"
              readonly
              placeholder="发件邮箱"
            />
          </n-form-item>

          <!-- To Address -->
          <n-form-item path="toMail" label="收件人">
            <n-input
              v-model:value="mailForm.toMail"
              placeholder="收件人邮箱地址"
            />
          </n-form-item>

          <!-- Subject -->
          <n-form-item path="subject" label="主题">
            <n-input
              v-model:value="mailForm.subject"
              placeholder="邮件主题"
            />
          </n-form-item>

          <!-- Content Type Options -->
          <n-form-item label="内容类型">
            <n-radio-group v-model:value="mailForm.contentType">
              <n-radio-button value="text">文本</n-radio-button>
              <n-radio-button value="html">HTML</n-radio-button>
              <n-radio-button value="rich">富文本</n-radio-button>
            </n-radio-group>
            
            <n-button
              v-if="mailForm.contentType !== 'text'"
              size="small"
              @click="togglePreview"
              style="margin-left: 12px"
            >
              {{ showPreview ? '编辑' : '预览' }}
            </n-button>
          </n-form-item>

          <!-- Content -->
          <n-form-item path="content" label="邮件内容">
            <!-- Preview Mode -->
            <div v-if="showPreview" class="content-preview">
              <n-card embedded>
                <div v-html="mailForm.content"></div>
              </n-card>
            </div>
            
            <!-- Rich Text Editor -->
            <div v-else-if="mailForm.contentType === 'rich'" class="rich-editor">
              <div class="editor-container">
                <!-- Rich text editor will be implemented here -->
                <n-input
                  v-model:value="mailForm.content"
                  type="textarea"
                  placeholder="请输入邮件内容..."
                  :autosize="{ minRows: 10, maxRows: 20 }"
                />
                <n-text depth="3" style="font-size: 12px; margin-top: 8px;">
                  富文本编辑器功能开发中，当前使用文本模式
                </n-text>
              </div>
            </div>
            
            <!-- HTML/Text Editor -->
            <n-input
              v-else
              v-model:value="mailForm.content"
              type="textarea"
              :placeholder="mailForm.contentType === 'html' ? '请输入HTML内容...' : '请输入邮件内容...'"
              :autosize="{ minRows: 10, maxRows: 20 }"
            />
          </n-form-item>
        </n-form>
      </div>
    </n-scrollbar>


  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  NScrollbar,
  NForm,
  NFormItem,
  NInput,
  NInputGroup,
  NSelect,
  NRadioGroup,
  NRadioButton,
  NButton,
  NCard,
  NIcon,
  NText,
  useMessage,
  type FormInst,
  type FormRules
} from 'naive-ui'
import {
  Send as SendIcon
} from '@vicons/ionicons5'
import { useEmailStore } from '@/stores'
import { mailApi, emailRecordSaver } from '@/utils/api'
import type { SendMailRequest } from '@/types'

// Define props
const props = defineProps<{
  fromAddress?: { address: string } | null
}>()

// Define emits
const emit = defineEmits<{
  sent: []
  cancel: []
}>()

const emailStore = useEmailStore()
const message = useMessage()

// State
const formRef = ref<FormInst | null>(null)
const sending = ref(false)
const showPreview = ref(false)

// Form data - 完全按照示例前端的格式
const mailForm = reactive({
  toMail: '',
  subject: '',
  contentType: 'text' as 'text' | 'html' | 'rich',
  content: ''
})

// Computed
const fromAddress = computed(() => props.fromAddress)



// Form validation rules
const rules: FormRules = {
  toMail: [
    { required: true, message: '请输入收件人邮箱', trigger: 'blur' },
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: '请输入有效的邮箱地址',
      trigger: 'blur'
    }
  ],
  subject: [
    { required: true, message: '请输入邮件主题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入邮件内容', trigger: 'blur' }
  ]
}

// Methods
function togglePreview() {
  showPreview.value = !showPreview.value
}

async function handleSendMail() {
  if (!formRef.value) return

  // 检查是否选择了发件邮箱
  if (!fromAddress.value?.address) {
    message.error('请先选择发件邮箱')
    return
  }

  try {
    await formRef.value.validate()

    sending.value = true
    console.log('📧 Sending mail with data:', mailForm)

    // 构建发送数据，完全按照示例前端的格式
    const sendData: SendMailRequest = {
      from_name: '',
      from_mail: fromAddress.value.address,
      to_name: '',
      to_mail: mailForm.toMail,
      subject: mailForm.subject,
      is_html: mailForm.contentType !== 'text',
      content: mailForm.content
    }

    // 使用管理员API发送邮件，完全按照示例前端的调用方式
    await mailApi.sendByAdmin(sendData)

    // 邮件发送成功后，保存记录到本地
    try {
      const mailRecord = {
        from_mail: fromAddress.value.address,
        to_mail: mailForm.toMail,
        subject: mailForm.subject,
        content: mailForm.content,
        is_html: mailForm.contentType !== 'text',
        sent_at: new Date().toISOString()
      }

      await emailRecordSaver.saveMailRecord(mailRecord)
      console.log('✅ Mail record saved successfully')
    } catch (saveError) {
      console.error('❌ Failed to save mail record:', saveError)
      // 保存失败不影响邮件发送成功的提示
      message.warning('邮件发送成功，但保存记录失败')
    }

    // 重置表单
    Object.assign(mailForm, {
      toMail: '',
      subject: '',
      contentType: 'text',
      content: ''
    })

    // 通知父组件
    emit('sent')

    console.log('✅ Mail sent successfully')
  } catch (error) {
    console.error('Failed to send mail:', error)
    message.error(error instanceof Error ? error.message : '发送邮件失败')
  } finally {
    sending.value = false
  }
}

// Expose methods for parent component
defineExpose({
  sendMail: handleSendMail
})
</script>

<style scoped>
.send-mail-composer {
  height: 100%;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  --composer-panel: rgba(255, 255, 255, 0.72);
  --composer-border: rgba(116, 146, 174, 0.22);
}

[data-theme="dark"] .send-mail-composer {
  --composer-panel: rgba(12, 26, 45, 0.72);
  --composer-border: rgba(148, 190, 225, 0.16);
}

.composer-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  min-height: 0;
}

.composer-form {
  max-width: 100%;
}

.content-preview {
  border: 1px solid var(--composer-border);
  border-radius: 6px;
  min-height: 200px;
  background: var(--composer-panel);
}

.rich-editor {
  border: 1px solid var(--composer-border);
  border-radius: 6px;
  background: var(--composer-panel);
}

.editor-container {
  padding: 8px;
}



/* 发送按钮特殊样式 */
.send-button {
  min-width: 120px;
  font-weight: 600;
}

.send-button:not(:disabled) {
  background: linear-gradient(135deg, #4f8fc7 0%, #68b6ce 100%);
  box-shadow: 0 4px 12px rgba(79, 143, 199, 0.26);
}

.send-button:not(:disabled):hover {
  background: linear-gradient(135deg, #579bd4 0%, #66d1d1 100%);
  box-shadow: 0 6px 16px rgba(79, 143, 199, 0.34);
  transform: translateY(-1px);
}

/* Form styling */
:deep(.n-form-item-label) {
  font-weight: 500;
}

:deep(.n-input-group) {
  width: 100%;
}

:deep(.n-radio-group) {
  display: flex;
  gap: 8px;
}

/* Responsive design */
@media (max-width: 768px) {
  .composer-content {
    padding: 12px;
  }

  :deep(.n-input-group .n-input:first-child) {
    width: 35% !important;
  }

  :deep(.n-input-group .n-input:last-child),
  :deep(.n-input-group .n-select) {
    width: 65% !important;
  }
}
</style>
