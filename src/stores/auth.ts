import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const adminPassword = ref<string>('')
  const isAuthenticated = ref<boolean>(false)

  // Computed
  const hasValidAuth = computed(() => isAuthenticated.value && adminPassword.value)

  // Actions
  async function login(password: string): Promise<boolean> {
    try {
      // 基于示例前端，直接设置adminAuth，不需要验证API
      // 因为示例前端也是直接设置密码作为adminAuth
      console.log('🔐 Setting admin auth directly (like reference frontend)')

      adminPassword.value = password
      isAuthenticated.value = true

      // Save to localStorage for persistence
      localStorage.setItem('admin_password', password)
      localStorage.setItem('adminAuth', password)

      // 尝试获取JWT token（参考示例前端可能需要JWT）
      try {
        console.log('🔍 Trying to get JWT token for API calls...')
        // 使用管理员认证尝试获取JWT
        const response = await fetch('/api/settings', {
          headers: {
            'x-admin-auth': password,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.jwt) {
            localStorage.setItem('jwt', data.jwt)
            console.log('✅ Got JWT token from /api/settings')
          } else {
            console.log('ℹ️ No JWT in /api/settings response, will use adminAuth fallback')
          }
        } else {
          console.log('ℹ️ /api/settings failed, will use adminAuth fallback')
        }
      } catch (error) {
        console.log('ℹ️ Failed to get JWT, will use adminAuth fallback:', error)
      }

      // 清理旧的地址JWT，因为重新登录后可能需要重新获取
      clearOldAddressJWTs()

      console.log('🔐 Admin authenticated successfully (direct method)')
      return true
    } catch (error) {
      console.error('Auth setup failed:', error)
      return false
    }
  }

  // 清理旧的地址JWT
  function clearOldAddressJWTs() {
    console.log('🧹 Clearing old address JWTs after login...')
    const keysToRemove: string[] = []

    // 遍历localStorage找到所有地址JWT
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('address_jwt_')) {
        keysToRemove.push(key)
      }
    }

    // 删除所有旧的地址JWT
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
      console.log('🗑️ Removed old JWT:', key)
    })

    if (keysToRemove.length > 0) {
      console.log(`✅ Cleared ${keysToRemove.length} old address JWTs`)
    }
  }

  function logout() {
    adminPassword.value = ''
    isAuthenticated.value = false

    // 清理所有认证相关的localStorage
    localStorage.removeItem('admin_password')
    localStorage.removeItem('auth_method')
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('jwt')
    localStorage.removeItem('userJwt')
    localStorage.removeItem('auth')
    localStorage.removeItem('userAccessToken')

    // 登出时也清理地址JWT
    clearOldAddressJWTs()

    console.log('🔓 Admin logout completed, all auth data cleared')
  }

  async function initAuth() {
    // Try to restore from localStorage
    const savedPassword = localStorage.getItem('admin_password')
    if (savedPassword) {
      adminPassword.value = savedPassword
      isAuthenticated.value = true

      // 确保 API 认证状态也被设置
      localStorage.setItem('adminAuth', savedPassword)
      console.log('🔐 Restored admin auth for API calls')

      // 不在这里加载邮箱池，让 emailStore 的 initializeStore 处理
      console.log('🔐 Admin auth restored, email store will handle data loading')
    }
  }

  function getAuthHeaders() {
    if (!hasValidAuth.value) {
      return {}
    }

    // Try to use the saved auth method
    const savedMethod = localStorage.getItem('auth_method')
    if (savedMethod) {
      try {
        const method = JSON.parse(savedMethod)
        return method.headers || {}
      } catch (error) {
        console.warn('Failed to parse saved auth method:', error)
      }
    }

    // Fallback to Bearer token
    return {
      'Authorization': `Bearer ${adminPassword.value}`
    }
  }

  function getAuthUrl(endpoint: string) {
    if (!hasValidAuth.value) {
      return endpoint
    }

    // Try to use the saved auth method
    const savedMethod = localStorage.getItem('auth_method')
    if (savedMethod) {
      try {
        const method = JSON.parse(savedMethod)
        if (method.url.includes('?password=')) {
          // Use query parameter method
          const separator = endpoint.includes('?') ? '&' : '?'
          return `${endpoint}${separator}password=${encodeURIComponent(adminPassword.value)}`
        }
      } catch (error) {
        console.warn('Failed to parse saved auth method:', error)
      }
    }

    return endpoint
  }

  return {
    // State
    adminPassword,
    isAuthenticated,

    // Computed
    hasValidAuth,

    // Actions
    login,
    logout,
    initAuth,
    getAuthHeaders,
    getAuthUrl
  }
})
