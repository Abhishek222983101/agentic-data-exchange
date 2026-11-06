# hedera — integration session log

Running log written while we build. Each entry: time (IST), what we tried, what we expected, what happened, repro steps, how we fixed or worked around it. This is the raw source for the sponsor feedback files and the submission form.

| Time (IST) | Step | Expected | Actual | Repro / notes |
|---|---|---|---|---|
| 06 Nov 08:10 | Portal testnet account (ECDSA) | Account + 1000 HBAR | Worked: 0.0.11332739, refill every 24 h | portal.hedera.com → Testnet |
| 06 Nov 08:20 | `AccountBalanceQuery` to check USDC association (`@hiero-ledger/sdk` 2.90.1, the version `@x402/hedera` 2.30.0 pins) | Returns token balances | Throws "Deprecated: AccountBalanceQuery is no longer supported. Use MirrorNodeAccountBalanceQuery or the mirror node REST API". Most tutorials still use it | `new AccountBalanceQuery().setAccountId(id).execute(client)` on 2.90.1 |
| 06 Nov 08:22 | Create 4 ECDSA role accounts with alias + associate testnet USDC 0.0.429274 (`scripts/hedera-setup.ts`) | Accounts usable for x402 | Worked: buyer 0.0.11333306, merchant 0.0.11333308, contributors 0.0.11333310 / 0.0.11333312; each association SUCCESS | `pnpm hedera:setup` |
