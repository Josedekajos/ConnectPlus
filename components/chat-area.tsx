"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Paperclip, Mic, Video, File, Image, X, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import socket from "@/lib/socket"

export default function ChatArea() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", sender: "other", timestamp: "10:00 AM", read: true },
    { id: 2, text: "Hi there!", sender: "user", timestamp: "10:01 AM", read: true },
    { id: 3, text: "How are you doing?", sender: "other", timestamp: "10:02 AM", read: false },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const lastMessageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    socket.on("new_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    socket.on("typing", (status) => {
      setIsTyping(status)
    })

    return () => {
      socket.off("new_message")
      socket.off("typing")
    }
  }, [])

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [lastMessageRef])

  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        attachments: attachments,
        read: false,
      }
      setMessages([...messages, message])
      socket.emit("send_message", message)
      setNewMessage("")
      setAttachments([])
    }
  }

  const handleAttachment = (type: string) => {
    // Simulating file attachment
    setAttachments([...attachments, `${type}-${Date.now()}`])
  }

  const removeAttachment = (attachment: string) => {
    setAttachments(attachments.filter((a) => a !== attachment))
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    socket.emit("typing", true)
    setTimeout(() => socket.emit("typing", false), 2000)
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="border-b p-4 flex items-center">
        <Avatar className="w-10 h-10 mr-3">
          <AvatarImage src="/placeholder-avatar.jpg" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">John Doe</h2>
          <p className="text-sm text-muted-foreground">{isTyping ? "Typing..." : "Online"}</p>
        </div>
        <div className="ml-auto">
          <Button variant="ghost" size="icon" className="mr-2">
            <Mic className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            <div className={`max-w-[70%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
              <div
                className={`p-3 rounded-lg ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
              >
                {message.text}
                {message.attachments &&
                  message.attachments.map((attachment, index) => (
                    <div key={index} className="mt-2 text-sm">
                      📎 Attachment: {attachment}
                    </div>
                  ))}
              </div>
              <div
                className={`text-xs mt-1 text-muted-foreground ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                {message.timestamp}
                {message.sender === "user" && (
                  <span className="ml-2">
                    {message.read ? (
                      <Check className="w-3 h-3 inline" />
                    ) : (
                      <Check className="w-3 h-3 inline text-muted" />
                    )}
                  </span>
                )}
              </div>
            </div>
            {message.sender === "other" && (
              <Avatar className="w-8 h-8 mr-2 order-0">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        {attachments.length > 0 && (
          <div className="flex flex-wrap mb-2">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm mr-2 mb-2 flex items-center"
              >
                {attachment}
                <Button variant="ghost" size="sm" className="ml-2 p-0" onClick={() => removeAttachment(attachment)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Paperclip className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Attach File</DialogTitle>
              </DialogHeader>
              <div className="flex justify-around mt-4">
                <Button onClick={() => handleAttachment("image")}>
                  <Image className="w-4 h-4 mr-2" /> Image
                </Button>
                <Button onClick={() => handleAttachment("file")}>
                  <File className="w-4 h-4 mr-2" /> File
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleTyping}
            className="flex-1 mr-2"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

