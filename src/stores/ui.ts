import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NotificationMessage } from '@/types'

export const useUiStore = defineStore('ui', () => {
  // State
  const notifications = ref<NotificationMessage[]>([])
  const loading = ref(false)
  const sidebarCollapsed = ref(false)
  const theme = ref<'light' | 'dark'>('light')

  // Notification actions
  function showNotification(notification: NotificationMessage) {
    notifications.value.push({
      ...notification,
      duration: notification.duration || 4000
    })
    
    // Auto remove notification after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(notification)
      }, notification.duration || 4000)
    }
  }

  function showSuccess(title: string, content?: string) {
    showNotification({
      type: 'success',
      title,
      content
    })
  }

  function showError(title: string, content?: string) {
    showNotification({
      type: 'error',
      title,
      content,
      duration: 6000 // Errors stay longer
    })
  }

  function showWarning(title: string, content?: string) {
    showNotification({
      type: 'warning',
      title,
      content
    })
  }

  function showInfo(title: string, content?: string) {
    showNotification({
      type: 'info',
      title,
      content
    })
  }

  function removeNotification(notification: NotificationMessage) {
    const index = notifications.value.indexOf(notification)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearNotifications() {
    notifications.value = []
  }

  // UI state actions
  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setSidebarCollapsed(collapsed: boolean) {
    sidebarCollapsed.value = collapsed
  }

  function setTheme(newTheme: 'light' | 'dark') {
    theme.value = newTheme
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  // Initialize theme from localStorage or system preference
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }

  // Save theme to localStorage when changed
  function saveTheme() {
    localStorage.setItem('theme', theme.value)
  }

  return {
    // State
    notifications,
    loading,
    sidebarCollapsed,
    theme,
    
    // Actions
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearNotifications,
    setLoading,
    toggleSidebar,
    setSidebarCollapsed,
    setTheme,
    toggleTheme,
    initTheme,
    saveTheme
  }
})
