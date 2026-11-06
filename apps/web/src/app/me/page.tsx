import type { Metadata } from "next"
import Link from "next/link"
import { Page, PageHeader } from "@/components/shell/page-header"
import { Button } from "@/components/ui/button"
import { WalletCard } from "@/components/wallet/wallet-card"

export const metadata: Metadata = { title: "Me" }

export default function MePage() {
  return (
    <Page>
      <PageHeader
        title="Your earnings and licences"
        lead="Everything you've been paid for, and the licences you own."
      ></PageHeader>

      <div className="grid grid-cols-1 gap-5 pb-10 lg:grid-cols-[360px_1fr]">
        <section className="rounded-[20px] bg-foreground p-5 text-background">
          <div className="text-[13px] opacity-70">Paid to you</div>
          <div className="mt-1 font-mono text-[40px] leading-none font-medium tracking-tight tabular">
            0.00
            <span className="ml-2 font-sans text-[15px] font-normal opacity-70">USDC</span>
          </div>
          <WalletCard />
        </section>

        <section aria-labelledby="licences">
          <h2 id="licences" className="text-[17px] font-semibold">
            Licences you own
          </h2>
          <p className="mt-1 text-[14px] text-muted-foreground">
            A licence lets the buyer use your clip for training. Withdraw it and their agent drops the clip.
          </p>
          <div className="mt-4 rounded-[16px] border border-dashed p-5 text-[14px] text-muted-foreground">
            No licences yet. When a clip you filmed is accepted and paid for, its licence appears here, owned
            by your wallet on Arkiv.
          </div>
          <Button asChild variant="signal" size="lg" className="mt-6">
            <Link href="/tasks">Find a task</Link>
          </Button>
        </section>
      </div>
    </Page>
  )
}
