<template>
  <div 
    v-if="useFallback" 
    v-html="htmlContent"
    class="html-fallback"
  />
  <div 
    v-else 
    ref="shadowHost" 
    class="shadow-host"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  htmlContent: string
}

const props = defineProps<Props>()

const shadowHost = ref<HTMLElement>()
const useFallback = ref(false)
let shadowRoot: ShadowRoot | null = null

function renderShadowDOM() {
  if (!shadowHost.value || useFallback.value) return

  try {
    // 创建 Shadow DOM
    if (!shadowRoot) {
      try {
        shadowRoot = shadowHost.value.attachShadow({ mode: 'closed' })
      } catch (error) {
        console.warn('Shadow DOM not supported, falling back to v-html:', error)
        useFallback.value = true
        return
      }
    }

    if (shadowRoot) {
      // 添加基础样式
      const styles = `
        <style>
          :host {
            display: block;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            word-wrap: break-word;
          }
          
          body {
            margin: 0;
            padding: 16px;
            font-family: inherit;
            line-height: inherit;
            color: inherit;
          }
          
          img { 
            max-width: 100%; 
            height: auto; 
            border-radius: 4px;
          }
          
          table { 
            border-collapse: collapse; 
            width: 100%; 
            margin: 8px 0;
          }
          
          td, th { 
            padding: 8px; 
            border: 1px solid #e0e0e0; 
            text-align: left;
          }
          
          th {
            background-color: #f5f5f5;
            font-weight: 600;
          }
          
          a { 
            color: #0066cc; 
            text-decoration: none;
          }
          
          a:hover {
            text-decoration: underline;
          }
          
          pre { 
            white-space: pre-wrap; 
            background: #f8f9fa;
            padding: 12px;
            border-radius: 4px;
            overflow-x: auto;
          }
          
          code {
            background: #f1f3f4;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          }
          
          blockquote {
            margin: 16px 0;
            padding: 12px 16px;
            border-left: 4px solid #e0e0e0;
            background: #f8f9fa;
            font-style: italic;
          }
          
          h1, h2, h3, h4, h5, h6 {
            margin: 16px 0 8px 0;
            line-height: 1.3;
          }
          
          p {
            margin: 8px 0;
          }
          
          ul, ol {
            margin: 8px 0;
            padding-left: 24px;
          }
          
          li {
            margin: 4px 0;
          }
          
          hr {
            border: none;
            border-top: 1px solid #e0e0e0;
            margin: 16px 0;
          }
          
          /* 暗色主题适配 */
          @media (prefers-color-scheme: dark) {
            :host {
              color: #e0e0e0;
            }
            
            table td, table th {
              border-color: #404040;
            }
            
            th {
              background-color: #2a2a2a;
            }
            
            pre {
              background: #1e1e1e;
              color: #e0e0e0;
            }
            
            code {
              background: #2a2a2a;
              color: #e0e0e0;
            }
            
            blockquote {
              background: #1e1e1e;
              border-left-color: #404040;
            }
            
            hr {
              border-top-color: #404040;
            }
          }
        </style>
      `
      
      shadowRoot.innerHTML = styles + props.htmlContent
    }
  } catch (error) {
    console.error('Failed to render Shadow DOM, falling back to v-html:', error)
    useFallback.value = true
  }
}

onMounted(() => {
  if (!useFallback.value) {
    renderShadowDOM()
  }
})

onUnmounted(() => {
  if (shadowRoot) {
    shadowRoot.innerHTML = ''
  }
  shadowRoot = null
})

watch(() => props.htmlContent, () => {
  renderShadowDOM()
}, { flush: 'post' })
</script>

<style scoped>
.shadow-host {
  display: block;
  min-height: 100px;
}

.html-fallback {
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--n-text-color);
  word-wrap: break-word;
}

.html-fallback img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.html-fallback table {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

.html-fallback td,
.html-fallback th {
  padding: 8px;
  border: 1px solid var(--n-border-color);
  text-align: left;
}

.html-fallback th {
  background-color: var(--n-card-color);
  font-weight: 600;
}

.html-fallback a {
  color: var(--n-primary-color);
  text-decoration: none;
}

.html-fallback a:hover {
  text-decoration: underline;
}

.html-fallback pre {
  white-space: pre-wrap;
  background: var(--n-code-color);
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
}

.html-fallback blockquote {
  margin: 16px 0;
  padding: 12px 16px;
  border-left: 4px solid var(--n-border-color);
  background: var(--n-card-color);
  font-style: italic;
}
</style>
