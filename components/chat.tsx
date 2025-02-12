"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import io from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

let socket: any

export default function Chat() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<string[]>([])
  const { data: session } = useSession()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    socketInitializer()
    return () => {
      if (socket) socket.disconnect()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const socketInitializer = async () => {
    await fetch("/api/socket")
    socket = io()

    socket.on("receive-message", (message: string) => {
      setMessages((prev) => [...prev, message])
    })
  }

  const sendMessage = async () => {
    if (message.trim() && session?.user?.name) {
      const messageToSend = `${session.user.name}: ${message}`
      socket.emit("send-message", messageToSend)
      setMessage("")
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="bg-secondary p-2 rounded-lg">
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  )
}

