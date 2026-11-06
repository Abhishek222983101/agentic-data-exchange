import { links, shortHex } from "@adx/shared"
import { WRITERS } from "@adx/shared/arkiv"
import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ProofLink } from "@/components/proof/proof-link"
import { AutoRefresh } from "@/components/shell/auto-refresh"
import { Page, PageHeader } from "@/components/shell/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { getOpenTasks } from "@/lib/data"
import { agentFeed, pendingApprovals, recentClips } from "@/lib/server/console"

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
      <AutoRefresh />
      <div className="grid grid-cols-1 gap-5 pb-10 lg:grid-cols-[340px_1fr]">
        <div className="space-y-5">
          <Suspense fallback={null}>
            <Approvals />
          </Suspense>
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
        <div className="space-y-5">
          <section className="rounded-[20px] border bg-card p-5" aria-labelledby="feed">
            <div className="flex items-baseline justify-between">
              <h2 id="feed" className="text-[15px] font-semibold">
                What the agent did
              </h2>
              {process.env.HEDERA_SPEND_TOPIC_ID ? (
                <ProofLink
                  kind="hedera"
                  href={`https://hashscan.io/testnet/topic/${process.env.HEDERA_SPEND_TOPIC_ID}`}
                  label="Spend log on Hedera"
                />
              ) : null}
            </div>
            <Suspense fallback={<Skeleton className="mt-3 h-48 w-full" />}>
              <Feed />
            </Suspense>
          </section>
          <section className="rounded-[20px] border bg-card p-5" aria-labelledby="clips">
            <h2 id="clips" className="text-[15px] font-semibold">
              Clips received
            </h2>
            <Suspense fallback={<Skeleton className="mt-3 h-32 w-full" />}>
              <Clips />
            </Suspense>
          </section>
        </div>
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

const ACTION: Record<string, { label: string; dot: string }> = {
  paid: { label: "Paid", dot: "bg-success" },
  needs_human: { label: "Asked you to approve", dot: "bg-warning" },
  approved: { label: "You approved", dot: "bg-success" },
  declined: { label: "Not paid", dot: "bg-danger" },
  skipped: { label: "Skipped", dot: "bg-foreground/40" },
  failed: { label: "Payment didn't go through", dot: "bg-danger" },
  task_posted: { label: "Posted a task", dot: "bg-signal" },
}

async function Feed() {
  const feed = await agentFeed().catch(() => null)
  if (!feed)
    return <p className="mt-3 text-[14px] text-muted-foreground">Couldn't load the feed right now.</p>
  if (!feed.length)
    return (
      <p className="mt-3 text-[14px] text-muted-foreground">
        Nothing yet. The agent acts as soon as a clip is accepted.
      </p>
    )
  return (
    <ol className="mt-3">
      {feed.map((e) => {
        const a = ACTION[e.action] ?? { label: e.action, dot: "bg-foreground/40" }
        return (
          <li key={e.id} className="flex items-start gap-3 border-t py-3 first:border-t-0">
            <span className="w-11 shrink-0 pt-0.5 font-mono text-[12px] text-muted-foreground tabular">
              {e.time}
            </span>
            <span className={`mt-2 size-2 shrink-0 rounded-full ${a.dot}`} aria-hidden="true" />
            <div className="min-w-0 flex-1 text-[14.5px]">
              <span className="font-medium">{a.label}</span>
              {e.amount ? <span className="font-mono tabular"> {e.amount} USDC</span> : null}
              {e.note ? (
                <p className="text-[13.5px] text-muted-foreground">{e.note}</p>
              ) : e.reason ? (
                <p className="text-[13.5px] text-muted-foreground">{e.reason}</p>
              ) : null}
              {e.tx ? (
                <div className="mt-1.5">
                  <ProofLink kind="hedera" href={links.hashscanTx(e.tx)} />
                </div>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

async function Approvals() {
  const list = await pendingApprovals().catch(() => [])
  if (!list.length) return null
  return (
    <>
      {list.map((a) => (
        <section
          key={a.id}
          className="rounded-[20px] border-2 border-warning/60 bg-card p-5"
          aria-label="Approval waiting"
        >
          <div className="text-[13px] font-medium text-warning">Waiting for you</div>
          <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">Approve {a.amount} USDC?</h2>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Above the agent's limit. Scan with your phone and confirm with World ID. Nothing is paid unless
            you approve.
          </p>
          <div className="mt-4 flex items-center gap-4">
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG generated server-side from a World URL we validated */}
            <div
              className="size-[140px] shrink-0 rounded-xl bg-white p-1.5"
              dangerouslySetInnerHTML={{ __html: a.qrSvg }}
            />
            <div className="min-w-0 text-[13px]">
              <div className="text-muted-foreground">Code</div>
              <div className="font-mono text-[16px] tabular">{a.userCode}</div>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-medium underline underline-offset-4"
              >
                Open on this device
              </a>
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
