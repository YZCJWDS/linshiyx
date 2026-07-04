import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_BASE_URL } from '@/utils/config'

export const useAuthStore = defineStore('auth', () => {
  // State
  const adminPassword = ref<string>('')
  const isAuthenticated = ref<boolean>(false)

  // Computed
  const hasValidAuth = computed(() => isAuthenticated.value && adminPassword.value)

  // Actions
  async function login(password: string): Promise<boolean> {
    try {
      // 通过调用需要管理员权限的API来验证密码
      // 使用 /admin/address 来验证，因为我们知道这个API存在且需要管理员权限
      console.log('🔐 Verifying admin password with backend...')

      const response = await fetch(`${API_BASE_URL}/admin/address?limit=1&offset=0`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': password  // 使用密码作为认证头进行验证
        }
      })

      if (!response.ok) {
        console.error('❌ Admin password verification failed:', response.status)
        if (response.status === 401 || response.status === 403) {
          throw new Error('管理员密码错误')
        } else {
          throw new Error('验证失败，请稍后重试')
        }
      }

      // 如果能成功获取地址列表，说明密码正确
      const data = await response.json()
      console.log('✅ Admin password verified successfully')

      // 验证成功后设置认证状态
      adminPassword.value = password
      isAuthenticated.value = true

      // Save to localStorage for persistence
      localStorage.setItem('admin_password', password)
      localStorage.setItem('adminAuth', password)

      // 地址API不返回JWT，但验证成功说明密码正确
      console.log('✅ Password verification successful, admin access granted')

      // 清理旧的地址JWT，因为重新登录后可能需要重新获取
      clearOldAddressJWTs()

      console.log('🔐 Admin authenticated successfully')
      return true
    } catch (error) {
      console.error('Auth setup failed:', error)
      // 清理可能的错误状态
      adminPassword.value = ''
      isAuthenticated.value = false
      localStorage.removeItem('admin_password')
      localStorage.removeItem('adminAuth')
      localStorage.removeItem('jwt')

      throw error // 重新抛出错误，让UI层处理
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
