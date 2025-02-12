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
      const requests = await prisma.friendRequest.findMany({
        where: { receiverId: session.user.id, status: "pending" },
        include: { sender: { select: { id: true, name: true, image: true } } },
      })

      return res.status(200).json(requests)
    } else if (req.method === "POST") {
      const { receiverId } = req.body

      const newRequest = await prisma.friendRequest.create({
        data: {
          senderId: session.user.id,
          receiverId,
        },
      })

      return res.status(201).json(newRequest)
    } else if (req.method === "PUT") {
      const { requestId, status } = req.body

      const updatedRequest = await prisma.friendRequest.update({
        where: { id: requestId },
        data: { status },
      })

      if (status === "accepted") {
        await prisma.friend.createMany({
          data: [
            { userId: updatedRequest.senderId, friendId: updatedRequest.receiverId },
            { userId: updatedRequest.receiverId, friendId: updatedRequest.senderId },
          ],
        })
      }

      return res.status(200).json(updatedRequest)
    } else {
      res.setHeader("Allow", ["GET", "POST", "PUT"])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    errorHandler(error, req, res, () => {})
  }
}

