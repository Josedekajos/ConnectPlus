"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Notification } from "@/types"

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // In a real app, this would be a WebSocket connection or server-sent events
    const interval = setInterval(() => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          type: "friend_request",
          content: "John Doe sent you a friend request",
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ])
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        {notifications.length === 0 ? (
          <DropdownMenuItem>No new notifications</DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id}>
              <div className="flex flex-col">
                <span>{notification.content}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

