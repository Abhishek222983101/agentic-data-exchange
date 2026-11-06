import { links, shortHex } from "@adx/shared"
import { WRITERS } from "@adx/shared/arkiv"
import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ProofLink } from "@/components/proof/proof-link"
import { Page, PageHeader } from "@/components/shell/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { getOpenTasks } from "@/lib/data"
import { recentClips } from "@/lib/server/console"

export const metadata: Metadata = { title: "Buyer console" }

// The rules the buyer agent is configured with (system architecture §12). Enforced in code from P6.
const POLICY = { perClip: "5", threshold: "5", daily: "20" }

export default function ConsolePage() {
  return (
    <Page>
      <PageHeader
        title="Buyer console"
        lead="What the robot team's agent is doing. It pays on its own up to its limit; anything bigger waits for a human."
      />
      <div className="grid grid-cols-1 gap-5 pb-10 lg:grid-cols-[340px_1fr]">
        <div className="space-y-5">
          <section className="rounded-[20px] border bg-card p-5" aria-labelledby="policy">
            <h2 id="policy" className="text-[15px] font-semibold">
              Spending rules
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-y-4 text-[14px]">
              <dt className="text-muted-foreground">Per clip, max</dt>
              <dd className="text-right font-mono tabular">{POLICY.perClip} USDC</dd>
              <dt className="text-muted-foreground">Needs a human above</dt>
              <dd className="text-right font-mono tabular">{POLICY.threshold} USDC</dd>
              <dt className="text-muted-foreground">Daily budget</dt>
              <dd className="text-right font-mono tabular">{POLICY.daily} USDC</dd>
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              <ProofLink
                kind="arkiv"
                href={links.arkivAddress(WRITERS.buyer)}
                label={`Agent ${shortHex(WRITERS.buyer)}`}
              />
            </div>
          </section>
          <Suspense fallback={<Skeleton className="h-32 w-full rounded-[20px]" />}>
            <Tasks />
          </Suspense>
        </div>
        <section className="rounded-[20px] border bg-card p-5" aria-labelledby="feed">
          <h2 id="feed" className="text-[15px] font-semibold">
            Clips received
          </h2>
          <Suspense fallback={<Skeleton className="mt-3 h-48 w-full" />}>
            <Clips />
          </Suspense>
        </section>
      </div>
    </Page>
  )
}

async function Tasks() {
  const res = await getOpenTasks()
  const tasks = res.ok ? res.data : []
  return (
    <section className="rounded-[20px] border bg-card p-5" aria-labelledby="tasks">
      <h2 id="tasks" className="text-[15px] font-semibold">
        Tasks the agent posted
      </h2>
      <ul className="mt-3 space-y-2">
        {tasks.map((t) => (
          <li key={t.key} className="flex items-center justify-between gap-3 text-[14px]">
            <Link href={`/tasks/${t.key}`} className="truncate hover:underline">
              {t.title}
            </Link>
            <span className="shrink-0 font-mono text-muted-foreground tabular">
              {t.filled}/{t.slots}
            </span>
          </li>
        ))}
        {!tasks.length ? <li className="text-[14px] text-muted-foreground">No open tasks.</li> : null}
      </ul>
    </section>
  )
}

const STATUS: Record<string, string> = {
  queued: "Waiting for check",
  processing: "Being checked",
  accepted: "Accepted",
  rejected: "Not accepted",
  duplicate: "Duplicate",
  review: "Needs a human look",
  failed: "Check failed",
}

async function Clips() {
  const clips = await recentClips().catch(() => null)
  if (!clips) return <p className="mt-3 text-[14px] text-muted-foreground">Couldn't load clips right now.</p>
  if (!clips.length) return <p className="mt-3 text-[14px] text-muted-foreground">No clips yet.</p>
  return (
    <ol className="mt-3">
      {clips.map((c) => (
        <li key={c.id} className="flex items-center gap-3 border-t py-3 first:border-t-0">
          <span className="w-12 shrink-0 font-mono text-[12px] text-muted-foreground tabular">{c.time}</span>
          <Link href={`/submissions/${c.id}`} className="min-w-0 flex-1 text-[14.5px] hover:underline">
            {STATUS[c.status] ?? c.status}
            <span className="text-muted-foreground">, {(Number(c.bytes ?? 0) / 1e6).toFixed(1)} MB</span>
          </Link>
        </li>
      ))}
    </ol>
  )
}
