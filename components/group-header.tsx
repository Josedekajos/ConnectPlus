import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Group } from "@/types"

export default function GroupHeader({ group }: { group: Group }) {
  return (
    <div className="flex items-center mb-6">
      <Avatar className="w-20 h-20 mr-4">
        <AvatarImage src={group.avatar} alt={group.name} />
        <AvatarFallback>{group.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{group.name}</h1>
        <p className="text-muted-foreground">{group.members} members</p>
      </div>
      <Button>Join Group</Button>
    </div>
  )
}

