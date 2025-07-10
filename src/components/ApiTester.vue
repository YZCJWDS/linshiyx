<template>
  <n-card title="API 连接测试" size="small" style="margin-bottom: 16px;">
    <div class="api-tester">
      <n-space vertical>
        <n-alert v-if="testResult" :type="testResult.type" :title="testResult.title">
          {{ testResult.message }}
        </n-alert>
        
        <n-space>
          <n-button 
            type="primary" 
            size="small" 
            :loading="testing" 
            @click="testApiConnection"
          >
            <template #icon>
              <n-icon>
                <TestIcon />
              </n-icon>
            </template>
            测试 API 连接
          </n-button>
          
          <n-button 
            size="small" 
            :loading="testing" 
            @click="testCreateEndpoint"
          >
            测试创建端点
          </n-button>
          
          <n-button 
            size="small" 
            :loading="testing" 
            @click="clearResults"
          >
            清除结果
          </n-button>
        </n-space>
        
        <n-collapse v-if="testLogs.length > 0">
          <n-collapse-item title="详细日志" name="logs">
            <div class="test-logs">
              <div 
                v-for="(log, index) in testLogs" 
                :key="index" 
                :class="['log-item', log.type]"
              >
                <span class="log-time">{{ formatTime(log.time) }}</span>
                <span class="log-message">{{ log.message }}</span>
              </div>
            </div>
          </n-collapse-item>
        </n-collapse>
      </n-space>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NCard,
  NButton,
  NIcon,
  NSpace,
  NAlert,
  NCollapse,
  NCollapseItem
} from 'naive-ui'
import { Flask as TestIcon } from '@vicons/ionicons5'

interface TestResult {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}

interface TestLog {
  time: Date
  type: 'info' | 'success' | 'error' | 'warning'
  message: string
}

const testing = ref(false)
const testResult = ref<TestResult | null>(null)
const testLogs = ref<TestLog[]>([])

function addLog(type: TestLog['type'], message: string) {
  testLogs.value.push({
    time: new Date(),
    type,
    message
  })
}

function formatTime(time: Date): string {
  return time.toLocaleTimeString()
}

async function testApiConnection() {
  testing.value = true
  testResult.value = null
  testLogs.value = []
  
  try {
    addLog('info', '开始测试 API 连接...')
    
    // 测试基础连接
    const baseUrl = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://apimail.yzcjwds.xyz')
    addLog('info', `测试基础 URL: ${baseUrl}`)
    
    const response = await fetch(baseUrl)
    addLog('success', `基础连接成功，状态码: ${response.status}`)
    
    testResult.value = {
      type: 'success',
      title: '连接测试成功',
      message: `API 服务器响应正常 (状态码: ${response.status})`
    }
  } catch (error) {
    addLog('error', `连接失败: ${error instanceof Error ? error.message : '未知错误'}`)
    testResult.value = {
      type: 'error',
      title: '连接测试失败',
      message: error instanceof Error ? error.message : '未知网络错误'
    }
  } finally {
    testing.value = false
  }
}

async function testCreateEndpoint() {
  testing.value = true
  testResult.value = null
  
  try {
    addLog('info', '开始测试创建邮箱端点...')
    
    const baseUrl = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://apimail.yzcjwds.xyz')
    const endpoints = [
      '/admin/new_address',
      '/api/new_address', 
      '/admin/address',
      '/api/address',
      '/admin/create_address',
      '/api/create_address'
    ]
    
    const testData = {
      enablePrefix: true,
      name: 'test',
      domain: 'yzcjwds.xyz'
    }
    
    for (const endpoint of endpoints) {
      try {
        addLog('info', `测试端点: ${endpoint}`)
        
        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testData)
        })
        
        if (response.status === 405) {
          addLog('warning', `${endpoint}: 方法不允许 (405)`)
        } else if (response.status === 404) {
          addLog('warning', `${endpoint}: 端点未找到 (404)`)
        } else if (response.ok) {
          addLog('success', `${endpoint}: 响应成功 (${response.status})`)
          testResult.value = {
            type: 'success',
            title: '找到可用端点',
            message: `端点 ${endpoint} 响应正常`
          }
          break
        } else {
          addLog('error', `${endpoint}: 错误 (${response.status})`)
        }
      } catch (error) {
        addLog('error', `${endpoint}: ${error instanceof Error ? error.message : '请求失败'}`)
      }
    }
    
    if (!testResult.value) {
      testResult.value = {
        type: 'error',
        title: '所有端点测试失败',
        message: '没有找到可用的创建邮箱端点'
      }
    }
  } catch (error) {
    addLog('error', `测试过程出错: ${error instanceof Error ? error.message : '未知错误'}`)
    testResult.value = {
      type: 'error',
      title: '测试失败',
      message: error instanceof Error ? error.message : '未知错误'
    }
  } finally {
    testing.value = false
  }
}

function clearResults() {
  testResult.value = null
  testLogs.value = []
}
</script>

<style scoped>
.api-tester {
  width: 100%;
}

.test-logs {
  max-height: 300px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
}

.log-item {
  display: flex;
  margin-bottom: 4px;
  padding: 2px 4px;
  border-radius: 2px;
}

.log-item.info {
  background: #e6f7ff;
  color: #1890ff;
}

.log-item.success {
  background: #f6ffed;
  color: #52c41a;
}

.log-item.error {
  background: #fff2f0;
  color: #ff4d4f;
}

.log-item.warning {
  background: #fffbe6;
  color: #faad14;
}

.log-time {
  margin-right: 8px;
  font-weight: bold;
  min-width: 80px;
}

.log-message {
  flex: 1;
}
</style>
