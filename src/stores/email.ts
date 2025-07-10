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

  // Loading states
  const loading = ref({
    addresses: false,
    mails: false,
    creating: false,
    sending: false,
    deleting: false
  })

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
      const response = await addressApi.getAll(100, 0)
      addresses.value = response.results || []
    } catch (error) {
      uiStore.showError('加载邮箱地址失败')
      console.error('Load addresses error:', error)
    } finally {
      loading.value.addresses = false
    }
  }

  async function createAddress(name: string, domain: string, enablePrefix = true) {
    loading.value.creating = true
    try {
      console.log('Creating address with data:', { enablePrefix, name, domain })
      const newAddress = await addressApi.create({
        enablePrefix,
        name,
        domain
      })
      addresses.value.unshift(newAddress)
      uiStore.showSuccess('邮箱地址创建成功')
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
      
      // Clear selection if deleted address was selected
      if (selectedAddress.value?.id === id) {
        selectedAddress.value = null
        mails.value = []
        selectedMail.value = null
      }
      
      uiStore.showSuccess('Email address deleted successfully')
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
      const response = await mailApi.getAll({
        limit: 100,
        offset: 0,
        address,
        keyword
      })
      mails.value = response.results || []
    } catch (error) {
      uiStore.showError('加载邮件失败')
      console.error('Load mails error:', error)
    } finally {
      loading.value.mails = false
    }
  }

  async function loadMailsForAddress(address: EmailAddress) {
    selectedAddress.value = address
    await loadMails(address.address)
  }

  async function deleteMail(id: string) {
    try {
      await mailApi.delete(id)
      mails.value = mails.value.filter(mail => mail.id !== id)
      
      // Clear selection if deleted mail was selected
      if (selectedMail.value?.id === id) {
        selectedMail.value = null
      }
      
      uiStore.showSuccess('Email deleted successfully')
    } catch (error) {
      uiStore.showError('Failed to delete email')
      console.error('Delete mail error:', error)
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

  function selectMail(mail: EmailMessage) {
    selectedMail.value = mail
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
    stopAutoRefresh
  }
})
