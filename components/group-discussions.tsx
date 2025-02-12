import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import type { Discussion } from "@/types"

export default function GroupDiscussions({ discussions }: { discussions: Discussion[] }) {
  return (
    <div className="space-y-4">
      {discussions.map((discussion) => (
        <Card key={discussion.id}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              {discussion.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{discussion.replies} replies</p>
            <p>Last activity: {discussion.lastActivity}</p>
            <Button className="mt-2">View Discussion</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

