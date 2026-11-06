// Real data for the buyer console. Display-safe fields only.
import "server-only"
import { db, desc, jobs } from "@adx/db"
import { connection } from "next/server"

export async function recentClips(limit = 15) {
  await connection()
  const rows = await db()
    .select({ id: jobs.id, status: jobs.status, bytes: jobs.bytes, createdAt: jobs.createdAt })
    .from(jobs)
    .orderBy(desc(jobs.createdAt))
    .limit(limit)
  return rows.map((r) => ({
    id: r.id,
    status: r.status,
    bytes: r.bytes,
    time: r.createdAt.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }),
  }))
}
