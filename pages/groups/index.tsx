"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

interface Group {
  id: string
  name: string
  description: string
  members: { user: { id: string; name: string; image: string } }[]
}

export default function GroupsPage() {
  const { data: session } = useSession()
  const [groups, setGroups] = useState<Group[]>([])
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    const response = await fetch("/api/groups")
    if (response.ok) {
      const data = await response.json()
      setGroups(data)
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newGroupName, description: newGroupDescription }),
    })
    if (response.ok) {
      const newGroup = await response.json()
      setGroups([...groups, newGroup])
      setNewGroupName("")
      setNewGroupDescription("")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Groups</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Create New Group</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateGroup} className="space-y-2">
            <Input placeholder="Group Name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
            <Textarea
              placeholder="Group Description"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
            />
            <Button type="submit">Create Group</Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{group.description}</p>
              <p className="text-sm text-gray-500">{group.members.length} members</p>
              <Link href={`/groups/${group.id}`}>
                <Button className="mt-2">View Group</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

