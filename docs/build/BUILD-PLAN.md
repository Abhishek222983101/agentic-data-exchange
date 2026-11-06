# ADX — Build plan (tracker)

> The full phase-by-phase plan with sub-phases and technical detail is §19 of `SYSTEM-ARCHITECTURE.md`. This file is the live checklist.

Deadline: **Sat 7 Nov 09:00 IST** (no late entries). Feature freeze Fri 23:00. Video recorded by Sat 05:00.

## Order of work
| # | Block | Window (IST) | Done when |
|---|---|---|---|
| 0 | Proofs: Arkiv write, x402 settle, Swarm upload, Bee node + batch | Fri 07:00–10:00 | ✅ done (see PROOFS.md) |
| 1 | `packages/shared`: Arkiv schemas, write guard, signer queues, env validation | Fri 10:30–12:00 | Schemas compile; guard unit tests pass; seed script writes the verifier listing |
| 1b | **P-UI (added 6 Nov, frontend first):** every screen from `reference/03-APP-FLOW.md` in the final design, real Arkiv data where it exists, typed data adapters with sample fixtures (visible "demo data" badge) elsewhere; later phases swap each adapter for the real call | Fri after P1 | Whole app clickable on a phone |
| 2 | Contributor flow in `apps/web`: task board (Arkiv read), claim with IDKit, recorder, presigned upload | Fri 12:00–15:00 | A phone claims, records and uploads; duplicate claim rejected |
| 3 | `apps/worker` on Railway: frames, dHash, Arkiv dedup, Claude/Gemini verdict, encrypt → our Bee node, Arkiv writes | Fri 13:00–16:30 | Uploaded clip ends with `adx.submission` + `adx.verification` and a Swarm ref |
| 4 | Payments: x402 endpoint + after-settle hook, per-request payTo test, licence create + transfer | Fri 16:00–18:30 | Agent pays, receipt + licence on Arkiv, key released |
| 5 | `apps/agent`: post tasks, watch verdicts, policy, pay, Agent Pass device flow, HCS spend log | Fri 17:00–20:30 | Auto pay, approved pay and denied pay all work end to end |
| 6 | Licences + withdrawal, outside-agent script, buyer console feed | Fri 20:00–22:30 | Withdrawal drops the clip; outside script matches the UI |
| 7 | Feature freeze, UI polish, 16-clip eval | Fri 23:00–Sat 02:00 | Accuracy numbers measured |
| 8 | Sponsor docs: `/arkiv/*.md`, README (tx IDs, wallets, query), World debrief, AI_USAGE, screenshots | Sat 01:00–04:00 | Every checklist row below ticked |
| 9 | Record video, submit | Sat 04:00–07:00 | Submitted with 2 h margin |

## Phase gates (P0–P3)
Every phase ends with `pnpm verify` (typecheck + lint + unit tests + production build) green, a security pass, then one push to `main`.

| Sub-phase | Acceptance (actually run) | Status |
|---|---|---|
| P0.1 Workspace + tooling | `pnpm typecheck` + `pnpm lint` pass across workspace | Passed (6 Nov 15:40) |
| P0.2 Env validation + doctor | `pnpm run doctor` green table | Passed: 14/14 live checks |
| P0.3 Database | 9 tables in Neon | Passed (`drizzle-kit push`) |
| P0.4 Tokens + shell | shell in light + dark at 393 px, all nav routes 200 | Passed (screenshots) |
| P1.1 Schemas + clients | create + read each of 8 schemas on Rabdi (`adx-test`) | Passed (`pnpm arkiv:roundtrip`) |
| P1.2 Write guard | 13 guard unit tests; 64-hex title refused live | Passed |
| P1.3 Signer queue | 10 parallel creates on one signer, no nonce errors | Passed (10/10, 65 s) |
| P1.4 Queries + seed | `pnpm seed:arkiv` prints keys + links | Passed (ARK-03) |
| P-UI All screens | every route 200, sample regions badged, real data where it exists | Passed (local prod build, screenshots) |
| P1.5 First reads | `/tasks` shows the seeded task; `/explorer` returns the same key | Passed locally; live URL needs Vercel env (`scripts/vercel-env.sh`) |

## Acceptance checklist
Status: **Not run** · **Passed** · **Failed**. Only mark Passed after actually running it.

| ID | Check | Status |
|---|---|---|
| A1 | Task board reads open tasks from Arkiv (owner-filtered) | Passed (local prod build) |
| A2 | Claim with World ID succeeds; nullifier stored privately | Not run |
| A3 | Second claim by the same human rejected | Not run |
| A4 | Cancelled World ID verification takes no slot | Not run |
| A5 | Upload from iPhone Safari (≥18 s) and Android Chrome | Not run |
| A6 | Duplicate clip rejected across buyers | Not run |
| A7 | Verdict with timestamped evidence written to Arkiv by the verifier wallet | Not run |
| A8 | Clip stored on Swarm through our Bee node with batch `c0cc5436…` | Not run |
| A9 | Agent pays over x402 under threshold with no human; HashScan link | Passed (smoke test, HED-02) |
| A10 | Payment above threshold waits for Agent Pass; approved → paid | Not run |
| A11 | Agent Pass denied / expired → nothing paid | Not run |
| A12 | Receipt written only after settlement | Not run |
| A13 | Licence owned by the contributor; withdrawal drops the clip | Not run |
| A14 | Outside-agent script shows the same state as the UI | Not run |
| A15 | Arkiv reset recovery via `pnpm seed:arkiv` | Not run |
| A16 | Verifier accuracy measured on 16 clips | Not run |

## Sponsor deliverables
| Sponsor | Deliverable | Status |
|---|---|---|
| ETHGlobal | Public repo, steady commits, `AI_USAGE.md`, planning docs in repo, 2–4 min video | In progress |
| Hedera | README: setup, architecture, payment flow, settled tx ID; video with HashScan link | Tx ID ready |
| Arkiv | README writer wallets + runnable query; `/arkiv/schema.md`, `friction.md`, `reach.md`, `why-arkiv.md`, `how-you-use-arkiv.md` | schema drafted |
| Swarm bonus | `/arkiv/swarm.md`: what's where, entity key ↔ Swarm ref link, batch ID + buyer wallet, Bee node, files, steps, demo timestamp, friction | Batch + node ready |
| World | Agent Pass journey + denied path; IDKit success + alternative path; integration debrief | Apps registered |
