import { ShieldCheck } from "lucide-react"
import type { Metadata } from "next"
import { DemoBadge } from "@/components/shell/demo-badge"
import { Page } from "@/components/shell/page-header"
import { Button } from "@/components/ui/button"
import { DEMO_CONSOLE } from "@/lib/demo"

export const metadata: Metadata = { title: "Approve a payment" }

// P6 wires this to the approvals table and World Agent Pass (auth code + PKCE fallback).
export default function ApprovePage() {
  const a = DEMO_CONSOLE.approvals[0]
  if (!a) return null
  return (
    <Page>
      <div className="mx-auto max-w-md pt-10 pb-10">
        <DemoBadge />
        <h1 className="mt-4 text-[28px] leading-tight font-semibold tracking-[-0.03em]">
          The agent wants to pay {a.amount} USDC
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">{a.what}</p>
        <dl className="mt-6 space-y-3 rounded-[18px] border bg-card p-5 text-[14px]">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Amount</dt>
            <dd className="font-mono tabular">{a.amount} USDC</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Above your limit of</dt>
            <dd className="font-mono tabular">{DEMO_CONSOLE.policy.threshold} USDC</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Expires in</dt>
            <dd className="tabular">{a.expiresInMin} min</dd>
          </div>
        </dl>
        <div className="mt-6 grid gap-3">
          <Button variant="signal" size="xl" disabled>
            <ShieldCheck />
            Approve with World ID
          </Button>
          <Button variant="outline" size="xl" disabled>
            Decline
          </Button>
        </div>
        <p className="mt-4 text-[13px] text-muted-foreground">
          Approving needs a fresh World ID check on your phone. If you decline or let it expire, nothing is
          paid.
        </p>
      </div>
    </Page>
  )
}
