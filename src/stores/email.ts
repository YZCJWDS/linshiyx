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

  // 本地存储键名 - 使用更独特的键名避免冲突
  const STORAGE_KEYS = {
    ADDRESSES: 'linshiyx_admin_addresses_v3',
    SELECTED_ADDRESS: 'linshiyx_admin_selected_v3',
    STORAGE_VERSION: 'linshiyx_storage_version'
  }

  // 存储版本，用于数据迁移
  const STORAGE_VERSION = '3.0'

  // Loading states
  const loading = ref({
    addresses: false,
    mails: false,
    creating: false,
    sending: false,
    deleting: false
  })

  // 本地存储函数
  // 使用现有的 addressApi 进行后端同步
  async function saveAddressesToBackend() {
    try {
      console.log('☁️ Backend sync not needed - addresses are managed individually')
      // 地址是通过 addressApi.create() 和 addressApi.delete() 单独管理的
      // 不需要批量保存，因为每个操作都会直接调用后端 API
      saveAddressesToStorage()
    } catch (error) {
      console.warn('⚠️ Failed to save to backend, using localStorage only:', error)
      saveAddressesToStorage()
    }
  }

  // 从后端加载地址列表（仅作为备份，不覆盖本地数据）
  async function loadAddressesFromBackend(): Promise<boolean> {
    try {
      console.log('☁️ Loading addresses from backend using /admin/address...')

      // 使用现有的 addressApi
      const response = await addressApi.getAll(100, 0)

      if (response.results && Array.isArray(response.results)) {
        // 只有在本地没有数据时才使用后端数据
        if (addresses.value.length === 0) {
          addresses.value = response.results
          console.log('✅ Loaded', addresses.value.length, 'addresses from backend')
          console.log('📧 Addresses:', addresses.value.map(addr => addr.address))

          // 保存到本地
          saveAddressesToStorage()
          return true
        } else {
          console.log('ℹ️ Local data exists, skipping backend override')
          return false
        }
      } else {
        console.log('ℹ️ No addresses found in backend')
        return false
      }
    } catch (error) {
      console.warn('⚠️ Failed to load from backend:', error)
      return false
    }
  }

  function saveAddressesToStorage() {
    try {
      const addressesToSave = addresses.value
      const dataToSave = {
        version: STORAGE_VERSION,
        timestamp: Date.now(),
        addresses: addressesToSave
      }

      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(dataToSave))
      localStorage.setItem(STORAGE_KEYS.STORAGE_VERSION, STORAGE_VERSION)

      console.log('💾 Saved', addressesToSave.length, 'addresses to localStorage (backup)')
    } catch (error) {
      console.error('❌ Failed to save addresses to localStorage:', error)
    }
  }

  function loadAddressesFromStorage() {
    try {
      console.log('📂 Loading admin addresses from storage')
      console.log('📦 Storage key:', STORAGE_KEYS.ADDRESSES)

      // 尝试从新版本存储加载
      const stored = localStorage.getItem(STORAGE_KEYS.ADDRESSES)
      if (stored) {
        const parsedData = JSON.parse(stored)

        // 检查是否是新版本格式
        if (parsedData && parsedData.version && parsedData.addresses) {
          console.log('✅ Found v3 admin data, version:', parsedData.version)
          addresses.value = parsedData.addresses
          console.log('📧 Loaded', addresses.value.length, 'admin addresses')
          console.log('📧 Addresses:', addresses.value.map(addr => addr.address))
          return
        }

        // 兼容旧版本格式（直接数组）
        if (Array.isArray(parsedData)) {
          console.log('⚠️ Found legacy array format, migrating...')
          addresses.value = parsedData
          saveAddressesToStorage()
          return
        }
      }

      // 尝试从旧版本键名加载（兼容性）
      const legacyKeys = [
        'linshiyx_user_addresses_v2', // v2 格式
        'temp_email_addresses',
        'emailAddresses',
        'addresses'
      ]

      for (const key of legacyKeys) {
        const legacyData = localStorage.getItem(key)
        if (legacyData) {
          try {
            const parsedLegacy = JSON.parse(legacyData)

            // 处理 v2 格式（带版本信息）
            if (parsedLegacy && parsedLegacy.addresses && Array.isArray(parsedLegacy.addresses)) {
              console.log(`⚠️ Found v2 data in key "${key}", migrating to v3...`)
              addresses.value = parsedLegacy.addresses
              saveAddressesToStorage()
              // 不删除旧数据，以防需要回滚
              return
            }

            // 处理旧版本格式（直接数组）
            if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0 && parsedLegacy[0].address) {
              console.log(`⚠️ Found legacy data in key "${key}", migrating to v3...`)
              addresses.value = parsedLegacy
              saveAddressesToStorage()
              // 不删除旧数据，以防需要回滚
              return
            }
          } catch (e) {
            console.warn(`Failed to parse legacy storage key "${key}":`, e)
          }
        }
      }

      console.log('ℹ️ No stored admin addresses found')
    } catch (error) {
      console.error('❌ Failed to load addresses from localStorage:', error)
    }
  }

  function saveSelectedAddressToStorage() {
    try {
      if (selectedAddress.value) {
        const dataToSave = {
          version: STORAGE_VERSION,
          timestamp: Date.now(),
          address: selectedAddress.value
        }
        localStorage.setItem(STORAGE_KEYS.SELECTED_ADDRESS, JSON.stringify(dataToSave))
        console.log('✅ Saved selected address to storage:', selectedAddress.value.address)
      } else {
        localStorage.removeItem(STORAGE_KEYS.SELECTED_ADDRESS)
        console.log('ℹ️ Removed selected address from storage (none selected)')
      }
    } catch (error) {
      console.error('❌ Failed to save selected address to localStorage:', error)
    }
  }

  function loadSelectedAddressFromStorage() {
    try {
      console.log('📂 Loading selected address from storage key:', STORAGE_KEYS.SELECTED_ADDRESS)

      // 尝试从新版本存储加载
      const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_ADDRESS)
      if (stored) {
        const parsedData = JSON.parse(stored)

        // 检查是否是新版本格式
        if (parsedData && parsedData.version && parsedData.address) {
          console.log('✅ Found v2 selected address format')
          const storedAddress = parsedData.address

          // 确保这个地址还在地址列表中
          const existingAddress = addresses.value.find(addr => addr.id === storedAddress.id)
          if (existingAddress) {
            selectedAddress.value = existingAddress
            console.log('📧 Loaded selected address from storage:', existingAddress.address)
            return
          } else {
            console.log('⚠️ Stored selected address not found in address list')
          }
        }

        // 兼容旧版本格式（直接对象）
        if (parsedData && parsedData.id) {
          console.log('⚠️ Found legacy selected address format, migrating...')

          // 确保这个地址还在地址列表中
          const existingAddress = addresses.value.find(addr => addr.id === parsedData.id)
          if (existingAddress) {
            selectedAddress.value = existingAddress
            console.log('📧 Loaded selected address from legacy storage:', existingAddress.address)

            // 迁移到新格式
            saveSelectedAddressToStorage()
            return
          }
        }
      }

      // 尝试从旧版本键名加载（兼容性）
      const legacyKeys = ['temp_email_selected_address', 'selectedAddress']
      for (const key of legacyKeys) {
        const legacyData = localStorage.getItem(key)
        if (legacyData) {
          try {
            const parsedLegacy = JSON.parse(legacyData)
            if (parsedLegacy && parsedLegacy.id) {
              console.log(`⚠️ Found selected address in legacy key "${key}", migrating...`)

              // 确保这个地址还在地址列表中
              const existingAddress = addresses.value.find(addr => addr.id === parsedLegacy.id)
              if (existingAddress) {
                selectedAddress.value = existingAddress
                console.log('📧 Loaded selected address from legacy key:', existingAddress.address)

                // 迁移到新格式
                saveSelectedAddressToStorage()

                // 清理旧数据
                localStorage.removeItem(key)
                return
              }
            }
          } catch (e) {
            console.warn(`Failed to parse legacy selected address key "${key}":`, e)
          }
        }
      }

      // 如果没有选中的地址但有地址列表，自动选择第一个
      if (!selectedAddress.value && addresses.value.length > 0) {
        console.log('ℹ️ No selected address found, auto-selecting first address')
        selectedAddress.value = addresses.value[0]
        saveSelectedAddressToStorage()
      } else {
        console.log('ℹ️ No stored selected address found')
      }
    } catch (error) {
      console.error('❌ Failed to load selected address from localStorage:', error)
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

      // 保存到本地存储（后端已经通过 addressApi.create 保存了）
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

      // 保存到本地存储（后端已经通过 addressApi.delete 删除了）
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

        // 使用新的 API 调用方式，传递地址参数以获取正确的JWT
        const fullMail = await mailApi.getById(mail.id, mail.address)
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

  // 初始化函数 - 优先本地存储，后端作为备份同步
  async function initializeStore() {
    console.log('🚀 Initializing email store...')

    // 检查存储版本
    const storedVersion = localStorage.getItem(STORAGE_KEYS.STORAGE_VERSION)
    console.log('📊 Storage version check:', storedVersion || 'not set', 'current:', STORAGE_VERSION)

    // 首先从本地存储加载数据（确保基本功能正常）
    loadAddressesFromStorage()
    loadSelectedAddressFromStorage()

    console.log('✅ Email store initialized with', addresses.value.length, 'admin addresses from local storage')

    if (addresses.value.length > 0) {
      console.log('📧 Available addresses:', addresses.value.map(addr => addr.address))

      if (storedVersion !== STORAGE_VERSION) {
        console.log('🔄 Updating storage to latest version')
        saveAddressesToStorage()
        if (selectedAddress.value) {
          saveSelectedAddressToStorage()
        }
      }
    } else {
      console.log('ℹ️ No local addresses found, trying backend...')

      // 只有在本地没有数据时才从后端加载
      try {
        const backendLoaded = await loadAddressesFromBackend()
        if (backendLoaded) {
          console.log('✅ Loaded addresses from backend as fallback')
        }
      } catch (error) {
        console.warn('⚠️ Backend loading failed, will create new addresses as needed:', error)
      }
    }

    // 设置自动保存
    window.addEventListener('beforeunload', () => {
      console.log('🔄 Auto-saving before page unload')
      saveAddressesToStorage()
      if (selectedAddress.value) {
        saveSelectedAddressToStorage()
      }
    })

    // 后台定期同步到后端（不影响主要功能）
    setInterval(async () => {
      if (addresses.value.length > 0) {
        console.log('🔄 Background sync to backend...')
        try {
          await saveAddressesToBackend()
        } catch (error) {
          console.warn('⚠️ Background sync failed:', error)
        }
      }
    }, 5 * 60 * 1000)
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
    saveAddressesToBackend,
    loadAddressesFromBackend,

    // Debug functions
    clearLocalStorage: () => {
      localStorage.removeItem(STORAGE_KEYS.ADDRESSES)
      localStorage.removeItem(STORAGE_KEYS.SELECTED_ADDRESS)
      addresses.value = []
      selectedAddress.value = null
      console.log('Local storage cleared for admin')
    },

    // 清理所有数据（用于退出登录）
    clearAllData: () => {
      // 清理内存中的数据
      addresses.value = []
      selectedAddress.value = null
      mails.value = []
      selectedMail.value = null

      // 清理本地存储
      localStorage.removeItem(STORAGE_KEYS.ADDRESSES)
      localStorage.removeItem(STORAGE_KEYS.SELECTED_ADDRESS)
      localStorage.removeItem(STORAGE_KEYS.STORAGE_VERSION)

      // 清理所有地址相关的JWT
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('address_jwt_')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))

      // 停止自动刷新
      stopAutoRefresh()

      console.log('🧹 All email data cleared for logout')
    },

    debugStorage: () => {
      console.log('=== 📊 Storage Debug Info ===')
      console.log('🏠 Storage keys:', STORAGE_KEYS)
      console.log('📧 Addresses in memory:', addresses.value.length)
      console.log('📧 Addresses:', addresses.value.map(addr => addr.address))
      console.log('🎯 Selected address:', selectedAddress.value?.address)
      console.log('💾 LocalStorage addresses:', localStorage.getItem(STORAGE_KEYS.ADDRESSES))
      console.log('💾 LocalStorage selected:', localStorage.getItem(STORAGE_KEYS.SELECTED_ADDRESS))
      console.log('📊 Storage version:', localStorage.getItem(STORAGE_KEYS.STORAGE_VERSION))

      // 扫描所有可能的邮箱相关存储
      console.log('🔍 All localStorage keys containing "email", "address", or "mail":')
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes('email') || key.includes('address') || key.includes('mail'))) {
          console.log(`  - ${key}: ${localStorage.getItem(key)?.substring(0, 100)}...`)
        }
      }
      console.log('========================')
    }
  }
})
