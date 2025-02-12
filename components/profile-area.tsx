import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircle, UserPlus } from "lucide-react"

export default function ProfileArea() {
  return (
    <div className="w-80 bg-card text-card-foreground border-l p-6 hidden lg:block overflow-y-auto">
      <div className="text-center mb-6">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src="/placeholder-avatar.jpg" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-semibold">John Doe</h2>
        <p className="text-sm text-muted-foreground">@johndoe</p>
      </div>
      <div className="flex justify-center space-x-2 mb-6">
        <Button>
          <MessageCircle className="w-4 h-4 mr-2" />
          Message
        </Button>
        <Button variant="outline">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Friend
        </Button>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">About</h3>
        <p className="text-sm text-muted-foreground">
          I'm a software developer passionate about creating amazing apps and connecting with like-minded individuals!
        </p>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Friends</h3>
        <div className="flex flex-wrap">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Avatar key={i} className="w-10 h-10 mr-2 mb-2">
              <AvatarFallback>F{i}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Mutual Groups</h3>
        <ul className="text-sm">
          <li className="mb-1">🚀 Tech Enthusiasts</li>
          <li className="mb-1">🎮 Gamers United</li>
          <li className="mb-1">📚 Book Club</li>
        </ul>
      </div>
    </div>
  )
}

