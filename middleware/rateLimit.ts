import rateLimit from "express-rate-limit"
import type { NextApiRequest, NextApiResponse } from "next"

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
})

export function rateLimitMiddleware(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  return new Promise((resolve, reject) => {
    limiter(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

