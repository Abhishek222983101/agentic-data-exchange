// Every agent decision goes two places: the console feed (Neon events, scope "agent") and the public spend
// log on Hedera Consensus Service. Claude Haiku writes a one-line plain explanation; it never decides.

import type { dbPool } from "@adx/db"
import { events } from "@adx/db"
import { operatorClient } from "@adx/shared/hedera"
import { TopicMessageSubmitTransaction } from "@hiero-ledger/sdk"

type DB = ReturnType<typeof dbPool>
export type AgentAction =
  | "paid"
  | "needs_human"
  | "approved"
  | "declined"
  | "skipped"
  | "failed"
  | "task_posted"
  | "heartbeat"

async function explain(action: AgentAction, facts: Record<string, unknown>): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key || action === "heartbeat") return null
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: process.env.AGENT_MODEL ?? "claude-haiku-5-5",
        max_tokens: 60,
        system:
          "You are the buyer agent for a robot team. In one short plain sentence (max 18 words), tell your human what you just did and why. No jargon, no emojis, don't invent numbers.",
        messages: [{ role: "user", content: JSON.stringify({ action, ...facts }) }],
      }),
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null
    const j = (await res.json()) as { content?: Array<{ text?: string }> }
    return j.content?.[0]?.text?.trim().slice(0, 200) ?? null
  } catch {
    return null
  }
}

export async function record(db: DB, action: AgentAction, facts: Record<string, unknown>) {
  const note = await explain(action, facts)
  let hcsTx: string | undefined
  const topic = process.env.HEDERA_SPEND_TOPIC_ID
  if (topic && action !== "heartbeat") {
    try {
      const c = operatorClient()
      const msg = JSON.stringify({ v: 1, t: new Date().toISOString(), action, ...facts })
      const r = await new TopicMessageSubmitTransaction()
        .setTopicId(topic)
        .setMessage(msg.slice(0, 1000))
        .execute(c)
      await r.getReceipt(c)
      hcsTx = r.transactionId.toString()
    } catch (e) {
      console.error("[hcs]", (e as Error).message)
    }
  }
  await db.insert(events).values({
    scope: "agent",
    step: action,
    ok: action !== "failed" && action !== "declined",
    data: { ...facts, note, hcsTx },
  })
  console.log(JSON.stringify({ evt: action, ...facts, hcsTx }))
}
