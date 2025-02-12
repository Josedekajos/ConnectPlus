import csrf from "csurf"
import type { NextApiRequest, NextApiResponse } from "next"

const csrfProtection = csrf({ cookie: true })

export function csrfMiddleware(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  return new Promise((resolve, reject) => {
    csrfProtection(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

