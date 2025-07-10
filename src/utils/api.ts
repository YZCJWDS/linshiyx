import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type {
  ApiResponse,
  EmailAddress,
  EmailMessage,
  CreateAddressRequest,
  SendMailRequest,
  GetMailsRequest,
  UserSettings
} from '@/types'

// API Base Configuration - 完全按照参考前端的配置
const API_BASE_URL = 'https://apimail.yzcjwds.xyz'

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

// 创建 axios 实例 - 完全按照参考前端的配置
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30秒超时
  validateStatus: (status) => status >= 200 && status <= 500
})

// 存储认证信息的状态
let authState = {
  jwt: '',
  userJwt: '',
  customAuth: '',
  adminAuth: '',
  userAccessToken: '',
  loading: false
}

// 获取存储的认证信息
function getStoredAuth() {
  authState.jwt = localStorage.getItem('jwt') || ''
  authState.userJwt = localStorage.getItem('userJwt') || ''
  authState.customAuth = localStorage.getItem('auth') || ''
  authState.adminAuth = localStorage.getItem('adminAuth') || ''
  authState.userAccessToken = localStorage.getItem('userAccessToken') || ''
}

// 保存认证信息
function saveAuth(key: string, value: string) {
  localStorage.setItem(key, value)
  switch (key) {
    case 'jwt':
      authState.jwt = value
      break
    case 'userJwt':
      authState.userJwt = value
      break
    case 'auth':
      authState.customAuth = value
      break
    case 'adminAuth':
      authState.adminAuth = value
      break
    case 'userAccessToken':
      authState.userAccessToken = value
      break
  }
}

// 初始化认证状态
getStoredAuth()

// 生成随机ID
function generateRandomId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// 通用请求函数 - 完全按照参考前端的实现
async function apiFetch<T>(url: string, options: AxiosRequestConfig = {}): Promise<T> {
  authState.loading = true

  try {
    const config: AxiosRequestConfig = {
      url,
      method: options.method || 'GET',
      data: options.data || null,
      headers: {
        'x-lang': 'zh', // 默认中文
        'x-user-token': options.userJwt || authState.userJwt,
        'x-user-access-token': authState.userAccessToken,
        'x-custom-auth': authState.customAuth,
        'x-admin-auth': authState.adminAuth,
        'Authorization': `Bearer ${authState.jwt}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    const response = await apiClient.request(config)

    // 处理认证错误 - 按照参考前端的逻辑
    if (response.status === 401) {
      if (url.startsWith('/admin')) {
        console.warn('Admin authentication required')
        // 这里可以触发管理员登录弹窗
      } else {
        console.warn('User authentication required')
        // 这里可以触发用户登录弹窗
      }
    }

    if (response.status >= 300) {
      throw new ApiError(`[${response.status}]: ${response.data}` || 'error', response.status)
    }

    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new ApiError(`Code ${error.response.status}: ${error.response.data}` || 'error', error.response.status)
    }
    throw error
  } finally {
    authState.loading = false
  }
}

// 导出认证相关函数供外部使用
export const auth = {
  saveAuth,
  getStoredAuth,
  getAuthState: () => authState
}

// Email Address API - 完全按照参考前端的调用方式
export const addressApi = {
  // Create new temporary email address - 按照参考前端的格式
  async create(data: CreateAddressRequest): Promise<EmailAddress> {
    console.log('Creating address with data:', data)

    // 完全按照参考前端的调用方式
    const response = await apiFetch<{ address: string, jwt: string }>('/api/new_address', {
      method: 'POST',
      data: {
        name: data.name,
        domain: data.domain,
        cf_token: data.cf_token || '' // 添加 cf_token 支持
      }
    })

    // 保存 JWT 到本地存储
    if (response.jwt) {
      saveAuth('jwt', response.jwt)
    }

    // 转换后端响应格式为前端期望的格式
    const emailAddress: EmailAddress = {
      id: generateRandomId(),
      name: data.name || '',
      address: response.address,
      domain: data.domain,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      jwt: response.jwt
    }

    console.log('Created address:', emailAddress)
    return emailAddress
  },

  // Get all addresses with pagination - 按照参考前端的方式
  async getAll(limit = 20, offset = 0, query = ''): Promise<{ results: EmailAddress[], count: number }> {
    try {
      // 尝试调用后端的地址列表 API
      const response = await apiFetch<{ results: EmailAddress[], count: number }>(`/admin/address?limit=${limit}&offset=${offset}${query ? `&query=${query}` : ''}`)
      return response
    } catch (error) {
      console.warn('Failed to get addresses from backend:', error)
      // 如果后端不支持，返回空结果
      return { results: [], count: 0 }
    }
  },

  // Delete address - 按照参考前端的方式
  async delete(id: string): Promise<void> {
    try {
      await apiFetch<void>(`/admin/address/${id}`, {
        method: 'DELETE'
      })
      console.log('Deleted address:', id)
    } catch (error) {
      console.warn('Failed to delete address:', error)
      throw error
    }
  },
}

// Email Messages API - 完全按照参考前端的调用方式
export const mailApi = {
  // Get mails for specific address or all - 按照参考前端的格式
  async getAll(params: GetMailsRequest): Promise<{ results: EmailMessage[], count: number }> {
    try {
      // 完全按照参考前端的调用方式
      const response = await apiFetch<{ results: EmailMessage[], count: number }>(`/api/mails?limit=${params.limit}&offset=${params.offset}${params.address ? `&address=${params.address}` : ''}${params.keyword ? `&keyword=${params.keyword}` : ''}`)

      console.log('Got mails from backend:', response)
      return response
    } catch (error) {
      console.error('Failed to get mails:', error)
      return { results: [], count: 0 }
    }
  },

  // Get single mail by ID - 按照参考前端的格式
  async getById(id: string): Promise<EmailMessage> {
    try {
      console.log(`Getting mail ${id}`)

      // 完全按照参考前端的调用方式
      const mail = await apiFetch<EmailMessage>(`/api/mail/${id}`)

      console.log('Got mail details:', mail)
      return mail
    } catch (error) {
      console.error('Failed to get mail details:', error)
      throw error
    }
  },

  // Delete mail - 按照参考前端的格式
  async delete(id: string): Promise<void> {
    try {
      console.log(`Deleting mail ${id}`)

      // 完全按照参考前端的调用方式
      await apiFetch<void>(`/api/mails/${id}`, {
        method: 'DELETE'
      })

      console.log('Deleted mail:', id)
    } catch (error) {
      console.error('Failed to delete mail:', error)
      throw error
    }
  },

  // Send mail - 按照参考前端的格式
  async send(data: SendMailRequest): Promise<void> {
    try {
      console.log('Sending mail:', data)

      // 完全按照参考前端的调用方式
      await apiFetch<void>('/api/send_mail', {
        method: 'POST',
        data: data
      })

      console.log('Mail sent successfully')
    } catch (error) {
      console.error('Failed to send mail:', error)
      throw error
    }
  },
}

// User Settings API - 完全按照参考前端的调用方式
export const settingsApi = {
  // Get user settings - 按照参考前端的格式
  async get(): Promise<UserSettings> {
    try {
      console.log('Getting user settings')

      // 完全按照参考前端的调用方式
      const settings = await apiFetch<UserSettings>('/api/settings')

      console.log('Got user settings:', settings)
      return settings
    } catch (error) {
      console.warn('Failed to get user settings, using defaults:', error)

      // 如果后端不支持，返回默认设置
      return {
        enable: true,
        enableMailVerify: false,
        verifyMailSender: '',
        enableMailAllowList: false,
        mailAllowList: [],
        maxAddressCount: 10,
        domains: ['yzcjwds.xyz']
      } as UserSettings
    }
  },

  // Update user settings - 按照参考前端的格式
  async update(settings: UserSettings): Promise<void> {
    try {
      console.log('Updating user settings:', settings)

      // 完全按照参考前端的调用方式
      await apiFetch<void>('/api/settings', {
        method: 'POST',
        data: settings
      })

      console.log('User settings updated successfully')
    } catch (error) {
      console.error('Failed to update user settings:', error)
      throw error
    }
  },

  // Get open settings - 按照参考前端的格式
  async getOpenSettings(): Promise<any> {
    try {
      console.log('Getting open settings')

      // 完全按照参考前端的调用方式
      const settings = await apiFetch<any>('/open_api/settings')

      console.log('Got open settings:', settings)
      return settings
    } catch (error) {
      console.error('Failed to get open settings:', error)
      throw error
    }
  }
}

export { ApiError }
