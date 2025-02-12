"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Group } from "@/types"
import GroupEvents from "./group-events"
import GroupDiscussions from "./group-discussions"
import GroupFiles from "./group-files"
import GroupMembers from "./group-members"

export default function GroupTabs({ group }: { group: Group }) {
  const [activeTab, setActiveTab] = useState("events")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="discussions">Discussions</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>
      <TabsContent value="events">
        <GroupEvents events={group.events} />
      </TabsContent>
      <TabsContent value="discussions">
        <GroupDiscussions discussions={group.discussions} />
      </TabsContent>
      <TabsContent value="files">
        <GroupFiles files={group.files} />
      </TabsContent>
      <TabsContent value="members">
        <GroupMembers members={group.members} />
      </TabsContent>
    </Tabs>
  )
}

