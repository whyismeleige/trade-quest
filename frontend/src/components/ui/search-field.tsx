"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SearchFieldProps {
  label?: string
  placeholder?: string
  onSearch?: (value: string) => void
  className?: string
}

export function SearchField({
  label = "Search",
  placeholder = "Search...",
  onSearch,
  className,
}: SearchFieldProps) {
  return (
    <div className={`w-full max-w-sm space-y-2 ${className || ""}`}>
      {label && <Label htmlFor="search-input">{label}</Label>}
      <div className="relative">
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="bg-background pl-9"
          id="search-input"
          placeholder={placeholder}
          type="search"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
    </div>
  )
}
