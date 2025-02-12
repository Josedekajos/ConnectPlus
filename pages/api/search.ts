import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"
import { errorHandler } from "@/middleware/errorHandler"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req })
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (req.method === "GET") {
      const { query } = req.query

      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: String(query), mode: "insensitive" } },
            { email: { contains: String(query), mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, image: true },
      })

      const posts = await prisma.post.findMany({
        where: {
          content: { contains: String(query), mode: "insensitive" },
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
        },
        take: 10,
      })

      const groups = await prisma.group.findMany({
        where: {
          OR: [
            { name: { contains: String(query), mode: "insensitive" } },
            { description: { contains: String(query), mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, description: true },
        take: 10,
      })

      return res.status(200).json({ users, posts, groups })
    } else {
      res.setHeader("Allow", ["GET"])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    errorHandler(error, req, res, () => {})
  }
}

