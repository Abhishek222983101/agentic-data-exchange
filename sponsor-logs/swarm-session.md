# swarm — integration session log

Running log written while we build. Each entry: time (IST), what we tried, what we expected, what happened, repro steps, how we fixed or worked around it. This is the raw source for the sponsor feedback files and the submission form.

| Time (IST) | Step | Expected | Actual | Repro / notes |
|---|---|---|---|---|
| 06 Nov 08:35 | Encrypt clip-sized blobs ourselves (AES-256-GCM), upload ciphertext via public gateway `api.gateway.ethswarm.org` `POST /bytes`, download, decrypt (`scripts/swarm-smoke.ts`) | Works for 10–50 MB clips | Worked for 1, 10 and 30 MB; hashes match. Upload ~1 MB/s (30 MB in 33 s), download ~3.4 MB/s. Plain 64-hex refs (we encrypt client-side, so no 128-hex key-bearing ref exists to leak into Arkiv). Gateway ignores our `swarm-postage-batch-id` and stamps with its own batch, so we can't name a batch for the bonus write-up | `SIZE_MB=1,10,30 pnpm swarm:smoke`; ref ae11c07156b1df3de0295816d06812892c14127534a07fe34933308bb429ff51 (30 MB ciphertext) |
