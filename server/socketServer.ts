import type { Server as HttpServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import { PrismaClient } from "@prisma/client"
import config from "@/config"

const prisma = new PrismaClient()

export function initializeSocketServer(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.frontendUrl,
      methods: ["GET", "POST"],
    },
  })

  io.on("connection", (socket) => {
    console.log("A user connected")

    const userId = socket.handshake.query.userId as string
    if (userId) {
      socket.join(userId)
    }

    socket.on("sendMessage", async (message) => {
      const { recipientId, content } = message
      const newMessage = await prisma.message.create({
        data: {
          senderId: userId,
          recipientId,
          content,
        },
        include: { sender: { select: { id: true, name: true, image: true } } },
      })

      io.to(recipientId).emit("newMessage", newMessage)
    })

    socket.on("friendRequest", async (data) => {
      const { recipientId } = data
      const request = await prisma.friendRequest.create({
        data: {
          senderId: userId,
          recipientId,
        },
        include: { sender: { select: { id: true, name: true, image: true } } },
      })

      io.to(recipientId).emit("newFriendRequest", request)
    })

    socket.on("disconnect", () => {
      console.log("A user disconnected")
    })
  })

  return io
}

