import Link from "next/link"
import { Wordmark } from "@/components/brand/mark"
import { DesktopNav } from "./nav"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-background/80 backdrop-blur-xl pt-safe supports-[backdrop-filter]:border-border/60">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between gap-4 px-5">
        <Link href="/" aria-label="Paradigm home" className="-ml-1 rounded-md px-1">
          <Wordmark />
        </Link>
        <DesktopNav />
        <ThemeToggle />
      </div>
    </header>
  )
}
