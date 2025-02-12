import { createMocks } from "node-mocks-http"
import { getSession } from "next-auth/react"
import profileHandler from "@/pages/api/user/profile"
import { PrismaClient } from "@prisma/client"
import { jest } from "@jest/globals" // Import jest

jest.mock("next-auth/react")
jest.mock("@prisma/client")

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}(PrismaClient as jest.Mock).mockImplementation(() => mockPrisma)

describe("/api/user/profile", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns 401 if not authenticated", async () => {
    const { req, res } = createMocks({
      method: "GET",
    })
    ;(getSession as jest.Mock).mockResolvedValue(null)

    await profileHandler(req, res)

    expect(res._getStatusCode()).toBe(401)
    expect(JSON.parse(res._getData())).toEqual({ error: "Unauthorized" })
  })

  it("returns user profile if authenticated", async () => {
    const { req, res } = createMocks({
      method: "GET",
    })

    const mockUser = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      image: "https://example.com/image.jpg",
      bio: "Test bio",
    }
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: "1" } })
    mockPrisma.user.findUnique.mockResolvedValue(mockUser)

    await profileHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(mockUser)
  })

  it("updates user profile if authenticated", async () => {
    const { req, res } = createMocks({
      method: "PUT",
      body: {
        name: "Updated Name",
        bio: "Updated bio",
      },
    })

    const mockUpdatedUser = {
      id: "1",
      name: "Updated Name",
      email: "test@example.com",
      image: "https://example.com/image.jpg",
      bio: "Updated bio",
    }
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: "1" } })
    mockPrisma.user.update.mockResolvedValue(mockUpdatedUser)

    await profileHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(mockUpdatedUser)
  })
})

