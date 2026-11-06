import type { Metadata } from "next"
import Link from "next/link"
import { DemoBadge } from "@/components/shell/demo-badge"
import { Page, PageHeader } from "@/components/shell/page-header"
import { Button } from "@/components/ui/button"
import { DEMO_ME } from "@/lib/demo"

export const metadata: Metadata = { title: "Me" }

export default function MePage() {
  return (
    <Page>
      <PageHeader
        title="Your earnings and licences"
        lead="Everything you've been paid for, and the licences you own."
      >
        <DemoBadge />
      </PageHeader>

      <div className="grid gap-5 pb-10 lg:grid-cols-[360px_1fr]">
        <section className="rounded-[20px] bg-foreground p-5 text-background">
          <div className="text-[13px] opacity-70">Paid to you</div>
          <div className="mt-1 font-mono text-[40px] leading-none font-medium tracking-tight tabular">
            {DEMO_ME.earnedUsdc}
            <span className="ml-2 font-sans text-[15px] font-normal opacity-70">USDC</span>
          </div>
          <div className="mt-6 rounded-xl bg-background/10 p-3 text-[13px]">
            <div className="opacity-70">Your wallet</div>
            <div className="mt-0.5">
              Created on your phone the first time you claim. No email or password.
            </div>
          </div>
        </section>

        <section aria-labelledby="licences">
          <h2 id="licences" className="text-[17px] font-semibold">
            Licences you own
          </h2>
          <p className="mt-1 text-[14px] text-muted-foreground">
            A licence lets the buyer use your clip for training. Withdraw it and their agent drops the clip.
          </p>
          <ul className="mt-4 space-y-2">
            {DEMO_ME.licences.map((l) => (
              <li key={l.key} className="flex items-center gap-4 rounded-[16px] border bg-card p-4">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-medium">{l.task}</div>
                  <div className="mt-0.5 text-[13px] text-muted-foreground">
                    {l.paid} USDC paid, {l.daysLeft} days left
                  </div>
                </div>
                <Button variant="outline" size="lg" disabled>
                  Withdraw
                </Button>
              </li>
            ))}
          </ul>
          <Button asChild variant="signal" size="lg" className="mt-6">
            <Link href="/tasks">Find a task</Link>
          </Button>
        </section>
      </div>
    </Page>
  )
}
