import { createApp } from 'vue'
import App from './App.vue'
import { pinia } from './stores'

// Import global styles
import './styles/global.css'

// Create and mount app
const app = createApp(App)

app.use(pinia)

app.mount('#app')

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err, info)
}

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  event.preventDefault()
})

// Development debugging functions
if (import.meta.env.DEV) {
  import('./stores/email').then(({ useEmailStore }) => {
    const emailStore = useEmailStore()

    // Add global debugging functions
    ;(window as any).debugEmail = {
      storage: () => emailStore.debugStorage(),
      clear: () => emailStore.clearLocalStorage(),
      save: () => emailStore.saveAddressesToStorage(),
      load: () => emailStore.loadAddressesFromStorage(),
      addresses: () => emailStore.addresses,
      init: () => emailStore.initializeStore()
    }

    console.log('🔧 Debug functions available: window.debugEmail')
    console.log('  - debugEmail.storage() - Show storage info')
    console.log('  - debugEmail.clear() - Clear local storage')
    console.log('  - debugEmail.save() - Save to storage')
    console.log('  - debugEmail.load() - Load from storage')
    console.log('  - debugEmail.addresses - View addresses')
    console.log('  - debugEmail.init() - Re-initialize store')
  })
}
