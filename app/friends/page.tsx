"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Friend {
  id: string
  name: string
  avatarUrl: string
}

export default function FriendsPage() {
  const { data: session } = useSession()
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<Friend[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // TODO: Fetch friends and friend requests from API
    setFriends([
      { id: "1", name: "Alice", avatarUrl: "/placeholder-avatar-1.jpg" },
      { id: "2", name: "Bob", avatarUrl: "/placeholder-avatar-2.jpg" },
    ])
    setFriendRequests([{ id: "3", name: "Charlie", avatarUrl: "/placeholder-avatar-3.jpg" }])
  }, [])

  const handleAcceptRequest = (friend: Friend) => {
    // TODO: Implement API call to accept friend request
    setFriends([...friends, friend])
    setFriendRequests(friendRequests.filter((req) => req.id !== friend.id))
  }

  const handleRejectRequest = (friendId: string) => {
    // TODO: Implement API call to reject friend request
    setFriendRequests(friendRequests.filter((req) => req.id !== friendId))
  }

  const handleRemoveFriend = (friendId: string) => {
    // TODO: Implement API call to remove friend
    setFriends(friends.filter((friend) => friend.id !== friendId))
  }

  const filteredFriends = friends.filter((friend) => friend.name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (!session) {
    return <div>Please sign in to view your friends.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Friends</h1>
      <Input
        type="text"
        placeholder="Search friends..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Friend Requests</h2>
          {friendRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Avatar className="mr-2">
                  <AvatarImage src={request.avatarUrl} alt={request.name} />
                  <AvatarFallback>{request.name[0]}</AvatarFallback>
                </Avatar>
                <span>{request.name}</span>
              </div>
              <div>
                <Button onClick={() => handleAcceptRequest(request)} className="mr-2">
                  Accept
                </Button>
                <Button variant="outline" onClick={() => handleRejectRequest(request.id)}>
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Friends</h2>
          {filteredFriends.map((friend) => (
            <div key={friend.id} className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Avatar className="mr-2">
                  <AvatarImage src={friend.avatarUrl} alt={friend.name} />
                  <AvatarFallback>{friend.name[0]}</AvatarFallback>
                </Avatar>
                <span>{friend.name}</span>
              </div>
              <Button variant="outline" onClick={() => handleRemoveFriend(friend.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

