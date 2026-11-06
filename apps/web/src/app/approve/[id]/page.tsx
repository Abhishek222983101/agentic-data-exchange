import { ShieldCheck } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Page } from "@/components/shell/page-header"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Approve a payment" }

// Payments above the agent's limit wait here for a human with World Agent Pass (wired in P6).
export default function ApprovePage() {
  return (
    <Page>
      <div className="mx-auto max-w-md pt-16 pb-10 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-sunken">
          <ShieldCheck className="size-6 text-muted-foreground" />
        </span>
        <h1 className="mt-5 text-[24px] font-semibold tracking-[-0.02em]">No payment is waiting for you</h1>
        <p className="mt-2 text-[15px] text-muted-foreground text-pretty">
          When the agent wants to pay more than its limit, the request shows up here and you approve or
          decline it with World ID. Nothing above the limit is ever paid without you.
        </p>
        <Button asChild variant="outline" size="lg" className="mt-6">
          <Link href="/console">Back to the console</Link>
        </Button>
      </div>
    </Page>
  )
}
