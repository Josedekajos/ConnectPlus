"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function GroupsPage() {
  const [groups, setGroups] = useState([
    { id: 1, name: "Tech Enthusiasts", members: 1250, avatar: "/group-avatar-1.jpg", events: 2, discussions: 15 },
    { id: 2, name: "Book Club", members: 450, avatar: "/group-avatar-2.jpg", events: 1, discussions: 8 },
    { id: 3, name: "Fitness Fanatics", members: 890, avatar: "/group-avatar-3.jpg", events: 3, discussions: 20 },
  ])

  const [suggestions, setSuggestions] = useState([
    { id: 4, name: "Travel Addicts", members: 3200, avatar: "/group-avatar-4.jpg", events: 5, discussions: 30 },
    { id: 5, name: "Foodies Unite", members: 1800, avatar: "/group-avatar-5.jpg", events: 2, discussions: 25 },
  ])

  const handleJoinGroup = (id: number) => {
    const joined = suggestions.find((g) => g.id === id)
    if (joined) {
      setGroups([...groups, joined])
      setSuggestions(suggestions.filter((g) => g.id !== id))
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Groups</h1>
      <Tabs defaultValue="my-groups">
        <TabsList className="mb-4">
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>
        <TabsContent value="my-groups">
          <Input placeholder="Search groups..." className="mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Card key={group.id}>
                <CardContent className="p-4">
                  <div className="flex items-center mb-4">
                    <Avatar className="w-16 h-16 mr-4">
                      <AvatarImage src={group.avatar} alt={group.name} />
                      <AvatarFallback>{group.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{group.name}</h3>
                      <p className="text-sm text-muted-foreground">{group.members} members</p>
                    </div>
                  </div>
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{group.events} events</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      <span className="text-sm">{group.discussions} discussions</span>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        View Group
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{group.name}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Recent Discussions</h4>
                        <ul className="list-disc list-inside">
                          <li>Latest tech trends</li>
                          <li>Upcoming meetup planning</li>
                          <li>Project collaboration opportunities</li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="discover">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((group) => (
              <Card key={group.id}>
                <CardContent className="flex items-center p-4">
                  <Avatar className="w-16 h-16 mr-4">
                    <AvatarImage src={group.avatar} alt={group.name} />
                    <AvatarFallback>{group.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{group.name}</h3>
                    <p className="text-sm text-muted-foreground">{group.members} members</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm">{group.events} events</span>
                      <span className="text-sm">{group.discussions} discussions</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleJoinGroup(group.id)}>
                    <Plus className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

