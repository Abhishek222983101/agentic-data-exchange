// Public view of one submission for its status page. Only display-safe fields: no wallet, no nullifier,
// no file path, no keys. The id is a random UUID the uploader received.
import "server-only"
import { asc, claimsPrivate, db, eq, events, jobs } from "@adx/db"
import { decodeChallenge } from "@adx/shared/challenge"
import type { PipelineEvent } from "@adx/shared/events"

export type SubmissionView = {
  id: string
  taskKey: string
  status: string
  bytes: number | null
  receivedAt: string
  challenge: { word: string; fingers: number } | null
  events: PipelineEvent[]
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const isSubmissionId = (s: string) => UUID.test(s)

export async function submissionView(id: string): Promise<SubmissionView | null> {
  if (!isSubmissionId(id)) return null
  const d = db()
  const [job] = await d
    .select({
      id: jobs.id,
      taskKey: jobs.taskKey,
      claimKey: jobs.claimKey,
      status: jobs.status,
      bytes: jobs.bytes,
      createdAt: jobs.createdAt,
    })
    .from(jobs)
    .where(eq(jobs.id, id))
    .limit(1)
  if (!job) return null
  const [claim] = await d
    .select({ challenge: claimsPrivate.challenge })
    .from(claimsPrivate)
    .where(eq(claimsPrivate.claimKey, job.claimKey))
    .limit(1)
  const evs = await d
    .select()
    .from(events)
    .where(eq(events.scope, `submission:${id}`))
    .orderBy(asc(events.id))
    .limit(50)
  return {
    id: job.id,
    taskKey: job.taskKey,
    status: job.status,
    bytes: job.bytes,
    receivedAt: job.createdAt.toISOString(),
    challenge: claim?.challenge ? decodeChallenge(claim.challenge) : null,
    events: evs.map((e) => ({
      id: e.id,
      step: e.step as PipelineEvent["step"],
      ok: e.ok,
      ms: e.ms,
      at: e.createdAt.toISOString(),
      data: (e.data ?? undefined) as PipelineEvent["data"],
    })),
  }
}
