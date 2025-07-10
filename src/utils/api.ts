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
    return apiFetch<EmailAddress>('/admin/new_address', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get all addresses with pagination
  async getAll(limit = 20, offset = 0, query = ''): Promise<{ results: EmailAddress[], count: number }> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })
    if (query) params.append('query', query)
    
    return apiFetch<{ results: EmailAddress[], count: number }>(`/admin/address?${params}`)
  },

  // Delete address
  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/admin/address/${id}`, {
      method: 'DELETE',
    })
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
    
    return apiFetch<{ results: EmailMessage[], count: number }>(`/admin/mails?${searchParams}`)
  },

  // Get single mail by ID
  async getById(id: string): Promise<EmailMessage> {
    return apiFetch<EmailMessage>(`/admin/mails/${id}`)
  },

  // Delete mail
  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/admin/mails/${id}`, {
      method: 'DELETE',
    })
  },

  // Send mail
  async send(data: SendMailRequest): Promise<void> {
    return apiFetch<void>('/api/send_mail', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// User Settings API
export const settingsApi = {
  // Get user settings
  async get(): Promise<UserSettings> {
    return apiFetch<UserSettings>('/admin/user_settings')
  },

  // Update user settings
  async update(settings: UserSettings): Promise<void> {
    return apiFetch<void>('/admin/user_settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    })
  },
}

export { ApiError }
