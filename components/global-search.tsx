"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"

export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // This would typically come from an API call
  const searchResults = [
    { type: "user", id: "1", name: "John Doe", avatar: "/placeholder-avatar.jpg" },
    { type: "post", id: "1", title: "Latest tech trends", author: "Jane Smith" },
    { type: "group", id: "1", name: "Tech Enthusiasts", members: 1250 },
    { type: "message", id: "1", content: "Hey, did you see the new...", from: "Alice Johnson" },
  ]

  const handleSelect = (item: any) => {
    setOpen(false)
    switch (item.type) {
      case "user":
        router.push(`/profile/${item.id}`)
        break
      case "post":
        router.push(`/post/${item.id}`)
        break
      case "group":
        router.push(`/groups/${item.id}`)
        break
      case "message":
        router.push(`/messages?highlight=${item.id}`)
        break
    }
  }

  return (
    <>
      <Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={() => setOpen(true)}>
        <SearchIcon className="mr-2 h-4 w-4" />
        Search...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Users">
            {searchResults
              .filter((item) => item.type === "user")
              .map((item) => (
                <CommandItem key={item.id} onSelect={() => handleSelect(item)}>
                  {item.name}
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Posts">
            {searchResults
              .filter((item) => item.type === "post")
              .map((item) => (
                <CommandItem key={item.id} onSelect={() => handleSelect(item)}>
                  {item.title}
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Groups">
            {searchResults
              .filter((item) => item.type === "group")
              .map((item) => (
                <CommandItem key={item.id} onSelect={() => handleSelect(item)}>
                  {item.name}
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Messages">
            {searchResults
              .filter((item) => item.type === "message")
              .map((item) => (
                <CommandItem key={item.id} onSelect={() => handleSelect(item)}>
                  {item.content}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

