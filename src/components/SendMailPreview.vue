<template>
  <div class="send-mail-preview">
    <n-scrollbar class="preview-content">
      <div v-if="!hasPreviewData" class="empty-state">
        <n-empty description="开始撰写邮件以查看预览">
          <template #icon>
            <n-icon size="48">
              <EyeIcon />
            </n-icon>
          </template>
        </n-empty>
      </div>

      <div v-else class="preview-container">
        <!-- Mail Header -->
        <div class="mail-header">
          <div class="header-row">
            <span class="header-label">发件人:</span>
            <span class="header-value">
              {{ previewData.fromName ? `${previewData.fromName} <${previewData.fromMail}>` : previewData.fromMail }}
            </span>
          </div>
          
          <div class="header-row">
            <span class="header-label">收件人:</span>
            <span class="header-value">
              {{ previewData.toName ? `${previewData.toName} <${previewData.toMail}>` : previewData.toMail }}
            </span>
          </div>
          
          <div class="header-row">
            <span class="header-label">主题:</span>
            <span class="header-value">{{ previewData.subject || '(无主题)' }}</span>
          </div>
          
          <div class="header-row">
            <span class="header-label">类型:</span>
            <n-tag :type="previewData.isHtml ? 'info' : 'default'" size="small">
              {{ previewData.isHtml ? 'HTML邮件' : '纯文本邮件' }}
            </n-tag>
          </div>
        </div>

        <!-- Mail Content -->
        <div class="mail-content">
          <div class="content-header">
            <h3>邮件内容预览</h3>
          </div>
          
          <div class="content-body">
            <!-- HTML Content -->
            <div v-if="previewData.isHtml" class="html-content">
              <div class="html-preview" v-html="previewData.content"></div>
            </div>
            
            <!-- Text Content -->
            <div v-else class="text-content">
              <pre class="text-preview">{{ previewData.content }}</pre>
            </div>
          </div>
        </div>

        <!-- Preview Info -->
        <div class="preview-info">
          <n-alert type="info" :show-icon="false">
            <template #header>
              <n-icon>
                <InfoIcon />
              </n-icon>
              预览说明
            </template>
            这是邮件发送前的预览效果。实际收件人看到的效果可能因邮件客户端而异。
          </n-alert>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  NScrollbar,
  NEmpty,
  NIcon,
  NTag,
  NAlert
} from 'naive-ui'
import {
  Eye as EyeIcon,
  InformationCircle as InfoIcon
} from '@vicons/ionicons5'

// 从父组件注入邮件数据（如果有的话）
// 这里我们假设父组件会提供预览数据
const previewData = computed(() => {
  // 这里应该从父组件或store获取当前正在编辑的邮件数据
  // 暂时返回空数据，实际使用时需要连接到SendMailComposer的数据
  return {
    fromName: '',
    fromMail: '',
    toName: '',
    toMail: '',
    subject: '',
    content: '',
    isHtml: false
  }
})

const hasPreviewData = computed(() => {
  return previewData.value.fromMail && 
         previewData.value.toMail && 
         previewData.value.subject &&
         previewData.value.content
})
</script>

<style scoped>
.send-mail-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-content {
  flex: 1;
  padding: 16px;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.preview-container {
  max-width: 100%;
}

.mail-header {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

[data-theme="dark"] .mail-header {
  background: rgba(255, 255, 255, 0.05);
}

.header-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
}

.header-row:last-child {
  margin-bottom: 0;
}

.header-label {
  font-weight: 600;
  color: var(--n-text-color);
  min-width: 60px;
  flex-shrink: 0;
}

.header-value {
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

.html-preview {
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

.text-preview {
  padding: 16px;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: var(--n-text-color);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.preview-info {
  margin-top: 16px;
}

/* Responsive design */
@media (max-width: 768px) {
  .preview-content {
    padding: 12px;
  }
  
  .mail-header,
  .content-body {
    padding: 12px;
  }
  
  .header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .header-label {
    min-width: auto;
  }
}
</style>
