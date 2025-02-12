"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react"

interface Post {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    image: string
  }
  likes: { id: string }[]
  comments: {
    id: string
    content: string
    author: {
      id: string
      name: string
      image: string
    }
  }[]
}

export function NewsFeed() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPostContent, setNewPostContent] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const response = await fetch("/api/news-feed")
    if (response.ok) {
      const data = await response.json()
      setPosts(data)
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch("/api/news-feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newPostContent }),
    })
    if (response.ok) {
      const newPost = await response.json()
      setPosts([newPost, ...posts])
      setNewPostContent("")
    }
  }

  const handleLikePost = async (postId: string) => {
    // Implement your like post logic here
    console.log("Liked post:", postId)
  }

  return (
    <div className="space-y-4" role="feed" aria-label="News Feed">
      <Card>
        <CardContent>
          <form onSubmit={handleCreatePost} className="space-y-2">
            <Input
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <Button type="submit">Post</Button>
          </form>
        </CardContent>
      </Card>
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={post.author.image} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{post.author.name}</h3>
              <p
                className="text-sm text-gray-500"
                aria-label={`Posted on ${new Date(post.createdAt).toLocaleString()}`}
              >
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <p>{post.content}</p>
          </CardContent>
          <CardFooter className="space-x-2">
            <Button
              variant="ghost"
              size="sm"
              aria-label={`Like post. ${post.likes.length} likes`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleLikePost(post.id)
                }
              }}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              {post.likes.length} Likes
            </Button>
            <Button variant="ghost" size="sm" aria-label={`Comment on post. ${post.comments.length} comments`}>
              <MessageCircle className="w-4 h-4 mr-2" />
              {post.comments.length} Comments
            </Button>
            <Button variant="ghost" size="sm" aria-label="Share post">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

