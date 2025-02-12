"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Friend {
  id: string
  name: string
  image: string
}

interface FriendRequest {
  id: string
  sender: {
    id: string
    name: string
    image: string
  }
}

export function FriendManagement() {
  const { data: session } = useSession()
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])

  useEffect(() => {
    fetchFriends()
    fetchFriendRequests()
  }, [])

  const fetchFriends = async () => {
    const response = await fetch("/api/friends")
    if (response.ok) {
      const data = await response.json()
      setFriends(data)
    }
  }

  const fetchFriendRequests = async () => {
    const response = await fetch("/api/friends/requests")
    if (response.ok) {
      const data = await response.json()
      setFriendRequests(data)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    const response = await fetch("/api/friends/requests", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, status: "accepted" }),
    })
    if (response.ok) {
      fetchFriends()
      fetchFriendRequests()
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    const response = await fetch("/api/friends/requests", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, status: "rejected" }),
    })
    if (response.ok) {
      fetchFriendRequests()
    }
  }

  return (
    <div className="space-y-4" role="region" aria-label="Friend Management">
      <Card>
        <CardHeader>
          <CardTitle>Friend Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {friendRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={request.sender.image} alt={request.sender.name} />
                  <AvatarFallback>{request.sender.name[0]}</AvatarFallback>
                </Avatar>
                <span>{request.sender.name}</span>
              </div>
              <div>
                <Button
                  onClick={() => handleAcceptRequest(request.id)}
                  className="mr-2"
                  aria-label={`Accept friend request from ${request.sender.name}`}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRejectRequest(request.id)}
                  aria-label={`Reject friend request from ${request.sender.name}`}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Friends</CardTitle>
        </CardHeader>
        <CardContent>
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center space-x-2 mb-2">
              <Avatar>
                <AvatarImage src={friend.image} alt={friend.name} />
                <AvatarFallback>{friend.name[0]}</AvatarFallback>
              </Avatar>
              <span>{friend.name}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

