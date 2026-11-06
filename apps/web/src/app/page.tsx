import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <section className="mx-auto max-w-[1120px] px-5 pt-16">
      <h1 className="max-w-[16ch] text-[44px] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
        Robots learn from your hands.
      </h1>
      <p className="mt-4 max-w-[52ch] text-muted-foreground text-pretty">
        Film a short task on your phone, get paid in USDC, and keep the licence to your clip.
      </p>
      <Button asChild variant="signal" size="xl" className="mt-8">
        <Link href="/tasks">See open tasks</Link>
      </Button>
    </section>
  )
}
