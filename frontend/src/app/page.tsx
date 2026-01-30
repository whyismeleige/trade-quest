"use client"

import { AnimatedThemeToggler } from "@/components/providers/theme.provider"
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"
import { SearchField } from "@/components/ui/search-field"
import { VideoText } from "@/components/ui/video-text"

export default function Page() {
  const handleSearch = (value: string) => {
    console.log("Search:", value)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4">
      <h1 className="text-4xl font-bold">Hello World</h1>
      
      <AnimatedThemeToggler className="rounded-full border p-2 hover:bg-muted transition-colors" />
      
      <SearchField 
        label="Search"
        placeholder="Search..."
        onSearch={handleSearch}
      />
      
      <div className="relative h-[300px] w-full max-w-2xl overflow-hidden">
        <VideoText src="https://cdn.magicui.design/ocean-small.webm">
          OCEAN
        </VideoText>
      </div>

      <div className="w-full max-w-4xl">
        <HeroVideoDialog
          className="block dark:hidden"
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block"
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="Hero Video"
        />
      </div>
    </div>
  )
}