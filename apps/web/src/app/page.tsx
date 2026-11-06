import Link from "next/link"
import { Suspense } from "react"
import { TaskCard } from "@/components/tasks/task-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getCounts, getOpenTasks } from "@/lib/data"

const LOOP = [
  {
    who: "Robot team's agent",
    what: "posts the move its robot keeps getting wrong, with a reward and a few slots",
  },
  { who: "You", what: "prove you're a unique human with World ID and take one slot" },
  { who: "You", what: "film 15–30 seconds on your phone, saying a word and showing fingers so it's live" },
  { who: "AI verifier", what: "watches the clip and points to the second each step happens" },
  { who: "Swarm", what: "stores the clip encrypted, so nobody sees it before paying" },
  { who: "Agent", what: "pays you in USDC on Hedera, automatically under its budget" },
  { who: "You", what: "own the licence on Arkiv, held by your own wallet" },
]

export default function Home() {
  return (
    <div className="mx-auto max-w-[1120px] px-5">
      <section className="grid grid-cols-1 items-end gap-10 pt-12 pb-14 md:grid-cols-[1.1fr_1fr] md:pt-20">
        <div>
          <h1 className="max-w-[14ch] text-[44px] leading-[1.0] font-semibold tracking-[-0.04em] text-balance md:text-[64px]">
            Robots learn from your hands.
          </h1>
          <p className="mt-5 max-w-[46ch] text-[17px] text-muted-foreground text-pretty">
            Robot teams post the exact moves their robots fail at. Film one on your phone, get paid in USDC
            when it's accepted, and keep the licence to your clip.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild variant="signal" size="xl">
              <Link href="/tasks">See open tasks</Link>
            </Button>
            <Button asChild variant="ghost" size="xl" className="text-muted-foreground">
              <Link href="/explorer">Check the records</Link>
            </Button>
          </div>
        </div>
        <div>
          <p className="mb-3 text-[13px] text-muted-foreground">Open right now, read from Arkiv</p>
          <Suspense fallback={<Skeleton className="h-[164px] w-full rounded-[18px]" />}>
            <LiveTask />
          </Suspense>
        </div>
      </section>

      <Suspense fallback={<div className="h-12" />}>
        <Ledger />
      </Suspense>

      <section className="py-14">
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">How one clip moves</h2>
        <ol className="mt-6 grid gap-x-10 md:grid-cols-2">
          {LOOP.map((step, i) => (
            <li key={step.what} className="flex gap-4 border-t py-4">
              <span className="w-6 shrink-0 pt-0.5 font-mono text-[13px] text-muted-foreground tabular">
                {i + 1}
              </span>
              <p className="text-[15px] text-pretty">
                <span className="font-medium">{step.who}</span>{" "}
                <span className="text-muted-foreground">{step.what}</span>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid grid-cols-1 gap-8 border-t py-12 md:grid-cols-3">
        <Principle title="One person, one slot">
          World ID proves you're a unique human without telling us who you are. A dataset of 100 clips really
          has 100 people in it.
        </Principle>
        <Principle title="You own the licence">
          Your licence is a record on Arkiv owned by your wallet, not a row in our database. Nobody else can
          change it.
        </Principle>
        <Principle title="Spending a prompt can't bypass">
          Agents pay only within a fixed budget. Anything bigger waits for a human to approve it with World
          ID.
        </Principle>
      </section>
    </div>
  )
}

function Principle({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[16px] font-semibold">{title}</h3>
      <p className="mt-2 text-[15px] text-muted-foreground text-pretty">{children}</p>
    </div>
  )
}

async function LiveTask() {
  const res = await getOpenTasks()
  const task = res.ok ? res.data[0] : undefined
  if (!task) {
    return (
      <div className="rounded-[18px] border border-dashed p-6 text-[15px] text-muted-foreground">
        {res.ok ? "No open tasks this minute. New ones appear as robots find gaps." : "Syncing with Arkiv…"}
      </div>
    )
  }
  return <TaskCard task={task} />
}

async function Ledger() {
  const res = await getCounts()
  if (!res.ok) return null
  const c = res.data
  const items = [
    [c.openTasks, c.openTasks === 1 ? "open task" : "open tasks"],
    [c.claims, c.claims === 1 ? "slot claimed" : "slots claimed"],
    [c.verifications, c.verifications === 1 ? "clip checked" : "clips checked"],
    [c.receipts, c.receipts === 1 ? "payment settled" : "payments settled"],
    [c.licences, c.licences === 1 ? "licence issued" : "licences issued"],
  ] as const
  return (
    <section
      aria-label="Live totals from Arkiv"
      className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y py-4"
    >
      {items.map(([n, label]) => (
        <span key={label} className="text-[15px]">
          <span className="font-mono font-medium tabular">{n}</span>{" "}
          <span className="text-muted-foreground">{label}</span>
        </span>
      ))}
      <Link
        href="/explorer?q=counts"
        className="ml-auto inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[12.5px] font-medium text-foreground/80 hover:border-foreground/30"
      >
        <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
        Counted on Arkiv
      </Link>
    </section>
  )
}
