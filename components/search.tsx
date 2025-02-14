"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"

export default function Search() {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality here
    console.log("Searching for:", query)
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
      <Input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
      <Button type="submit" size="icon">
        <SearchIcon className="h-4 w-4" />
      </Button>
    </form>
  )
}

