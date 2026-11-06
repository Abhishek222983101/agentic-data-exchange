// The only way the codebase writes to Arkiv: guard → per-signer queue → retry with reconciliation.
import type { CreateEntityValues, PatchEntityValues, Schema } from "@arkiv-network/sdk/schema"
import type { Hex } from "viem"
import { arkivPublic, walletFor } from "./client"
import { assertPublicSafe } from "./guard"
import { enqueue, withRetry } from "./queue"
import type { Role } from "./wallets"

// biome-ignore lint/suspicious/noExplicitAny: SDK generic constraint
type AnySchema = Schema<any>
type Expiry = Parameters<ReturnType<typeof walletFor>["createEntity"]>[2]["expiration"]

export type WriteResult = { entityKey: Hex; txHash: Hex; ms: number }

function schemaName(schema: AnySchema): string {
  return (schema as { name?: string }).name ?? "untagged"
}

/**
 * Create an entity as `role`. Before sending we predict the key (with our own salt); if the RPC times
 * out after the tx was accepted, reconciliation finds the entity at the predicted key instead of
 * creating a duplicate.
 */
export async function safeCreate<S extends AnySchema>(
  role: Role,
  schema: S,
  values: CreateEntityValues<S>,
  expiration: Expiry,
): Promise<WriteResult> {
  assertPublicSafe(schemaName(schema), values as Record<string, unknown>)
  const wallet = walletFor(role)
  const pub = arkivPublic()
  return enqueue(wallet.account.address, async () => {
    const t0 = Date.now()
    let predicted: { key: Hex; salt: bigint } | undefined
    return withRetry(
      async () => {
        const [p] = await pub.predictEntityKeys({ owner: wallet.account.address, count: 1 })
        predicted = p as { key: Hex; salt: bigint }
        const res = await wallet.createEntity(schema, values, { expiration, salt: predicted.salt })
        return { entityKey: res.entityKey, txHash: res.txHash, ms: Date.now() - t0 }
      },
      {
        reconcile: async () => {
          if (!predicted) return undefined
          await new Promise((r) => setTimeout(r, 2500))
          const found = await pub.getEntity(predicted.key).catch(() => null)
          return found ? { entityKey: predicted.key, txHash: "0x" as Hex, ms: Date.now() - t0 } : undefined
        },
      },
    )
  })
}

export async function safePatch<S extends AnySchema>(
  role: Role,
  schema: S,
  entityKey: Hex,
  changes: PatchEntityValues<S>,
): Promise<{ txHash: Hex }> {
  assertPublicSafe(schemaName(schema), changes as Record<string, unknown>)
  const wallet = walletFor(role)
  return enqueue(wallet.account.address, () =>
    withRetry(async () => {
      const r = await wallet.patchEntity(schema, entityKey, changes as never)
      return { txHash: r.txHash }
    }),
  )
}

export async function safeExtend(role: Role, entityKey: Hex, expiration: Expiry): Promise<{ txHash: Hex }> {
  const wallet = walletFor(role)
  return enqueue(wallet.account.address, () =>
    withRetry(async () => ({ txHash: (await wallet.extendEntity({ entityKey, expiration })).txHash })),
  )
}

export async function safeDelete(role: Role, entityKey: Hex): Promise<{ txHash: Hex }> {
  const wallet = walletFor(role)
  return enqueue(wallet.account.address, () =>
    withRetry(async () => ({ txHash: (await wallet.deleteEntity({ entityKey })).txHash })),
  )
}

export async function safeChangeOwner(role: Role, entityKey: Hex, newOwner: Hex): Promise<{ txHash: Hex }> {
  const wallet = walletFor(role)
  return enqueue(wallet.account.address, () =>
    withRetry(async () => ({ txHash: (await wallet.changeOwnership({ entityKey, newOwner })).txHash })),
  )
}
