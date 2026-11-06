// Typed sample data for screens whose real source lands in a later phase (P4–P7).
// Every screen using these shows <DemoBadge />. Each export names the phase that replaces it.
import type { PipelineEvent, VerdictSummary } from "@adx/shared/events"

/** Replaced in P4 by Neon `events` over SSE. */
export const DEMO_EVENTS: PipelineEvent[] = [
  { id: 1, step: "received", ok: true, ms: 0, at: "2026-11-06T16:20:00Z" },
  { id: 2, step: "probe", ok: true, ms: 180, at: "2026-11-06T16:20:00Z" },
  { id: 3, step: "fingerprint", ok: true, ms: 290, at: "2026-11-06T16:20:01Z" },
  { id: 4, step: "dedup", ok: true, ms: 610, at: "2026-11-06T16:20:01Z" },
  {
    id: 5,
    step: "verdict",
    ok: true,
    ms: 7400,
    at: "2026-11-06T16:20:08Z",
    data: { verdict: "accept", score: 88 },
  },
  { id: 6, step: "encrypt", ok: true, ms: 90, at: "2026-11-06T16:20:08Z" },
  { id: 7, step: "store", ok: true, ms: 3100, at: "2026-11-06T16:20:11Z" },
]

/** Replaced in P4 by the verifier's `adx.verification` evidence. */
export const DEMO_VERDICT: VerdictSummary = {
  verdict: "accept",
  score: 88,
  reason: "Every step is visible, in order, and the challenge matches.",
  liveness: { word: "mango", wordHeard: "mango", fingers: 3, fingersShown: 3 },
  steps: [
    {
      name: "grasp_corners",
      label: "Grab two corners",
      status: "done",
      t: "00:03",
      evidence: "Both hands pinch the two near corners",
    },
    {
      name: "first_fold",
      label: "Fold in half",
      status: "done",
      t: "00:07",
      evidence: "Corners carried to the far edge, towel halved",
    },
    {
      name: "second_fold",
      label: "Fold again",
      status: "done",
      t: "00:13",
      evidence: "Strip folded across its length",
    },
    {
      name: "flatten",
      label: "Smooth it flat",
      status: "done",
      t: "00:18",
      evidence: "Right palm sweeps across the folded towel",
    },
  ],
}

/** Replaced in P6/P7 by Arkiv licences ownedBy(wallet) + Mirror Node. */
export const DEMO_ME = {
  earnedUsdc: "6.00",
  licences: [
    {
      key: "0x7c2e…91ab",
      task: "Fold a towel, filmed from above",
      paid: "3.00",
      daysLeft: 88,
      status: "granted",
    },
    { key: "0x1f40…0c3d", task: "Open a jar lid, front view", paid: "3.00", daysLeft: 61, status: "granted" },
  ],
}

/** Replaced in P6 by the agent status API + HCS via Mirror Node. */
export const DEMO_CONSOLE = {
  policy: { perClip: "5", daily: "20", spentToday: "6", threshold: "5", allowlist: 1 },
  feed: [
    {
      at: "16:24",
      kind: "paid",
      text: "Paid 3 USDC for a towel clip",
      ref: "0.0.9185802@1793933035.147018991",
    },
    { at: "16:23", kind: "verdict", text: "Clip accepted, score 88" },
    { at: "16:20", kind: "verdict", text: "Clip rejected: the word heard was not the challenge" },
    { at: "16:02", kind: "task", text: "Posted “Fold a towel, filmed from above”, 3 slots" },
  ],
  approvals: [
    {
      id: "a1",
      amount: "8",
      what: "Bonus for a rare jar-opening clip",
      expiresInMin: 17,
      userCode: "WXYZ-1234",
    },
  ],
}
