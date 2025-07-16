// Utility functions for the application

// Generate random string for email prefix
export function generateRandomString(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Format date for display
export function formatDate(dateString: string, useUTC = false): string {
  const date = new Date(dateString)
  
  if (useUTC) {
    return date.toUTCString()
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Format relative time (e.g., "2 minutes ago")
export function formatRelativeTime(dateString: string): string {
  if (!dateString) return 'Unknown time'

  try {
    // 尝试多种日期格式解析
    let date: Date

    // 如果是ISO格式或包含T的格式，直接解析
    if (dateString.includes('T') || dateString.includes('Z')) {
      date = new Date(dateString)
    } else {
      // 如果是其他格式，尝试添加时区信息
      date = new Date(dateString + (dateString.includes('+') ? '' : 'Z'))
    }

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString)
      return dateString // 返回原始字符串
    }

    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    // 调试信息
    console.log(`Time debug - Original: ${dateString}, Parsed: ${date.toISOString()}, Now: ${now.toISOString()}, Diff: ${diffInSeconds}s`)

    // 如果时间差为负数（未来时间），可能是时区问题
    if (diffInSeconds < 0) {
      const absDiff = Math.abs(diffInSeconds)
      if (absDiff < 3600 * 12) { // 如果差异小于12小时，可能是时区问题
        console.warn('Future time detected, possible timezone issue')
        return 'Just now'
      }
    }

    const absDiffInSeconds = Math.abs(diffInSeconds)

    if (absDiffInSeconds < 60) {
      return 'Just now'
    }

    const diffInMinutes = Math.floor(absDiffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    }

    // 超过30天，显示具体日期
    return date.toLocaleDateString()

  } catch (error) {
    console.error('Error parsing date:', dateString, error)
    return dateString
  }
}

// Validate email address
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength = 50): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Extract text content from HTML
export function extractTextFromHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

// Generate email address with domain
export function generateEmailAddress(prefix: string, domain: string): string {
  return `${prefix}@${domain}`
}

// Common email domains - 使用你的真实域名
export const COMMON_DOMAINS = [
  'yzcjwds.xyz'
]

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      textArea.remove()
      return result
    }
  } catch (error) {
    console.error('Failed to copy text:', error)
    return false
  }
}

// Download file from blob
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Check if email is valid
export function validateEmailFormat(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

// Generate secure random string
export function generateSecureRandomString(length = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''

  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(length)
    window.crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
  } else {
    // Fallback for older browsers
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
  }

  return result
}

// Parse email headers
export function parseEmailHeaders(headers: string): Record<string, string> {
  const parsed: Record<string, string> = {}
  const lines = headers.split('\n')

  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      const value = line.substring(colonIndex + 1).trim()
      parsed[key] = value
    }
  }

  return parsed
}

// Sanitize HTML content
export function sanitizeHtml(html: string): string {
  // Remove dangerous elements and attributes
  let sanitized = html

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove dangerous attributes
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/\s*javascript\s*:/gi, '')
  sanitized = sanitized.replace(/\s*data\s*:/gi, '')

  return sanitized
}
