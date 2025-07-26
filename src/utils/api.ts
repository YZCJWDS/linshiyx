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

// 扩展 AxiosRequestConfig 以支持自定义属性
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  addressJwt?: string
  userJwt?: string
}

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
async function apiFetch<T>(url: string, options: ExtendedAxiosRequestConfig = {}): Promise<T> {
  // 获取最新的认证信息
  getStoredAuth()

  // 确定使用哪个JWT：优先使用传入的addressJwt，否则使用全局JWT
  const jwtToUse = options.addressJwt || authState.jwt

  console.log('🔗 API Call:', url, 'with adminAuth:', authState.adminAuth ? '***' : 'none', 'JWT:', jwtToUse ? '***' : 'none')

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
        'Authorization': `Bearer ${jwtToUse}`, // 使用正确的JWT
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
      console.log('✅ Received JWT from backend:', response.jwt.substring(0, 20) + '...')
      saveAuth('jwt', response.jwt)
      // 同时保存地址专用的JWT
      localStorage.setItem(`address_jwt_${response.address}`, response.jwt)
      console.log('✅ Saved global JWT to localStorage')
      console.log('✅ Saved address JWT for:', response.address)

      // 验证保存是否成功
      const savedGlobalJwt = localStorage.getItem('jwt')
      const savedAddressJwt = localStorage.getItem(`address_jwt_${response.address}`)
      console.log('Verification - Global JWT saved:', savedGlobalJwt ? '***' : 'none')
      console.log('Verification - Address JWT saved:', savedAddressJwt ? '***' : 'none')
    } else {
      console.error('❌ No JWT received from backend!')
      console.log('Backend response:', response)
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
      console.log('Getting addresses from backend using admin endpoint...')

      // 管理员获取地址列表 - 使用管理员API
      const response = await apiFetch<{ results: any[], count: number }>(`/admin/address?limit=${limit}&offset=${offset}${query ? `&query=${query}` : ''}`)

      console.log('Raw backend response:', response)
      console.log('Full response object:', JSON.stringify(response, null, 2))

      // 确保数据格式正确
      if (response.results && Array.isArray(response.results)) {
        console.log('First address object from backend:', JSON.stringify(response.results[0], null, 2))

        const formattedAddresses: EmailAddress[] = response.results.map((addr, index) => {
          // 打印所有可能的字段
          console.log(`Address ${index} - All fields:`, Object.keys(addr))
          for (const [key, value] of Object.entries(addr)) {
            console.log(`  ${key}: "${value}"`)
          }

          // 尝试所有可能的地址字段名
          const possibleAddressFields = ['address', 'email', 'mail', 'addr', 'email_address', 'full_address']
          let addressValue = ''

          for (const field of possibleAddressFields) {
            if (addr[field] && typeof addr[field] === 'string' && addr[field].includes('@')) {
              addressValue = addr[field]
              console.log(`  Found address in field "${field}": "${addressValue}"`)
              break
            }
          }

          // 如果还是找不到，尝试第一个包含@的字段
          if (!addressValue) {
            for (const [key, value] of Object.entries(addr)) {
              if (typeof value === 'string' && value.includes('@')) {
                addressValue = value
                console.log(`  Found address in field "${key}": "${addressValue}"`)
                break
              }
            }
          }

          const formatted = {
            id: addr.id || addr._id || generateRandomId(),
            name: addr.name || addr.prefix || '',
            address: addressValue,
            domain: addr.domain || addressValue.split('@')[1] || '',
            created_at: addr.created_at || addr.createdAt || new Date().toISOString(),
            updated_at: addr.updated_at || addr.updatedAt || new Date().toISOString(),
            jwt: addr.jwt || addr.token
          }

          console.log(`  Final formatted address: "${formatted.address}"`)
          return formatted
        })

        console.log('All formatted addresses:', formattedAddresses.map(addr => addr.address))
        return { results: formattedAddresses, count: formattedAddresses.length }
      }

      return { results: [], count: 0 }
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
      console.log('Getting mails with params:', params)

      // 对于管理员系统，直接使用全局JWT（更简单可靠）
      let addressJwt = ''
      if (params.address) {
        // 首先尝试地址专用JWT（如果存在）
        addressJwt = localStorage.getItem(`address_jwt_${params.address}`) || ''
        console.log('Address specific JWT:', addressJwt ? '***' : 'none')

        // 如果没有地址专用JWT，使用全局JWT
        if (!addressJwt) {
          const globalJwt = authState.jwt || localStorage.getItem('jwt') || ''
          addressJwt = globalJwt
          console.log('Global JWT from authState:', authState.jwt ? '***' : 'none')
          console.log('Global JWT from localStorage:', localStorage.getItem('jwt') ? '***' : 'none')
        }

        console.log('Final JWT to use:', addressJwt ? '***' : 'none')

        // 如果还是没有JWT，尝试为这个地址获取用户JWT
        if (!addressJwt) {
          console.error('❌ No JWT available! Trying to get user JWT for address...')
          console.log('Available localStorage keys:', Object.keys(localStorage))

          try {
            // 使用管理员认证获取这个地址的用户JWT
            console.log('🔍 Getting user JWT for address:', params.address)
            const response = await fetch(`/user_api/bind_address_jwt/${params.address}`, {
              headers: {
                'x-admin-auth': authState.adminAuth || localStorage.getItem('adminAuth') || '',
                'Content-Type': 'application/json'
              }
            })

            if (response.ok) {
              const data = await response.json()
              if (data.jwt) {
                addressJwt = data.jwt
                localStorage.setItem(`address_jwt_${params.address}`, data.jwt)
                console.log('✅ Got user JWT for address:', params.address)
              } else {
                console.error('❌ No JWT in bind_address_jwt response')
              }
            } else {
              console.error('❌ bind_address_jwt failed:', response.status)
            }
          } catch (error) {
            console.error('❌ Failed to get user JWT for address:', error)
          }

          // 如果还是没有JWT，使用管理员认证作为最后的fallback
          if (!addressJwt) {
            const adminAuth = authState.adminAuth || localStorage.getItem('adminAuth') || ''
            if (adminAuth) {
              addressJwt = adminAuth
              console.log('🔄 Using adminAuth as final fallback:', addressJwt ? '***' : 'none')
            }
          }
        }
      }

      // 完全按照示例前端的管理员API调用方式
      // 示例前端管理员邮件组件：await $.fetch(`/admin/mails?limit=${r}&offset=${v}` + (i.value ? `&address=${i.value}` : "") + (s.value ? `&keyword=${s.value}` : ""))
      // 管理员API支持address参数！
      const apiUrl = `/admin/mails?limit=${params.limit}&offset=${params.offset}${params.address ? `&address=${params.address}` : ''}${params.keyword ? `&keyword=${params.keyword}` : ''}`

      console.log('Using admin mails API (exactly like reference frontend):', apiUrl)

      // 调用管理员API获取邮件（完全按照示例前端）
      const response = await apiFetch<{ results: EmailMessage[], count: number }>(apiUrl, {
        addressJwt
      })

      console.log('Got mails from backend:', response)
      return response
    } catch (error) {
      console.error('Failed to get mails:', error)
      return { results: [], count: 0 }
    }
  },

  // Get single mail by ID - 按照参考前端的格式
  async getById(id: string, address?: string): Promise<EmailMessage> {
    try {
      console.log(`Getting mail ${id}`)

      // 对于管理员系统，直接使用全局JWT（更简单可靠）
      let addressJwt = ''
      if (address) {
        // 首先尝试地址专用JWT（如果存在）
        addressJwt = localStorage.getItem(`address_jwt_${address}`) || ''

        // 如果没有地址专用JWT，使用全局JWT
        if (!addressJwt) {
          addressJwt = authState.jwt || localStorage.getItem('jwt') || ''
        }

        console.log('Using JWT for mail details:', address, addressJwt ? '***' : 'none')
      }

      // 调用API获取邮件详情
      const mail = await apiFetch<EmailMessage>(`/api/mail/${id}`, {
        addressJwt
      })

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

  // Send mail by user - 按照示例前端的用户发送方式
  async sendByUser(data: SendMailRequest): Promise<void> {
    try {
      console.log('Sending mail by user:', data)

      // 完全按照示例前端的用户调用方式
      // 从示例前端: await p.fetch("/api/send_mail", { method: "POST", body: JSON.stringify({ from_name, to_name, to_mail, subject, is_html, content }) })
      await apiFetch<void>('/api/send_mail', {
        method: 'POST',
        data: {
          from_name: data.from_name || '',
          to_name: data.to_name || '',
          to_mail: data.to_mail,
          subject: data.subject,
          is_html: data.is_html,
          content: data.content
        }
      })

      console.log('Mail sent successfully by user')
    } catch (error) {
      console.error('Failed to send mail by user:', error)
      throw error
    }
  },

  // Request send mail access - 申请发送邮件权限
  async requestSendAccess(): Promise<void> {
    try {
      console.log('Requesting send mail access')

      // 完全按照示例前端的申请权限方式
      // 从示例前端: await p.fetch("/api/requset_send_mail_access", { method: "POST", body: JSON.stringify({}) })
      await apiFetch<void>('/api/requset_send_mail_access', {
        method: 'POST',
        data: {}
      })

      console.log('Send mail access requested successfully')
    } catch (error) {
      console.error('Failed to request send mail access:', error)
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
