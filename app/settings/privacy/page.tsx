"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PrivacySettingsPage() {
  const { data: session } = useSession()
  const [profileVisibility, setProfileVisibility] = useState("public")
  const [showEmail, setShowEmail] = useState(false)
  const [allowFriendRequests, setAllowFriendRequests] = useState(true)
  const [showOnlineStatus, setShowOnlineStatus] = useState(true)

  useEffect(() => {
    // TODO: Fetch current privacy settings from API
  }, [])

  const handleSaveSettings = async () => {
    // TODO: Implement API call to save privacy settings
    console.log("Privacy settings saved:", {
      profileVisibility,
      showEmail,
      allowFriendRequests,
      showOnlineStatus,
    })
  }

  if (!session) {
    return <div>Please sign in to view your privacy settings.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Privacy Settings</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="profile-visibility">Profile Visibility</Label>
          <Select value={profileVisibility} onValueChange={setProfileVisibility}>
            <SelectTrigger id="profile-visibility">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="friends">Friends Only</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="show-email">Show Email Address</Label>
          <Switch id="show-email" checked={showEmail} onCheckedChange={setShowEmail} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="allow-friend-requests">Allow Friend Requests</Label>
          <Switch id="allow-friend-requests" checked={allowFriendRequests} onCheckedChange={setAllowFriendRequests} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="show-online-status">Show Online Status</Label>
          <Switch id="show-online-status" checked={showOnlineStatus} onCheckedChange={setShowOnlineStatus} />
        </div>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  )
}

