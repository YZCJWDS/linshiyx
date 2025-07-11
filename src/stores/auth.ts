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
      // 基于Cloudflare Workers常见认证方式
      const authMethods = [
        // Method 1: POST with password in body (最常见)
        {
          url: '/admin/user_settings',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        },
        // Method 2: Query parameter
        { url: `/admin/user_settings?password=${encodeURIComponent(password)}`, headers: {} },
        // Method 3: X-Password header (Cloudflare Workers常用)
        { url: '/admin/user_settings', headers: { 'X-Password': password } },
        // Method 4: Authorization header
        { url: '/admin/user_settings', headers: { 'Authorization': password } },
        // Method 5: Basic auth
        { url: '/admin/user_settings', headers: { 'Authorization': `Basic ${btoa(`admin:${password}`)}` } }
      ]

      for (const method of authMethods) {
        try {
          const fetchOptions: RequestInit = {
            method: method.method || 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...method.headers
            }
          }

          if (method.body) {
            fetchOptions.body = method.body
          }

          const response = await fetch(method.url, fetchOptions)

          if (response.ok) {
            adminPassword.value = password
            isAuthenticated.value = true

            // Save to localStorage for persistence
            localStorage.setItem('admin_password', password)
            localStorage.setItem('auth_method', JSON.stringify(method))

            // 保存管理员认证信息到 API 状态
            localStorage.setItem('adminAuth', password)
            console.log('🔐 Admin auth saved for API calls')

            // 清理旧的地址JWT，因为重新登录后可能需要重新获取
            clearOldAddressJWTs()

            // 认证成功，但不强制加载后端数据，让用户界面自然刷新
            console.log('🔐 Admin authenticated successfully')

            return true
          }
        } catch (error) {
          console.warn('Auth method failed:', method, error)
          continue
        }
      }

      return false
    } catch (error) {
      console.error('Auth test failed:', error)
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
    localStorage.removeItem('admin_password')

    // 登出时也清理地址JWT
    clearOldAddressJWTs()
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
