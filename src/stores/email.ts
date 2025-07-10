import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EmailAddress, EmailMessage, UserSettings } from '@/types'
import { addressApi, mailApi, settingsApi } from '@/utils/api'
import { useUiStore } from './ui'

export const useEmailStore = defineStore('email', () => {
  const uiStore = useUiStore()

  // State
  const addresses = ref<EmailAddress[]>([])
  const selectedAddress = ref<EmailAddress | null>(null)
  const mails = ref<EmailMessage[]>([])
  const selectedMail = ref<EmailMessage | null>(null)
  const userSettings = ref<UserSettings>({
    enable: false,
    enableMailVerify: false,
    verifyMailSender: '',
    enableMailAllowList: false,
    mailAllowList: [],
    maxAddressCount: 5
  })

  // 本地存储键名
  const STORAGE_KEYS = {
    ADDRESSES: 'temp_email_addresses',
    SELECTED_ADDRESS: 'temp_email_selected_address'
  }

  // Loading states
  const loading = ref({
    addresses: false,
    mails: false,
    creating: false,
    sending: false,
    deleting: false
  })

  // 本地存储函数
  function saveAddressesToStorage() {
    try {
      const addressesToSave = addresses.value
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addressesToSave))
      console.log('Saved', addressesToSave.length, 'addresses to localStorage:', addressesToSave.map(addr => addr.address))
    } catch (error) {
      console.error('Failed to save addresses to localStorage:', error)
    }
  }

  function loadAddressesFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADDRESSES)
      if (stored) {
        const parsedAddresses = JSON.parse(stored)
        if (Array.isArray(parsedAddresses)) {
          addresses.value = parsedAddresses
          console.log('Loaded addresses from storage:', parsedAddresses.length)
        }
      }
    } catch (error) {
      console.error('Failed to load addresses from localStorage:', error)
    }
  }

  function saveSelectedAddressToStorage() {
    try {
      if (selectedAddress.value) {
        localStorage.setItem(STORAGE_KEYS.SELECTED_ADDRESS, JSON.stringify(selectedAddress.value))
      } else {
        localStorage.removeItem(STORAGE_KEYS.SELECTED_ADDRESS)
      }
    } catch (error) {
      console.error('Failed to save selected address to localStorage:', error)
    }
  }

  function loadSelectedAddressFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_ADDRESS)
      if (stored) {
        const parsedAddress = JSON.parse(stored)
        // 确保这个地址还在地址列表中
        const existingAddress = addresses.value.find(addr => addr.id === parsedAddress.id)
        if (existingAddress) {
          selectedAddress.value = existingAddress
          console.log('Loaded selected address from storage:', existingAddress.address)
        }
      }
    } catch (error) {
      console.error('Failed to load selected address from localStorage:', error)
    }
  }

  // Computed
  const hasAddresses = computed(() => addresses.value.length > 0)
  const hasMails = computed(() => mails.value.length > 0)
  const selectedAddressMails = computed(() => {
    if (!selectedAddress.value) return []
    return mails.value.filter(mail => mail.address === selectedAddress.value?.address)
  })

  // Actions
  async function loadAddresses() {
    loading.value.addresses = true
    try {
      // 首先从本地存储加载
      loadAddressesFromStorage()

      // 然后尝试从后端同步（可选，用于多设备同步）
      try {
        const response = await addressApi.getAll(100, 0)
        if (response.results && response.results.length > 0) {
          // 如果后端有数据，合并到本地（去重）
          const backendAddresses = response.results
          const existingIds = new Set(addresses.value.map(addr => addr.address))

          for (const backendAddr of backendAddresses) {
            if (!existingIds.has(backendAddr.address)) {
              addresses.value.push(backendAddr)
            }
          }

          // 保存合并后的结果
          saveAddressesToStorage()
        }
      } catch (apiError) {
        console.warn('Failed to sync with backend, using local storage only:', apiError)
      }
    } catch (error) {
      console.error('Load addresses error:', error)
    } finally {
      loading.value.addresses = false
    }
  }

  async function createAddress(name: string, domain: string, enablePrefix = true, cfToken?: string) {
    loading.value.creating = true
    try {
      console.log('Creating address with data:', { enablePrefix, name, domain, cfToken })

      // 使用新的 API 调用方式
      const newAddress = await addressApi.create({
        enablePrefix,
        name,
        domain,
        cf_token: cfToken
      })

      // 将新地址添加到列表开头
      addresses.value.unshift(newAddress)

      // 保存到本地存储
      saveAddressesToStorage()

      // 如果这是第一个地址，自动选中它
      if (!selectedAddress.value) {
        selectedAddress.value = newAddress
        saveSelectedAddressToStorage()
      }

      uiStore.showSuccess('邮箱地址创建成功')
      console.log('Address created successfully:', newAddress)
      return newAddress
    } catch (error) {
      console.error('Create address error:', error)

      // 提供更详细的错误信息
      let errorMessage = '创建邮箱地址失败'
      if (error instanceof Error) {
        if (error.message.includes('405')) {
          errorMessage = '后端API不支持此操作，请检查API配置'
        } else if (error.message.includes('404')) {
          errorMessage = 'API端点未找到，请检查后端服务'
        } else if (error.message.includes('Network error')) {
          errorMessage = '网络连接失败，请检查网络连接'
        } else if (error.message.includes('401')) {
          errorMessage = '认证失败，请检查访问权限'
        } else {
          errorMessage = `创建失败: ${error.message}`
        }
      }

      uiStore.showError(errorMessage)
      throw error
    } finally {
      loading.value.creating = false
    }
  }

  async function deleteAddress(id: string) {
    loading.value.deleting = true
    try {
      await addressApi.delete(id)
      addresses.value = addresses.value.filter(addr => addr.id !== id)

      // 保存到本地存储
      saveAddressesToStorage()

      // Clear selection if deleted address was selected
      if (selectedAddress.value?.id === id) {
        selectedAddress.value = null
        mails.value = []
        selectedMail.value = null
        saveSelectedAddressToStorage()
      }

      uiStore.showSuccess('邮箱地址删除成功')
    } catch (error) {
      uiStore.showError('Failed to delete email address')
      console.error('Delete address error:', error)
    } finally {
      loading.value.deleting = false
    }
  }

  async function loadMails(address?: string, keyword?: string) {
    loading.value.mails = true
    try {
      console.log('Loading mails for address:', address, 'keyword:', keyword)

      // 使用新的 API 调用方式，不需要 JWT 参数
      const response = await mailApi.getAll({
        limit: 100,
        offset: 0,
        address,
        keyword
      })

      mails.value = response.results || []
      console.log('Loaded mails:', mails.value.length)
    } catch (error) {
      console.error('Load mails error:', error)

      // 提供更详细的错误信息
      let errorMessage = '加载邮件失败'
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = '认证失败，请重新登录'
        } else if (error.message.includes('404')) {
          errorMessage = '邮件服务不可用'
        } else {
          errorMessage = `加载失败: ${error.message}`
        }
      }

      uiStore.showError(errorMessage)
      mails.value = []
    } finally {
      loading.value.mails = false
    }
  }

  async function loadMailsForAddress(address: EmailAddress) {
    selectedAddress.value = address
    saveSelectedAddressToStorage()
    await loadMails(address.address)
  }

  async function deleteMail(id: string) {
    try {
      console.log('Deleting mail:', id)

      // 使用新的 API 调用方式，不需要 JWT 参数
      await mailApi.delete(id)

      // 从列表中移除已删除的邮件
      mails.value = mails.value.filter(mail => mail.id !== id)

      // 如果删除的是当前选中的邮件，清除选择
      if (selectedMail.value?.id === id) {
        selectedMail.value = null
      }

      uiStore.showSuccess('邮件删除成功')
      console.log('Mail deleted successfully')
    } catch (error) {
      console.error('Delete mail error:', error)

      let errorMessage = '删除邮件失败'
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = '认证失败，无法删除邮件'
        } else if (error.message.includes('404')) {
          errorMessage = '邮件不存在或已被删除'
        } else {
          errorMessage = `删除失败: ${error.message}`
        }
      }

      uiStore.showError(errorMessage)
    }
  }

  async function loadUserSettings() {
    try {
      const settings = await settingsApi.get()
      userSettings.value = settings
    } catch (error) {
      console.error('Load user settings error:', error)
    }
  }

  function selectAddress(address: EmailAddress) {
    selectedAddress.value = address
    selectedMail.value = null
    loadMailsForAddress(address)
  }

  async function selectMail(mail: EmailMessage) {
    selectedMail.value = mail
    console.log('Selected mail:', mail)

    // 获取完整邮件内容
    try {
      if (mail.id) {
        console.log('Loading full mail details for:', mail.id)

        // 使用新的 API 调用方式，不需要 JWT 参数
        const fullMail = await mailApi.getById(mail.id)
        selectedMail.value = fullMail
        console.log('Loaded full mail details:', fullMail)
      }
    } catch (error) {
      console.error('Failed to load mail details:', error)
      // 即使获取详情失败，也保持基本的邮件信息
      uiStore.showError('加载邮件详情失败')
    }
  }

  function clearSelection() {
    selectedAddress.value = null
    selectedMail.value = null
    mails.value = []
  }

  // Auto-refresh mails for selected address
  let refreshInterval: NodeJS.Timeout | null = null

  function startAutoRefresh(intervalMs = 30000) {
    stopAutoRefresh()
    refreshInterval = setInterval(() => {
      if (selectedAddress.value) {
        loadMails(selectedAddress.value.address)
      }
    }, intervalMs)
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  // 初始化函数 - 从本地存储加载数据
  function initializeStore() {
    console.log('Initializing email store...')

    // 首先从本地存储加载数据
    loadAddressesFromStorage()
    loadSelectedAddressFromStorage()

    console.log('Email store initialized with', addresses.value.length, 'addresses from local storage')

    // 如果本地有数据，直接使用，不需要从后端加载
    if (addresses.value.length > 0) {
      console.log('Using local addresses:', addresses.value.map(addr => addr.address))
    } else {
      console.log('No local addresses found, will create new ones as needed')
    }
  }

  return {
    // State
    addresses,
    selectedAddress,
    mails,
    selectedMail,
    userSettings,
    loading,

    // Computed
    hasAddresses,
    hasMails,
    selectedAddressMails,

    // Actions
    loadAddresses,
    createAddress,
    deleteAddress,
    loadMails,
    loadMailsForAddress,
    deleteMail,
    loadUserSettings,
    selectAddress,
    selectMail,
    clearSelection,
    startAutoRefresh,
    stopAutoRefresh,
    initializeStore,

    // Storage functions (for debugging)
    saveAddressesToStorage,
    loadAddressesFromStorage,

    // Debug functions
    clearLocalStorage: () => {
      localStorage.removeItem(STORAGE_KEYS.ADDRESSES)
      localStorage.removeItem(STORAGE_KEYS.SELECTED_ADDRESS)
      addresses.value = []
      selectedAddress.value = null
      console.log('Local storage cleared')
    },

    debugStorage: () => {
      console.log('=== Storage Debug Info ===')
      console.log('Addresses in memory:', addresses.value.length)
      console.log('Addresses:', addresses.value.map(addr => addr.address))
      console.log('Selected address:', selectedAddress.value?.address)
      console.log('LocalStorage addresses:', localStorage.getItem(STORAGE_KEYS.ADDRESSES))
      console.log('LocalStorage selected:', localStorage.getItem(STORAGE_KEYS.SELECTED_ADDRESS))
      console.log('========================')
    }
  }
})
