# arkiv — integration session log

Running log written while we build. Each entry: time (IST), what we tried, what we expected, what happened, repro steps, how we fixed or worked around it. This is the raw source for the sponsor feedback files and the submission form.

| Time (IST) | Step | Expected | Actual | Repro / notes |
|---|---|---|---|---|
| 06 Nov 07:10 | Access key + faucet on hub.arkiv.network | Key and tGLM in a few clicks | Worked. 10 tGLM per claim, 1 h cooldown per wallet | Hub → Access Keys → create project "PARADIGM"; Faucet → claim |
| 06 Nov 07:15 | Install Claude plugin (`claude plugin marketplace add Arkiv-Network/ai-plugin`, `claude plugin install arkiv@arkiv`) | Plugin installs | Installed v0.5.4 cleanly. Hub page sections are JS-rendered, so the install commands are invisible to fetch-based tools until a section is expanded | Fetch hub.arkiv.network/ai-tools with curl/Exa: only headings come back |
| 06 Nov 07:20 | First write with SDK 1.0.1 (`scripts/arkiv-smoke.ts`): createEntity → getEntity → select().from().where(and(eq,eq)).ownedBy() | ~2 s (2 s blocks) | Worked. createEntity resolved in ~7.2 s; read-back and query instant; 1 hit | `pnpm arkiv:smoke`; tx 0x159e18177011c03c1f0d8d5c97283ff4086770c09679154afa322f7b97ca25b3 |
