import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import type { Member } from "@/types"

export default function GroupMembers({ members }: { members: Member[] }) {
  return (
    <div>
      <Input placeholder="Search members..." className="mb-4" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="flex items-center p-4">
              <Avatar className="w-10 h-10 mr-3">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

