"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "./ui/input"
import { Search } from "lucide-react"
import { Button } from "./ui/button"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Redirect to the workflow page with the search query
      router.push(`/workflow/${query}?query=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search workflows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-20 py-2 bg-muted/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-3"
        >
          Search
        </Button>
      </div>
    </form>
  )
} 