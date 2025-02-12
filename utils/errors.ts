export class APIError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = "APIError"
    this.statusCode = statusCode
  }
}

export class ValidationError extends APIError {
  constructor(message: string) {
    super(message, 400)
    this.name = "ValidationError"
  }
}

export class NotFoundError extends APIError {
  constructor(message: string) {
    super(message, 404)
    this.name = "NotFoundError"
  }
}

export class UnauthorizedError extends APIError {
  constructor(message = "Unauthorized") {
    super(message, 401)
    this.name = "UnauthorizedError"
  }
}

