"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setBio(session.user.bio || "")
      setAvatarUrl(session.user.image || "")
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, bio }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedUser = await response.json()
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload file")
        }

        const { url } = await response.json()
        setAvatarUrl(url)
        toast({
          title: "Avatar Updated",
          description: "Your avatar has been successfully updated.",
        })
      } catch (error) {
        console.error("Error uploading file:", error)
        toast({
          title: "Error",
          description: "Failed to upload avatar. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
      }
    }
  }

  if (!session) {
    return <div>Please sign in to view your profile.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="avatar">Profile Picture</Label>
            <Input id="avatar" type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
          </div>
        </div>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
        </div>
        <Button type="submit">Save Profile</Button>
      </form>
    </div>
  )
}

