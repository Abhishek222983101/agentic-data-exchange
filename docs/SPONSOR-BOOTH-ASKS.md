# Team Paradigm — asks for sponsor booths (ETHGlobal Mumbai 2026)

**Project:** Agentic Data Exchange (ADX). AI buyer agents post paid real-world data tasks (short video demonstrations for robot training). Verified humans film them, AI verifies each clip, and USDC settles over x402 on Hedera. Every task, claim, verdict, receipt and licence is an open Arkiv entity with an owner and an expiry. Clips are encrypted on our side and stored on Swarm.

- Live app: https://adx-paradigm.vercel.app
- Repo (public, MIT): https://github.com/Abhishek222983101/agentic-data-exchange

Everything on this page is public. No keys or secrets are shared here.

---

## 1. Arkiv / Swarm booth

### What we already have working
| | |
|---|---|
| Arkiv writer wallet | `0x4aEC505abaFc1EC58A38529e29A1164314deC3f7` |
| First Arkiv write (Rabdi) | tx `0x159e18177011c03c1f0d8d5c97283ff4086770c09679154afa322f7b97ca25b3` |
| SDK | `@arkiv-network/sdk` 1.0.1, Arkiv Claude plugin 0.5.4 |
| Swarm upload path | Client-side AES-256-GCM encryption, then `POST /bytes` of the ciphertext. Tested at 1, 10 and 30 MB through `api.gateway.ethswarm.org`; every download decrypted and matched |
| What goes on Arkiv | Only the plain 64-hex reference of the **ciphertext**. The decryption key stays in our private database, never on Arkiv |

### The problem
The public gateway stamps uploads with its own batch, but `/arkiv/swarm.md` needs **our batch ID and who bought it**.

### Any ONE of these unblocks us

**Option A (easiest for us): a batch on a node or gateway you run.** Please send:
- [ ] the postage batch ID
- [ ] the Bee node or gateway URL to upload through
- [ ] an auth token, if the node needs one
- [ ] who bought the batch (wallet or name), so we can credit it in `swarm.md`

**Option B: testnet tokens so we run our own Bee node.** Send to our Swarm funding wallet:

```
0xCEfca762D3Cdc231B20220dA681021b562afF694
```

- [ ] sBZZ (Sepolia), enough for one batch at depth 20 for 7+ days
- [ ] a little Sepolia ETH for gas
- [ ] (or tell us if you prefer Gnosis mainnet xBZZ + xDAI instead)

**Option C: a gateway that accepts our own batch ID.**
- [ ] gateway URL

### What we need from the batch
| | |
|---|---|
| Clip size | 5–30 MB each (encrypted ciphertext) |
| Expected volume | ~50 uploads during the hackathon, plus judge testing |
| Depth / life | depth 20, at least 7 days, so links still open for judges after Saturday |

### Questions
1. Is there an upload size limit or rate limit on the node or gateway?
2. Do testnet entities on Rabdi or batches on Swarm get reset before judging ends (Sat 7 Nov)?
3. What is the longest expiry you'd recommend for Arkiv entities that judges will query after the event?

We keep a friction log for the Arkiv feedback track (`sponsor-logs/arkiv-session.md`, `sponsor-logs/swarm-session.md`) and are happy to report anything we hit.

---

## 2. World booth

### What we already have set up
| | |
|---|---|
| IDKit app (developer.world.org) | App ID `app_b3f89d34c3b6056074a99f171452368e`, RP ID `rp_15b590932690a33e`, action `claim-task` |
| Agent Pass app (auth.world.org) | Client ID `50595151-fdb6-4971-b9e3-00cdb7dfe976`, redirect `https://adx-paradigm.vercel.app/api/auth/world/callback`, default Selfie Check + Face Auth |

### How we use World (two tracks under one World pick)
- **IDKit, contributor side:** before claiming a paid task slot, the contributor proves they are a unique human (Selfie Check). One human, one slot per task. A second claim by the same person is rejected.
- **Agent Pass, buyer side:** the buyer AI agent pays small amounts by itself. Above a spending threshold it pauses and asks the buyer's human to approve on their phone (Orb + fresh face check, `max_age=0`). Approved: the payment settles. Denied, cancelled or expired: no payment happens.

### Questions
1. Proofs are mocked at this event. When we require Orb or Orb + Face (`acr` = `https://world.org/oidc/acr/orb-face`), what does a tester see on their phone? Do we need the World ID Sandbox app, or does the normal World App work?
2. Can we trigger the **denied, cancelled and expired** paths with mocked proofs, so we can show them in the demo?
3. Our agent is headless. Is the device authorization flow (`/api/v1/device_authorization`) supported for Agent Pass here?
4. For IDKit, should we test with the Simulator (simulator.worldcoin.org) and a staging action, or is IDKit mocked too?
5. We're entering both "World ID Agent Pass" and "Best Use of IDKit" under one World pick. Can one project win both?

### What we need back
- [ ] Answers to 1–5 (they go into our integration debrief)
- [ ] Anything to enable on our apps for the event (allowlist, sandbox flag)

---

## 3. Hedera booth

### What we already have working
| | |
|---|---|
| Buyer agent account | `0.0.11333306` |
| Merchant (x402 `payTo`) | `0.0.11333308` |
| Contributor accounts | `0.0.11333310`, `0.0.11333312` |
| First settled x402 payment | `0.0.9185802@1793933035.147018991` (0.01 USDC, x402.org facilitator, no human approving): https://hashscan.io/testnet/transaction/0.0.9185802@1793933035.147018991 |
| Packages | `@x402/express`, `@x402/fetch`, `@x402/hedera` 2.30.0 |

### Questions
1. Can the `payTo` be set **per request** (for example straight to the contributor who filmed the clip) with `@x402/hedera`, or should we settle to the merchant and then send a separate HTS transfer to the contributor?
2. We plan to enter both "AI Agents That Pay: x402" and "No Solidity Allowed" (we use HTS + HCS natively, no contracts). Can one project win both?
3. Is an HCS topic the recommended way to keep a tamper-evident spending log for the agent?
4. Is there a faucet limit increase for testnet USDC during the event? (Circle gives 20 USDC per 2 h.)

### What we need back
- [ ] Answers to 1–4
- [ ] More testnet USDC for the buyer account `0.0.11333306`, if possible

---

## 4. ETHGlobal staff

1. Our team wrote a planning brief and did research before hacking started. All code began after Thu 21:00, and the planning docs are disclosed in `docs/planning/`. Does a written plan count as prior "designs" under the from-scratch rule?
2. Confirm: we can select Hedera, Arkiv (+ Swarm bonus) and World as our 3 partner prizes, and be eligible for every track of each partner?
