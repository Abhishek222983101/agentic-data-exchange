# hedera — integration session log

Running log written while we build. Each entry: time (IST), what we tried, what we expected, what happened, repro steps, how we fixed or worked around it. This is the raw source for the sponsor feedback files and the submission form.

| Time (IST) | Step | Expected | Actual | Repro / notes |
|---|---|---|---|---|
| 06 Nov 08:10 | Portal testnet account (ECDSA) | Account + 1000 HBAR | Worked: 0.0.11332739, refill every 24 h | portal.hedera.com → Testnet |
| 06 Nov 08:20 | `AccountBalanceQuery` to check USDC association (`@hiero-ledger/sdk` 2.90.1, the version `@x402/hedera` 2.30.0 pins) | Returns token balances | Throws "Deprecated: AccountBalanceQuery is no longer supported. Use MirrorNodeAccountBalanceQuery or the mirror node REST API". Most tutorials still use it | `new AccountBalanceQuery().setAccountId(id).execute(client)` on 2.90.1 |
| 06 Nov 08:22 | Create 4 ECDSA role accounts with alias + associate testnet USDC 0.0.429274 (`scripts/hedera-setup.ts`) | Accounts usable for x402 | Worked: buyer 0.0.11333306, merchant 0.0.11333308, contributors 0.0.11333310 / 0.0.11333312; each association SUCCESS | `pnpm hedera:setup` |
| 06 Nov 08:12 | Circle faucet → Hedera Testnet USDC to the buyer | Accepts the account's EVM address | Rejects any `0x…` address with "Please enter a valid wallet address for Hedera", even for ECDSA alias accounts; only `0.0.x` works. Then 20 USDC arrived within seconds | faucet.circle.com → Hedera Testnet → paste `0x…` EVM address |
| 06 Nov 08:24 | All 3 docs-listed facilitators `/supported` | hedera:testnet listed | All three list `exact` on hedera:testnet (fee payers: x402.org 0.0.9185802, Launa 0.0.9839454, Blocky402 0.0.7162784) | `curl <facilitator>/supported` |
| 06 Nov 08:25 | First x402 payment: `@x402/express` + `ExactHederaScheme` server, `@x402/fetch` + `createClientHederaSigner` agent, x402.org facilitator (`scripts/x402-smoke.ts`) | 402 → auto-pay → 200 | Worked first try: 402, then 200 in 2.2 s. 0.01 USDC buyer 0.0.11333306 → merchant 0.0.11333308, SUCCESS. Tx 0.0.9185802@1793933035.147018991. Note: `@x402/hedera` re-exports the Hiero SDK; importing `@hiero-ledger/sdk` separately can cause duplicate-instance errors | `pnpm x402:smoke`; https://hashscan.io/testnet/transaction/0.0.9185802@1793933035.147018991 |
