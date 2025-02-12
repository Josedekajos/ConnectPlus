import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"
import { errorHandler } from "@/middleware/errorHandler"
import { sanitizeInput } from "@/utils/sanitize"
import redis from "@/lib/redis"
import logger from "@/lib/logger"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req })
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (req.method === "GET") {
      try {
        const cacheKey = `news-feed:${session.user.id}`
        const cachedPosts = await redis.get(cacheKey)

        if (cachedPosts) {
          return res.status(200).json(JSON.parse(cachedPosts))
        }

        const posts = await prisma.post.findMany({
          where: {
            OR: [{ authorId: session.user.id }, { author: { friends: { some: { friendId: session.user.id } } } }],
          },
          include: {
            author: {
              select: { id: true, name: true, image: true },
            },
            likes: true,
            comments: {
              include: {
                author: {
                  select: { id: true, name: true, image: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        })

        await redis.set(cacheKey, JSON.stringify(posts), "EX", 300) // Cache for 5 minutes

        logger.info({ userId: session.user.id }, "Retrieved news feed")
        return res.status(200).json(posts)
      } catch (error) {
        logger.error({ userId: session.user.id, error }, "Error retrieving news feed")
        return res.status(500).json({ error: "Internal server error" })
      }
    } else if (req.method === "POST") {
      const { content } = req.body
      const sanitizedContent = sanitizeInput(content)

      const newPost = await prisma.post.create({
        data: {
          content: sanitizedContent,
          authorId: session.user.id,
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
        },
      })

      logger.info({ userId: session.user.id, postId: newPost.id }, "Created new post")
      return res.status(201).json(newPost)
    } else {
      res.setHeader("Allow", ["GET", "POST"])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    errorHandler(error, req, res, () => {})
  }
}

