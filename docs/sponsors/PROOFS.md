# Proofs — every on-chain action, with a link you can open

Living index for judges. Each row is something that really happened on a public network during the hackathon, with an explorer link. The step-by-step story behind each row, including what broke, is in `docs/sponsors/session-logs/`.

Screenshots are captured clean (no keys or secrets visible) into `docs/proofs/`, named by row ID.

## Arkiv (Rabdi testnet, chain 7794095)
| ID | When (IST) | What | Proof |
|---|---|---|---|
| ARK-01 | 06 Nov 07:20 | First entity write, read-back and owner-filtered query (SDK 1.0.1) | [tx 0x159e…25b3](https://rabdi.explorer.arkiv.network/tx/0x159e18177011c03c1f0d8d5c97283ff4086770c09679154afa322f7b97ca25b3) · entity `0xdebe725978225037887ebcd22b24b69fdddddbd6e90e90ccce86dd78190950c0` · `scripts/arkiv-smoke.ts` |
| ARK-02 | 06 Nov 15:20 | One Arkiv signer per role funded from the team wallet (web `0x2dEc…D98C`, worker `0xCDFa…2A51`, verifier `0x0C73…F421`, buyer `0x0F00…Dcc6`) | [web](https://rabdi.explorer.arkiv.network/tx/0x7e9481492c44abc7336316960ab593264351c6def5a78b054611e35085013c49) · [worker](https://rabdi.explorer.arkiv.network/tx/0x692273829ebaf01c89b4bf5eee67842bc0559d3adff7e39f07156772366700d0) · [verifier](https://rabdi.explorer.arkiv.network/tx/0xf51fc73a501633d1837643bf2c128acd39427f6aff1bf081d94b5712fa0ba573) · [buyer](https://rabdi.explorer.arkiv.network/tx/0xf69fc84c39b8646e1e13ef6a638eaa175935c2dd2a32a5c888adb357d3f0c8d5) · `scripts/arkiv-wallets.ts` |
| ARK-03 | 06 Nov 15:45 | Seeded the live namespace: verifier listing (verifier wallet, 24 h) and the demo task "Fold a towel, filmed from above" (buyer wallet, 3 slots, 3 USDC, rubric bytes on-chain + rubric JSON on Swarm) | verifier [0x1ff9…64cb](https://rabdi.explorer.arkiv.network/entity/0x1ff914c70cbd19d5cc35ddcce96f51538b2cd13594f0ae29608719d090d064cb) ([tx](https://rabdi.explorer.arkiv.network/tx/0x4af9f7ef19c50d437aa643b929f6b83574cbcccd769fc7180d0bda7ce706e010)) · task [0x59f8…a69e](https://rabdi.explorer.arkiv.network/entity/0x59f8914bff0b8d9e8de3c1c2d004843b5fc0d5dd4155d8b056f2a15b89daa69e) ([tx](https://rabdi.explorer.arkiv.network/tx/0xde592b16b0fa4a2c38aec253d4f5c0fd58f731975012470b45c6af3270006e2e)) · rubric [Swarm 2a6b…0e81](https://api.gateway.ethswarm.org/bytes/2a6ba126c36859a953e1ff2883bbe6d0c94b60ae534f3a9c3973b96888e80e81) · `pnpm seed:arkiv` |
| ARK-04 | 06 Nov 15:50 | All 8 schemas created + read back through the guarded writer; guard refused a secret-looking value; 10 parallel creates on one signer landed (namespace `adx-test`, 1 h expiry) | `scripts/arkiv-roundtrip.ts` output in PROGRESS.md |

## Hedera (testnet)
| ID | When (IST) | What | Proof |
|---|---|---|---|
| HED-01 | 06 Nov 08:22 | 4 role accounts created + testnet USDC `0.0.429274` associated | buyer [0.0.11333306](https://hashscan.io/testnet/account/0.0.11333306) · merchant [0.0.11333308](https://hashscan.io/testnet/account/0.0.11333308) · contributors [0.0.11333310](https://hashscan.io/testnet/account/0.0.11333310), [0.0.11333312](https://hashscan.io/testnet/account/0.0.11333312) · `scripts/hedera-setup.ts` |
| HED-02 | 06 Nov 08:25 | **First x402 payment settled.** The agent paid 0.01 USDC with no human approving (x402.org facilitator) | [0.0.9185802@1793933035.147018991](https://hashscan.io/testnet/transaction/0.0.9185802@1793933035.147018991) · `scripts/x402-smoke.ts` |

## Swarm (Sepolia testnet, our own Bee node)
| ID | When (IST) | What | Proof |
|---|---|---|---|
| SWM-01 | 06 Nov 08:35 | Client-side encrypted uploads, 1 / 10 / 30 MB, downloaded and verified (public gateway, before our node) | 30 MB ciphertext ref `ae11c07156b1df3de0295816d06812892c14127534a07fe34933308bb429ff51` · `scripts/swarm-smoke.ts` |
| SWM-02 | 06 Nov 09:05 | Sepolia ETH → sBZZ on Uniswap v3 (self-serve, no faucet exists) | [tx 0x1b1d…f2](https://sepolia.etherscan.io/tx/0x1b1d97ee93a32a3479e03b65e8309932e7cc43aad262a4b514ce5d4892b3c3f2), [tx 0x0a5e…8d](https://sepolia.etherscan.io/tx/0x0a5ed87f121be9ec1aa4869be2b43ae5d9a5d3f5107c71f0f1d2b57b2adf2a8d), [tx 0xf039…b1](https://sepolia.etherscan.io/tx/0xf03933c4814c73e8c37e19b75d39bd875c8f9efa0f32db7e94ab605d5b282ab1) · `scripts/swarm-fund.ts` |
| SWM-03 | 06 Nov 09:30 | Our Bee 2.8.3 node's chequebook deployed (node wallet = our funding wallet) | node [0xCEfca762…F694](https://sepolia.etherscan.io/address/0xCEfca762D3Cdc231B20220dA681021b562afF694) · chequebook [0x6f045e3A…91bB](https://sepolia.etherscan.io/address/0x6f045e3A46048c77F3555AA87b78CD665Dd891bB) · `infra/bee/` |
| SWM-04 | 06 Nov 09:40 | **Our own postage batch** bought on-chain (depth 20, ~2.9 days, immutable) | batch `c0cc54366a3a337d4a84ab78af74a26440d122eb3af5952d65734d8221332665` · [tx 0x515d…d1](https://sepolia.etherscan.io/tx/0x515df5c447f6c91d81c8391019f3a3702cb0a47b08968867ea43de5c2ee520d1) · `scripts/swarm-buy-batch.ts` |

## World ID
| ID | When (IST) | What | Proof |
|---|---|---|---|
| WLD-01 | 06 Nov 07:53 | IDKit app + RP registered, action `claim-task` | App `app_b3f89d34c3b6056074a99f171452368e`, RP `rp_15b590932690a33e` |
| WLD-02 | 06 Nov 08:02 | Agent Pass (World IdP) app registered, Selfie Check default + Face Auth | Client `50595151-fdb6-4971-b9e3-00cdb7dfe976` |
