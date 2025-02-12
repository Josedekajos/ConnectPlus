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
      const friends = await prisma.friend.findMany({
        where: { userId: session.user.id },
        include: { friend: { select: { id: true, name: true, image: true } } },
      })

      return res.status(200).json(friends)
    } else {
      res.setHeader("Allow", ["GET"])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    errorHandler(error, req, res, () => {})
  }
}

