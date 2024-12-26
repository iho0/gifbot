export function rateLimit({ interval, uniqueTokenPerInterval }: {
  interval: number
  uniqueTokenPerInterval: number
}) {
  const tokenCache = new Map()

  return {
    async check(limit: number, token: string) {
      const now = Date.now()
      const tokenCount = tokenCache.get(token) || [0]
      const [count, timestamp = now] = tokenCount

      if (now - timestamp > interval) {
        tokenCache.set(token, [1, now])
        return true
      }

      if (count >= limit) {
        throw new Error('Rate limit exceeded')
      }

      tokenCache.set(token, [count + 1, timestamp])
      return true
    }
  }
} 