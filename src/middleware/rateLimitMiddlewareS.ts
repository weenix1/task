import { Request, Response, NextFunction } from 'express'

let recentRequests: number[] = []

const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  const now = Date.now()
  const minuteAgo = now - 60 * 1000

  recentRequests = recentRequests.filter((timestamp) => timestamp > minuteAgo)

  if (recentRequests.length >= 5) {
    return res
      .status(429)
      .json({ error: 'Too many requests. Please try again later.' })
  }

  recentRequests.push(now)

  next()
}

const rateLimitMiddlewareS = {
  rateLimit,
}

export default rateLimitMiddlewareS
