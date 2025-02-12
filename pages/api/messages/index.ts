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
      const { recipientId } = req.query

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id, recipientId: String(recipientId) },
            { senderId: String(recipientId), recipientId: session.user.id },
          ],
        },
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, image: true } } },
      })

      return res.status(200).json(messages)
    } else if (req.method === "POST") {
      const { recipientId, content } = req.body

      const newMessage = await prisma.message.create({
        data: {
          senderId: session.user.id,
          recipientId,
          content,
        },
        include: { sender: { select: { id: true, name: true, image: true } } },
      })

      return res.status(201).json(newMessage)
    } else {
      res.setHeader("Allow", ["GET", "POST"])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    errorHandler(error, req, res, () => {})
  }
}

