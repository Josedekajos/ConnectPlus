import type { NextApiRequest, NextApiResponse } from "next"

export function errorHandler(err: any, req: NextApiRequest, res: NextApiResponse, next: () => void) {
  console.error(err.stack)

  if (res.headersSent) {
    return next()
  }

  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  })
}

