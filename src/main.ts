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
