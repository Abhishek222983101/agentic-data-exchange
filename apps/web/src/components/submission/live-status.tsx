"use client"

// The real status of one clip: polls /api/submissions/:id every 2.5 s until a final verdict arrives.
// Shows only what actually happened. No sample data.
import { links, shortHex } from "@adx/shared"
import type { PipelineEvent, VerdictSummary } from "@adx/shared/events"
import { Hand, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { ProofLink } from "@/components/proof/proof-link"
import { PipelineSteps } from "./pipeline-steps"
import { VerdictCard } from "./verdict-card"

type View = {
  id: string
  status: string
  bytes: number | null
  receivedAt: string
  challenge: { word: string; fingers: number } | null
  events: PipelineEvent[]
  payment: {
    status: string
    amount: string
    hederaTx: string | null
    receiptKey: string | null
    licenceKey: string | null
    payTo: string
  } | null
}

export function LiveStatus({ id, initial }: { id: string; initial: View }) {
  const [view, setView] = useState<View>(initial)
  const checked = view.events.some((e) => e.step === "done") || view.status === "failed"
  const payFinal =
    view.payment &&
    (view.payment.status === "declined" || (view.payment.status === "settled" && view.payment.licenceKey))
  // After an accept, keep watching until the agent has paid (or a human declined).
  const done = checked && (view.status !== "accepted" || Boolean(payFinal))

  useEffect(() => {
    if (done) return
    const t = setInterval(async () => {
      const r = await fetch(`/api/submissions/${id}`, { cache: "no-store" }).catch(() => null)
      if (r?.ok) setView((await r.json()) as View)
    }, 2500)
    return () => clearInterval(t)
  }, [id, done])

  const started = view.events.some((e) => e.step !== "received")
  const summary = view.events.find((e) => e.step === "verdict" && e.data?.summary)?.data?.summary as
    | VerdictSummary
    | undefined
  const failure = [...view.events].reverse().find((e) => !e.ok && e.data?.reason)?.data?.reason
  const swarmRef = view.events.find((e) => e.step === "store")?.data?.swarmRef
  const pub = view.events.find((e) => e.step === "publish")?.data
  const duplicateOf = view.events.find((e) => e.data?.duplicateOf)?.data?.duplicateOf
  return (
    <div className="space-y-5">
      {view.challenge ? (
        <div className="flex items-center gap-3 rounded-[18px] border bg-card p-4 text-[14px]">
          <span className="text-muted-foreground">Your challenge was</span>
          <span className="rounded-full bg-signal px-3 py-1 font-semibold text-signal-ink">
            “{view.challenge.word}”
          </span>
          <span className="flex items-center gap-1 rounded-full bg-foreground px-3 py-1 font-semibold text-background">
            {view.challenge.fingers} <Hand className="size-3.5" aria-label="fingers" />
          </span>
        </div>
      ) : null}

      {view.payment?.status === "settled" ? (
        <section className="rounded-[20px] bg-success p-5 text-white" aria-live="polite">
          <div className="text-[13px] opacity-90">Paid to you</div>
          <div className="mt-1 font-mono text-[36px] leading-none font-semibold tabular">
            +{Number(view.payment.amount)} USDC
          </div>
          <p className="mt-2 text-[14px] opacity-90">
            The robot team's agent bought your clip. Its licence is now owned by your wallet on Arkiv.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 [&_a]:border-white/40 [&_a]:text-white">
            {view.payment.hederaTx ? (
              <ProofLink
                kind="hedera"
                href={links.hashscanTx(view.payment.hederaTx)}
                label="Payment on Hedera"
              />
            ) : null}
            {view.payment.licenceKey ? (
              <ProofLink
                kind="arkiv"
                href={links.arkivEntity(view.payment.licenceKey)}
                label="Your licence on Arkiv"
              />
            ) : null}
            {view.payment.receiptKey ? (
              <ProofLink
                kind="arkiv"
                href={links.arkivEntity(view.payment.receiptKey)}
                label="Receipt on Arkiv"
              />
            ) : null}
          </div>
        </section>
      ) : view.status === "accepted" && checked && view.payment?.status !== "declined" ? (
        <div role="status" className="flex items-center gap-3 rounded-[18px] bg-sunken p-4 text-[14px]">
          <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
          The robot team's agent is paying for your clip…
        </div>
      ) : null}
      {summary ? <VerdictCard v={summary} /> : null}
      {!summary && done && failure ? (
        <section className="rounded-[20px] border-2 border-danger/40 bg-card p-5">
          <h2 className="text-[20px] font-semibold text-danger">
            {view.status === "duplicate"
              ? "This clip was already submitted"
              : view.status === "failed"
                ? "The check couldn't finish"
                : "Not accepted"}
          </h2>
          <p className="mt-1 text-[15px] text-muted-foreground">{failure}</p>
          {duplicateOf ? (
            <div className="mt-3">
              <ProofLink
                kind="arkiv"
                href={links.arkivEntity(duplicateOf)}
                label={`Matches ${shortHex(duplicateOf)}`}
              />
            </div>
          ) : null}
        </section>
      ) : null}
      {pub?.verificationKey || swarmRef ? (
        <div className="flex flex-wrap gap-2">
          {pub?.verificationKey ? (
            <ProofLink kind="arkiv" href={links.arkivEntity(pub.verificationKey)} label="Verdict on Arkiv" />
          ) : null}
          {pub?.submissionKey ? (
            <ProofLink kind="arkiv" href={links.arkivEntity(pub.submissionKey)} label="Submission on Arkiv" />
          ) : null}
          {swarmRef ? (
            <ProofLink
              kind="swarm"
              href={links.swarmTestnet(swarmRef)}
              label="Encrypted clip on Swarm (testnet)"
            />
          ) : null}
        </div>
      ) : null}

      <section aria-label="Checks" className="rounded-[20px] border bg-card p-5">
        <PipelineSteps events={view.events} />
      </section>

      {!started && !done ? (
        <div role="status" className="flex items-start gap-3 rounded-[18px] bg-sunken p-4 text-[14px]">
          <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin text-muted-foreground" />
          <p className="text-pretty">
            Your clip is safely received
            {view.bytes ? ` (${(view.bytes / 1e6).toFixed(1)} MB)` : ""} and waiting for the automatic check.
            This page updates by itself; you can leave and come back.
          </p>
        </div>
      ) : null}
    </div>
  )
}
