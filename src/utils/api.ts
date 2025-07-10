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
    // 尝试多个可能的端点
    const possibleEndpoints = [
      '/admin/new_address',
      '/api/new_address',
      '/admin/address',
      '/api/address',
      '/admin/create_address',
      '/api/create_address'
    ]

    let lastError: Error | null = null

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        return await apiFetch<EmailAddress>(endpoint, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      } catch (error) {
        console.log(`Failed endpoint ${endpoint}:`, error)
        lastError = error as Error

        // 如果不是 405 错误，可能是其他问题，继续尝试
        if (error instanceof ApiError && error.status !== 405) {
          continue
        }
      }
    }

    // 如果所有端点都失败，抛出最后一个错误
    throw lastError || new ApiError('All endpoints failed')
  },

  // Get all addresses with pagination
  async getAll(limit = 20, offset = 0, query = ''): Promise<{ results: EmailAddress[], count: number }> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })
    if (query) params.append('query', query)

    // 尝试多个可能的端点
    const possibleEndpoints = [
      `/admin/address?${params}`,
      `/api/address?${params}`,
      `/admin/addresses?${params}`,
      `/api/addresses?${params}`
    ]

    let lastError: Error | null = null

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        return await apiFetch<{ results: EmailAddress[], count: number }>(endpoint)
      } catch (error) {
        console.log(`Failed endpoint ${endpoint}:`, error)
        lastError = error as Error
      }
    }

    // 如果所有端点都失败，返回空结果
    console.warn('All address endpoints failed, returning empty results')
    return { results: [], count: 0 }
  },

  // Delete address
  async delete(id: string): Promise<void> {
    const possibleEndpoints = [
      `/admin/address/${id}`,
      `/api/address/${id}`,
      `/admin/delete_address/${id}`,
      `/api/delete_address/${id}`
    ]

    let lastError: Error | null = null

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying delete endpoint: ${endpoint}`)
        return await apiFetch<void>(endpoint, {
          method: 'DELETE',
        })
      } catch (error) {
        console.log(`Failed delete endpoint ${endpoint}:`, error)
        lastError = error as Error
      }
    }

    throw lastError || new ApiError('All delete endpoints failed')
  },
}

// Email Messages API
export const mailApi = {
  // Get mails for specific address or all
  async getAll(params: GetMailsRequest): Promise<{ results: EmailMessage[], count: number }> {
    const searchParams = new URLSearchParams({
      limit: params.limit.toString(),
      offset: params.offset.toString(),
    })

    if (params.address) searchParams.append('address', params.address)
    if (params.keyword) searchParams.append('keyword', params.keyword)

    const possibleEndpoints = [
      `/admin/mails?${searchParams}`,
      `/api/mails?${searchParams}`,
      `/admin/emails?${searchParams}`,
      `/api/emails?${searchParams}`
    ]

    let lastError: Error | null = null

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying mails endpoint: ${endpoint}`)
        return await apiFetch<{ results: EmailMessage[], count: number }>(endpoint)
      } catch (error) {
        console.log(`Failed mails endpoint ${endpoint}:`, error)
        lastError = error as Error
      }
    }

    // 如果所有端点都失败，返回空结果
    console.warn('All mail endpoints failed, returning empty results')
    return { results: [], count: 0 }
  },

  // Get single mail by ID
  async getById(id: string): Promise<EmailMessage> {
    const possibleEndpoints = [
      `/admin/mails/${id}`,
      `/api/mails/${id}`,
      `/admin/emails/${id}`,
      `/api/emails/${id}`
    ]

    let lastError: Error | null = null

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying mail detail endpoint: ${endpoint}`)
        return await apiFetch<EmailMessage>(endpoint)
      } catch (error) {
        console.log(`Failed mail detail endpoint ${endpoint}:`, error)
        lastError = error as Error
      }
    }

    throw lastError || new ApiError('All mail detail endpoints failed')
  },

  // Delete mail
  async delete(id: string): Promise<void> {
    const possibleEndpoints = [
      `/admin/mails/${id}`,
      `/api/mails/${id}`,
      `/admin/emails/${id}`,
      `/api/emails/${id}`
    ]

    let lastError: Error | null = null

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying delete mail endpoint: ${endpoint}`)
        return await apiFetch<void>(endpoint, {
          method: 'DELETE',
        })
      } catch (error) {
        console.log(`Failed delete mail endpoint ${endpoint}:`, error)
        lastError = error as Error
      }
    }

    throw lastError || new ApiError('All delete mail endpoints failed')
  },

  // Send mail
  async send(data: SendMailRequest): Promise<void> {
    const possibleEndpoints = [
      '/api/send_mail',
      '/admin/send_mail',
      '/api/send',
      '/admin/send'
    ]

    let lastError: Error | null = null

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying send mail endpoint: ${endpoint}`)
        return await apiFetch<void>(endpoint, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      } catch (error) {
        console.log(`Failed send mail endpoint ${endpoint}:`, error)
        lastError = error as Error
      }
    }

    throw lastError || new ApiError('All send mail endpoints failed')
  },
}

// User Settings API
export const settingsApi = {
  // Get user settings
  async get(): Promise<UserSettings> {
    const possibleEndpoints = [
      '/admin/user_settings',
      '/api/user_settings',
      '/admin/settings',
      '/api/settings'
    ]

    let lastError: Error | null = null

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying settings endpoint: ${endpoint}`)
        return await apiFetch<UserSettings>(endpoint)
      } catch (error) {
        console.log(`Failed settings endpoint ${endpoint}:`, error)
        lastError = error as Error
      }
    }

    // 如果所有端点都失败，返回默认设置
    console.warn('All settings endpoints failed, returning default settings')
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
    const possibleEndpoints = [
      '/admin/user_settings',
      '/api/user_settings',
      '/admin/settings',
      '/api/settings'
    ]

    let lastError: Error | null = null

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying update settings endpoint: ${endpoint}`)
        return await apiFetch<void>(endpoint, {
          method: 'POST',
          body: JSON.stringify(settings),
        })
      } catch (error) {
        console.log(`Failed update settings endpoint ${endpoint}:`, error)
        lastError = error as Error
      }
    }

    throw lastError || new ApiError('All update settings endpoints failed')
  },
}

export { ApiError }
