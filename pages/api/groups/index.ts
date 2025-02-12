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
      const groups = await prisma.group.findMany({
        where: { members: { some: { userId: session.user.id } } },
        include: { members: { select: { user: { select: { id: true, name: true, image: true } } } } },
      })

      return res.status(200).json(groups)
    } else if (req.method === "POST") {
      const { name, description } = req.body

      const newGroup = await prisma.group.create({
        data: {
          name,
          description,
          members: {
            create: { userId: session.user.id, role: "ADMIN" },
          },
        },
        include: { members: { select: { user: { select: { id: true, name: true, image: true } } } } },
      })

      return res.status(201).json(newGroup)
    } else {
      res.setHeader("Allow", ["GET", "POST"])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    errorHandler(error, req, res, () => {})
  }
}

