"use client"

// The claim journey on one button: wallet (first time: one tap) → World ID → slot saved on Arkiv →
// challenge card. Every step says what's happening in plain words; nothing is taken if a step fails.
import type { ApiError, ClaimResponse } from "@adx/shared/claim"
import { claimMessage, claimSignal } from "@adx/shared/claim"
import type { IDKitResult, RpContext } from "@worldcoin/idkit"
import { deviceLegacy, selfieCheck } from "@worldcoin/idkit"
import { Loader2, ShieldCheck, Video } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { readClaims, saveClaim } from "@/lib/claims-local"
import { ensureAccount } from "@/lib/wallet/use-wallet"
import { ChallengeCard } from "./challenge-card"

const IDKitRequestWidget = dynamic(() => import("@worldcoin/idkit").then((m) => m.IDKitRequestWidget), {
  ssr: false,
})

type Phase =
  | { kind: "idle" }
  | { kind: "wallet" }
  | {
      kind: "world"
      rp: RpContext
      appId: `app_${string}`
      action: string
      env: "production" | "staging"
      wallet: `0x${string}`
    }
  | { kind: "saving" }
  | { kind: "done"; claim: ClaimResponse }

const PRESET = process.env.NEXT_PUBLIC_WORLD_PRESET === "device" ? "device" : "selfie"

export function ClaimFlow({ taskKey, title }: { taskKey: `0x${string}`; title: string }) {
  const [phase, setPhase] = useState<Phase>({ kind: "idle" })
  const [open, setOpen] = useState(false)
  const settled = useRef(false)

  // Already holding a slot on this phone? Go straight to the challenge.
  useEffect(() => {
    const mine = readClaims().find((c) => c.taskKey.toLowerCase() === taskKey.toLowerCase())
    if (mine) setPhase({ kind: "done", claim: mine })
  }, [taskKey])

  async function start() {
    settled.current = false
    try {
      setPhase({ kind: "wallet" })
      const account = await ensureAccount()
      const r = await fetch("/api/world/rp-signature", { method: "POST" })
      const j = (await r.json()) as
        | {
            app_id: `app_${string}`
            action: string
            environment: "production" | "staging"
            rp_context: RpContext
          }
        | ApiError
      if (!r.ok || "error" in j) throw new Error("error" in j ? j.error.message : "World ID isn't available")
      setPhase({
        kind: "world",
        rp: j.rp_context,
        appId: j.app_id,
        action: j.action,
        env: j.environment,
        wallet: account.address,
      })
      setOpen(true)
    } catch (e) {
      setPhase({ kind: "idle" })
      toast.error((e as Error).message || "Couldn't start. Try again.")
    }
  }

  // Runs inside the World ID sheet: the sheet shows success only after our server accepted the claim.
  async function verifyOnServer(result: IDKitResult) {
    if (phase.kind !== "world") throw new Error("not ready")
    const account = await ensureAccount()
    const signature = await account.signMessage({
      message: claimMessage(taskKey, account.address, result.nonce),
    })
    setPhase({ kind: "saving" })
    const r = await fetch("/api/claims", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ taskKey, wallet: account.address, signature, idkit: result }),
    })
    const j = (await r.json()) as ClaimResponse | ApiError
    if (!r.ok || "error" in j) {
      const message = "error" in j ? j.error.message : "Couldn't save your slot"
      settled.current = true
      setPhase({ kind: "idle" })
      toast.error(message)
      throw new Error(message)
    }
    saveClaim({ ...j, title, savedAt: Date.now() })
    settled.current = true
    setPhase({ kind: "done", claim: j })
    if (j.resumed) toast("You already hold a slot on this task. Here's your challenge again.")
  }

  if (phase.kind === "done") {
    const c = phase.claim
    return (
      <div className="space-y-4">
        <div>
          <div className="text-[13px] text-success">Your slot is saved</div>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Do this on camera while you fold. You have 2 hours to record.
          </p>
        </div>
        <ChallengeCard word={c.challenge.word} fingers={c.challenge.fingers} />
        <Button asChild variant="signal" size="xl" className="w-full">
          <Link href={`/record/${c.claimKey}`}>
            <Video />
            Start recording
          </Link>
        </Button>
      </div>
    )
  }

  const busy = phase.kind === "wallet" || phase.kind === "saving" || phase.kind === "world"
  const label =
    phase.kind === "wallet"
      ? "Opening your wallet…"
      : phase.kind === "world"
        ? "Waiting for World ID…"
        : phase.kind === "saving"
          ? "Saving your slot on Arkiv…"
          : "Claim with World ID"

  return (
    <>
      <Button
        variant="signal"
        size="xl"
        className="w-full"
        onClick={start}
        disabled={busy}
        aria-live="polite"
      >
        {busy ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
        {label}
      </Button>
      {phase.kind === "saving" ? (
        <p className="mt-2 text-center text-[13px] text-muted-foreground">
          Writing to Arkiv takes about 7 seconds.
        </p>
      ) : null}
      {phase.kind === "world" ? (
        <IDKitRequestWidget
          open={open}
          onOpenChange={(o) => {
            setOpen(o)
            if (!o && !settled.current) {
              setPhase({ kind: "idle" })
              toast("World ID was closed. No slot was taken.")
            }
          }}
          app_id={phase.appId}
          action={phase.action}
          rp_context={phase.rp}
          environment={phase.env}
          allow_legacy_proofs={PRESET === "device"}
          preset={
            PRESET === "device"
              ? deviceLegacy({ signal: claimSignal(taskKey, phase.wallet) })
              : selfieCheck({ signal: claimSignal(taskKey, phase.wallet) })
          }
          handleVerify={verifyOnServer}
          onSuccess={() => setOpen(false)}
          onError={(code) => {
            if (settled.current) return
            setPhase({ kind: "idle" })
            toast(
              code === "user_rejected"
                ? "You cancelled World ID. No slot was taken."
                : "World ID didn't finish. No slot was taken.",
            )
          }}
        />
      ) : null}
    </>
  )
}
