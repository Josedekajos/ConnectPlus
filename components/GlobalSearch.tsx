"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/router"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SearchResult {
  users: Array<{ id: string; name: string; image: string }>
  posts: Array<{ id: string; content: string; author: { id: string; name: string; image: string } }>
  groups: Array<{ id: string; name: string; description: string }>
}

export function GlobalSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult | null>(null)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for users, posts, or groups..."
        />
        <Button type="submit">Search</Button>
      </form>
      {results && (
        <div className="space-y-4">
          {results.users.length > 0 && (
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-2">Users</h3>
                {results.users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2 mb-2">
                    <Avatar>
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {results.posts.length > 0 && (
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-2">Posts</h3>
                {results.posts.map((post) => (
                  <div key={post.id} className="mb-2">
                    <p>{post.content.substring(0, 100)}...</p>
                    <p className="text-sm text-gray-500">By {post.author.name}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {results.groups.length > 0 && (
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-2">Groups</h3>
                {results.groups.map((group) => (
                  <div key={group.id} className="mb-2">
                    <h4 className="font-medium">{group.name}</h4>
                    <p className="text-sm text-gray-500">{group.description.substring(0, 100)}...</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

