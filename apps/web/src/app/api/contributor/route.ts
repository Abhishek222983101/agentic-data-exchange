// GET /api/contributor?wallet=0x… → the contributor's Hedera account (public info, also on the Mirror Node).
import { contributors, db, eq } from "@adx/db"
import { NextResponse } from "next/server"
import { clientIp, fail, handle, rateLimit } from "@/lib/server/api"

export const GET = handle(async (req) => {
  await rateLimit("contributor", clientIp(req), 60, 60)
  const wallet = new URL(req.url).searchParams.get("wallet") ?? ""
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) fail(400, "invalid", "wallet must be an address")
  const [row] = await db()
    .select({ hederaAccount: contributors.hederaAccount })
    .from(contributors)
    .where(eq(contributors.wallet, wallet.toLowerCase()))
    .limit(1)
  return NextResponse.json(
    { hederaAccount: row?.hederaAccount ?? null },
    { headers: { "cache-control": "no-store" } },
  )
})
