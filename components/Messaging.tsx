"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { io, type Socket } from "socket.io-client"

interface Message {
  id: string
  content: string
  senderId: string
  recipientId: string
  createdAt: string
  sender: {
    id: string
    name: string
    image: string
  }
}

export function Messaging() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (session) {
      socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        query: { userId: session.user.id },
      })

      socketRef.current.on("newMessage", (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message])
      })

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect()
        }
      }
    }
  }, [session])

  useEffect(() => {
    if (selectedRecipient) {
      fetchMessages()
    }
  }, [selectedRecipient])

  useEffect(() => {
    scrollToBottom()
  }, [selectedRecipient, messages]) // Updated dependency array

  const fetchMessages = async () => {
    if (selectedRecipient) {
      const response = await fetch(`/api/messages?recipientId=${selectedRecipient}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRecipient && newMessage.trim()) {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: selectedRecipient, content: newMessage }),
      })
      if (response.ok) {
        const sentMessage = await response.json()
        setMessages([...messages, sentMessage])
        setNewMessage("")
        if (socketRef.current) {
          socketRef.current.emit("sendMessage", sentMessage)
        }
      }
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 overflow-y-auto mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === session?.user.id ? "justify-end" : "justify-start"} mb-2`}
            >
              <div className={`flex items-start ${message.senderId === session?.user.id ? "flex-row-reverse" : ""}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.sender.image} alt={message.sender.name} />
                  <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                </Avatar>
                <div
                  className={`mx-2 p-2 rounded-lg ${message.senderId === session?.user.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
          <Button type="submit">Send</Button>
        </form>
      </CardContent>
    </Card>
  )
}

