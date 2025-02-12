import { createMocks } from "node-mocks-http"
import { getSession } from "next-auth/react"
import newsFeedHandler from "@/pages/api/news-feed"
import { PrismaClient } from "@prisma/client"

jest.mock("next-auth/react")
jest.mock("@prisma/client")

const mockPrisma = {
  post: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}
;(PrismaClient as jest.Mock).mockImplementation(() => mockPrisma)

describe("/api/news-feed", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns 401 if not authenticated", async () => {
    const { req, res } = createMocks({
      method: "GET",
    })
    ;(getSession as jest.Mock).mockResolvedValue(null)

    await newsFeedHandler(req, res)

    expect(res._getStatusCode()).toBe(401)
    expect(JSON.parse(res._getData())).toEqual({ error: "Unauthorized" })
  })

  it("returns posts if authenticated", async () => {
    const { req, res } = createMocks({
      method: "GET",
    })

    const mockPosts = [
      { id: "1", content: "Test post 1", author: { id: "1", name: "User 1" } },
      { id: "2", content: "Test post 2", author: { id: "2", name: "User 2" } },
    ]
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: "1" } })
    mockPrisma.post.findMany.mockResolvedValue(mockPosts)

    await newsFeedHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(mockPosts)
  })

  it("creates a new post if authenticated", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        content: "New test post",
      },
    })

    const mockNewPost = {
      id: "3",
      content: "New test post",
      author: { id: "1", name: "User 1" },
    }
    ;(getSession as jest.Mock).mockResolvedValue({ user: { id: "1" } })
    mockPrisma.post.create.mockResolvedValue(mockNewPost)

    await newsFeedHandler(req, res)

    expect(res._getStatusCode()).toBe(201)
    expect(JSON.parse(res._getData())).toEqual(mockNewPost)
  })
})

