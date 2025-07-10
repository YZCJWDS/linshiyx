import type { 
  ApiResponse, 
  EmailAddress, 
  EmailMessage, 
  CreateAddressRequest, 
  SendMailRequest, 
  GetMailsRequest,
  UserSettings 
} from '@/types'

// API Base Configuration - 生产环境使用相对路径，开发环境使用代理
const API_BASE_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://apimail.yzcjwds.xyz')

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

// 生成随机ID
function generateRandomId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Generic fetch wrapper with error handling
async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Get auth info from store
  let finalEndpoint = endpoint
  let authHeaders = {}

  try {
    const { useAuthStore } = await import('@/stores/auth')
    const authStore = useAuthStore()
    authHeaders = authStore.getAuthHeaders()
    finalEndpoint = authStore.getAuthUrl(endpoint)
  } catch (error) {
    console.warn('Could not get auth info:', error)
  }

  const url = `${API_BASE_URL}${finalEndpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new ApiError(
        errorText || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      )
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }
    
    return await response.text() as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Email Address API
export const addressApi = {
  // Create new temporary email address
  async create(data: CreateAddressRequest): Promise<EmailAddress> {
    console.log('Creating address with data:', data)

    // 调用正确的后端 API 端点
    const response = await apiFetch<{ address: string, jwt: string }>('/api/new_address', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        domain: data.domain
      }),
    })

    // 转换后端响应格式为前端期望的格式
    const emailAddress: EmailAddress = {
      id: generateRandomId(),
      name: data.name,
      address: response.address,
      domain: data.domain,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      jwt: response.jwt
    }

    return emailAddress
  },

  // Get all addresses with pagination
  async getAll(limit = 20, offset = 0, query = ''): Promise<{ results: EmailAddress[], count: number }> {
    // 注意：根据您提供的API文档，后端没有获取所有地址的端点
    // 这里返回空结果，因为每个地址都需要单独的JWT来访问
    console.warn('Backend does not support listing all addresses - each address requires individual JWT')
    return { results: [], count: 0 }
  },

  // Delete address
  async delete(id: string): Promise<void> {
    // 注意：根据您提供的API文档，后端没有删除地址的端点
    // 临时邮箱通常是自动过期的，不需要手动删除
    console.warn('Backend does not support deleting addresses - addresses expire automatically')
    throw new ApiError('Delete operation not supported by backend')
  },
}

// Email Messages API
export const mailApi = {
  // Get mails for specific address or all
  async getAll(params: GetMailsRequest, jwt?: string): Promise<{ results: EmailMessage[], count: number }> {
    if (!jwt) {
      console.warn('No JWT provided for mail access')
      return { results: [], count: 0 }
    }

    console.log('Getting mails with JWT:', jwt.substring(0, 10) + '...')

    // 调用正确的后端 API 端点
    const mails = await apiFetch<EmailMessage[]>('/api/mails', {
      method: 'GET',
      headers: {
        'x-address-jwt': jwt
      }
    })

    return {
      results: Array.isArray(mails) ? mails : [],
      count: Array.isArray(mails) ? mails.length : 0
    }
  },

  // Get single mail by ID
  async getById(id: string, jwt?: string): Promise<EmailMessage> {
    if (!jwt) {
      throw new ApiError('JWT required for mail access')
    }

    console.log(`Getting mail ${id} with JWT:`, jwt.substring(0, 10) + '...')

    // 调用正确的后端 API 端点
    return await apiFetch<EmailMessage>(`/api/mail/${id}`, {
      method: 'GET',
      headers: {
        'x-address-jwt': jwt
      }
    })
  },

  // Delete mail
  async delete(id: string, jwt?: string): Promise<void> {
    // 注意：根据您提供的API文档，后端没有删除邮件的端点
    console.warn('Backend does not support deleting individual mails')
    throw new ApiError('Delete mail operation not supported by backend')
  },

  // Send mail
  async send(data: SendMailRequest): Promise<void> {
    // 注意：根据您提供的API文档，后端没有发送邮件的端点
    // 这是一个临时邮箱服务，主要用于接收邮件
    console.warn('Backend does not support sending mails - this is a receive-only service')
    throw new ApiError('Send mail operation not supported by backend')
  },
}

// User Settings API
export const settingsApi = {
  // Get user settings
  async get(): Promise<UserSettings> {
    // 注意：根据您提供的API文档，后端没有用户设置端点
    // 返回默认设置
    console.warn('Backend does not support user settings, returning default settings')
    return {
      enable: true,
      enableMailVerify: false,
      verifyMailSender: '',
      enableMailAllowList: false,
      mailAllowList: [],
      maxAddressCount: 10,
      domains: ['yzcjwds.xyz']
    } as UserSettings
  },

  // Update user settings
  async update(settings: UserSettings): Promise<void> {
    // 注意：根据您提供的API文档，后端没有更新设置的端点
    console.warn('Backend does not support updating user settings')
    throw new ApiError('Update settings operation not supported by backend')
  },
}

export { ApiError }
