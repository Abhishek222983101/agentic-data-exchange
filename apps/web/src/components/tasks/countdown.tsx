"use client"

import { useEffect, useState } from "react"

function format(secondsLeft: number): string {
  if (secondsLeft <= 0) return "Closed"
  const h = Math.floor(secondsLeft / 3600)
  const m = Math.floor((secondsLeft % 3600) / 60)
  if (h >= 48) return `Closes in ${Math.floor(h / 24)} days`
  if (h >= 1) return `Closes in ${h} h ${m} min`
  if (m >= 1) return `Closes in ${m} min`
  return "Closes in under a minute"
}

/** Deadline countdown from the task's on-chain `deadline` (unix seconds). Ticks every 30 s. */
export function Countdown({ deadline, className }: { deadline: number; className?: string }) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Math.floor(Date.now() / 1000))
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 30_000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className={className} suppressHydrationWarning>
      {now === null ? " " : format(deadline - now)}
    </span>
  )
}
