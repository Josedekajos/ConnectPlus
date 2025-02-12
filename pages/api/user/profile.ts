import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"
import { errorHandler } from "@/middleware/errorHandler"
import { UnauthorizedError, NotFoundError, ValidationError } from "@/utils/errors"

const prisma = new PrismaClient()

const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req })

    if (!session) {
      throw new UnauthorizedError()
    }

    if (req.method === "GET") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true, image: true, bio: true },
      })

      if (!user) {
        throw new NotFoundError("User not found")
      }

      return res.status(200).json(user)
    } else if (req.method === "PUT") {
      const validatedData = profileSchema.parse(req.body)

      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: validatedData,
        select: { id: true, name: true, email: true, image: true, bio: true },
      })

      return res.status(200).json(updatedUser)
    } else {
      res.setHeader("Allow", ["GET", "PUT"])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors.map((e) => e.message).join(", "))
    }
    if (error instanceof UnauthorizedError || error instanceof NotFoundError || error instanceof ValidationError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    errorHandler(error, req, res, () => {})
  }
}

