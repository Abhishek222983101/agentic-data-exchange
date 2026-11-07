import Link from "next/link"
import { Wordmark } from "@/components/brand/mark"
import { DesktopNav } from "./nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl pt-safe">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between gap-4 px-5">
        <Link href="/" aria-label="Paradigm home" className="-ml-1 rounded-md px-1">
          <Wordmark />
        </Link>
        <DesktopNav />
        <Link
          href="/explorer"
          className="inline-flex items-center gap-1.5 rounded-full bg-signal-soft px-2.5 py-1 text-[11px] font-semibold tracking-[0.06em] text-signal-ink"
        >
          <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
          ON ARKIV
        </Link>
      </div>
    </header>
  )
}
