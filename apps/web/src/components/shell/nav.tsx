"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DESKTOP_EXTRA, PRIMARY_NAV } from "./nav-items"

export function DesktopNav() {
  const path = usePathname()
  return (
    <nav aria-label="Main" className="hidden md:flex items-center gap-1">
      {[...PRIMARY_NAV, ...DESKTOP_EXTRA].map((item) => {
        const active = item.match(path)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm transition-colors",
              active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function BottomNav() {
  const path = usePathname()
  // The recorder is full-screen: no nav over the camera.
  if (/^\/record\/.+/.test(path)) return null
  return (
    <nav
      aria-label="Main"
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 backdrop-blur-xl pb-safe"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {PRIMARY_NAV.map(({ href, label, icon: Icon, match }) => {
          const active = match(path)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-12 place-items-center rounded-full transition-colors",
                    active && "bg-signal-soft text-foreground",
                  )}
                >
                  <Icon className="size-[19px]" strokeWidth={active ? 2.2 : 1.8} />
                </span>
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
