// Paradigm worker: upload server now (P3); the verification pipeline joins in P4.

import { dbPool } from "@adx/db"
import { loadEnv, workerEnvSchema } from "@adx/shared/env"
import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { bodyLimit } from "hono/body-limit"
import { cors } from "hono/cors"
import { secureHeaders } from "hono/secure-headers"
import { startRunner } from "./pipeline/runner"
import { MAX_BYTES, uploadHandler } from "./upload"

const env = loadEnv("worker", workerEnvSchema)
const db = dbPool(5)
const origins = env.WEB_ORIGIN.split(",").map((s) => s.trim())

const app = new Hono()
app.use("*", secureHeaders())
app.use(
  "/upload",
  cors({
    origin: (o) => (origins.includes(o) ? o : null),
    allowMethods: ["PUT", "OPTIONS"],
    allowHeaders: ["authorization", "content-type"],
    maxAge: 600,
  }),
)

app.put(
  "/upload",
  bodyLimit({
    maxSize: MAX_BYTES,
    onError: (c) => {
      c.header("connection", "close")
      return c.json({ error: { code: "too_large", message: "This clip is over 60 MB." } }, 413)
    },
  }),
  uploadHandler({ db, secret: env.UPLOAD_TOKEN_SECRET, clipDir: env.CLIP_DIR }),
)

/** Health, including whether our Bee node is up and our postage batch is usable (P4.0 spike). */
app.get("/health", async (c) => {
  const probe = async (path: string) => {
    try {
      const r = await fetch(`${env.BEE_URL}${path}`, { signal: AbortSignal.timeout(3000) })
      return r.ok ? ((await r.json()) as Record<string, unknown>) : { status: r.status }
    } catch {
      return null
    }
  }
  const [bee, stamp] = await Promise.all([probe("/health"), probe(`/stamps/${env.SWARM_BATCH_ID}`)])
  return c.json({
    ok: true,
    bee: bee ? String(bee.status ?? "up") : "unreachable",
    beeVersion: bee?.version ?? null,
    batchUsable: stamp ? Boolean(stamp.usable) : null,
    batchTtlS: stamp?.batchTTL ?? null,
  })
})

app.notFound((c) => c.json({ error: { code: "not_found", message: "Not found" } }, 404))
app.onError((e, c) => {
  console.error("[worker]", e)
  return c.json({ error: { code: "internal", message: "Worker error" } }, 500)
})

serve({ fetch: app.fetch, port: env.PORT, hostname: "::" }, (i) =>
  console.log(`worker listening on ${i.port}`),
)
