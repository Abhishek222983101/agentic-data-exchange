import { links } from "@adx/shared"
import type { Metadata } from "next"
import Link from "next/link"
import { ProofLink } from "@/components/proof/proof-link"
import { DemoBadge } from "@/components/shell/demo-badge"
import { Page, PageHeader } from "@/components/shell/page-header"
import { DEMO_CONSOLE } from "@/lib/demo"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Buyer console" }

const KIND_DOT: Record<string, string> = {
  paid: "bg-success",
  verdict: "bg-foreground/50",
  task: "bg-signal",
  approval: "bg-warning",
}

export default function ConsolePage() {
  const p = DEMO_CONSOLE.policy
  const spentPct = Math.min(100, (Number(p.spentToday) / Number(p.daily)) * 100)
  return (
    <Page>
      <PageHeader
        title="Buyer console"
        lead="What the robot team's agent is doing with its budget. It pays on its own up to the limit; anything bigger waits for you."
      >
        <DemoBadge />
      </PageHeader>

      <div className="grid gap-5 pb-10 lg:grid-cols-[340px_1fr]">
        <div className="space-y-5">
          <section className="rounded-[20px] border bg-card p-5" aria-labelledby="policy">
            <h2 id="policy" className="text-[15px] font-semibold">
              Spending rules
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-y-4 text-[14px]">
              <dt className="text-muted-foreground">Per clip, max</dt>
              <dd className="text-right font-mono tabular">{p.perClip} USDC</dd>
              <dt className="text-muted-foreground">Needs your approval above</dt>
              <dd className="text-right font-mono tabular">{p.threshold} USDC</dd>
              <dt className="text-muted-foreground">Daily budget</dt>
              <dd className="text-right font-mono tabular">{p.daily} USDC</dd>
            </dl>
            <div className="mt-5">
              <div className="flex justify-between text-[13px]">
                <span className="text-muted-foreground">Spent today</span>
                <span className="font-mono tabular">
                  {p.spentToday} / {p.daily}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-sunken">
                <div className="h-full rounded-full bg-foreground" style={{ width: `${spentPct}%` }} />
              </div>
            </div>
          </section>

          {DEMO_CONSOLE.approvals.map((a) => (
            <section key={a.id} className="rounded-[20px] border-2 border-warning/50 bg-card p-5">
              <div className="text-[13px] text-warning">Waiting for you</div>
              <h3 className="mt-1 text-[17px] font-semibold">Approve {a.amount} USDC?</h3>
              <p className="mt-1 text-[14px] text-muted-foreground">{a.what}</p>
              <p className="mt-3 text-[14px]">
                Open World App and confirm code{" "}
                <span className="rounded-md bg-sunken px-1.5 py-0.5 font-mono tabular">{a.userCode}</span>, or{" "}
                <Link href={`/approve/${a.id}`} className="font-medium underline underline-offset-4">
                  approve in the browser
                </Link>
                .
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                Expires in {a.expiresInMin} min. Nothing is paid unless you approve.
              </p>
            </section>
          ))}
        </div>

        <section className="rounded-[20px] border bg-card p-5" aria-labelledby="feed">
          <h2 id="feed" className="text-[15px] font-semibold">
            Live activity
          </h2>
          <ol className="mt-3">
            {DEMO_CONSOLE.feed.map((f) => (
              <li key={`${f.at}${f.text}`} className="flex items-start gap-3 border-t py-3 first:border-t-0">
                <span className="w-11 shrink-0 pt-0.5 font-mono text-[12px] text-muted-foreground tabular">
                  {f.at}
                </span>
                <span
                  className={cn("mt-2 size-2 shrink-0 rounded-full", KIND_DOT[f.kind])}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1 text-[14.5px]">
                  {f.text}
                  {f.ref ? (
                    <div className="mt-1.5">
                      <ProofLink kind="hedera" href={links.hashscanTx(f.ref)} />
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </Page>
  )
}
