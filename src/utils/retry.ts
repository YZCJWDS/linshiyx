// Retry utility for API calls

export interface RetryOptions {
  maxAttempts?: number
  delay?: number
  backoff?: boolean
  onRetry?: (attempt: number, error: Error) => void
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    onRetry
  } = options

  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxAttempts) {
        throw lastError
      }

      if (onRetry) {
        onRetry(attempt, lastError)
      }

      // Calculate delay with optional exponential backoff
      const currentDelay = backoff ? delay * Math.pow(2, attempt - 1) : delay
      await new Promise(resolve => setTimeout(resolve, currentDelay))
    }
  }

  throw lastError!
}

// Specific retry for network requests
export async function retryNetworkRequest<T>(
  requestFn: () => Promise<T>,
  maxAttempts = 3
): Promise<T> {
  return withRetry(requestFn, {
    maxAttempts,
    delay: 1000,
    backoff: true,
    onRetry: (attempt, error) => {
      console.warn(`Network request failed (attempt ${attempt}):`, error.message)
    }
  })
}
