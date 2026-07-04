export const DEFAULT_API_BASE_URL = 'https://api.npu.codes'
export const DEFAULT_MAIL_DOMAIN = import.meta.env.VITE_DEFAULT_MAIL_DOMAIN || 'npu.codes'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL)
  .replace(/\/+$/, '')
