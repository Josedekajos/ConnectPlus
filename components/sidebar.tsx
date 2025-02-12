import { Home, MessageCircle, Users, Bell, Settings, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export default function Sidebar() {
  const { theme, setTheme } = useTheme()

  return (
    <aside className="w-16 bg-card text-card-foreground border-r hidden sm:block">
      <nav className="flex flex-col items-center py-4 h-full">
        <Link href="/" className="mb-8">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Home className="w-6 h-6" />
          </Button>
        </Link>
        <Link href="/messages">
          <Button variant="ghost" size="icon" className="rounded-full mb-4">
            <MessageCircle className="w-6 h-6" />
          </Button>
        </Link>
        <Link href="/friends">
          <Button variant="ghost" size="icon" className="rounded-full mb-4">
            <Users className="w-6 h-6" />
          </Button>
        </Link>
        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="rounded-full mb-4">
            <Bell className="w-6 h-6" />
          </Button>
        </Link>
        <div className="mt-auto">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full mb-4"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </Button>
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </nav>
    </aside>
  )
}

