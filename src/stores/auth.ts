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

  function logout() {
    adminPassword.value = ''
    isAuthenticated.value = false
    localStorage.removeItem('admin_password')
  }

  function initAuth() {
    // Try to restore from localStorage
    const savedPassword = localStorage.getItem('admin_password')
    if (savedPassword) {
      adminPassword.value = savedPassword
      isAuthenticated.value = true
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
