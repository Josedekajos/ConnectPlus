import { Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MobileHeader() {
  return (
    <header className="bg-card text-card-foreground border-b p-4 flex items-center justify-between sm:hidden">
      <Button variant="ghost" size="icon">
        <Menu className="w-6 h-6" />
      </Button>
      <div className="flex-1 mx-4">
        <Input type="text" placeholder="Search..." className="w-full" />
      </div>
      <Button variant="ghost" size="icon">
        <Search className="w-6 h-6" />
      </Button>
    </header>
  )
}

