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

    const { id } = req.query

    if (req.method === "GET") {
      const group = await prisma.group.findUnique({
        where: { id: String(id) },
        include: { members: { select: { user: { select: { id: true, name: true, image: true } } } } },
      })

      if (!group) {
        return res.status(404).json({ error: "Group not found" })
      }

      return res.status(200).json(group)
    } else if (req.method === "PUT") {
      const { name, description } = req.body

      const updatedGroup = await prisma.group.update({
        where: { id: String(id) },
        data: { name, description },
        include: { members: { select: { user: { select: { id: true, name: true, image: true } } } } },
      })

      return res.status(200).json(updatedGroup)
    } else if (req.method === "DELETE") {
      await prisma.group.delete({ where: { id: String(id) } })

      return res.status(204).end()
    } else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    errorHandler(error, req, res, () => {})
  }
}

