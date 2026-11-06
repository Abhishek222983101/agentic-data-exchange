"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const next = resolvedTheme === "dark" ? "light" : "dark"
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      aria-label={`Switch to ${next} theme`}
      onClick={() => setTheme(next)}
      className="text-muted-foreground hover:text-foreground"
    >
      <Sun className="size-[18px] dark:hidden" />
      <Moon className="hidden size-[18px] dark:block" />
    </Button>
  )
}
