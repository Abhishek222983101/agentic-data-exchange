"use client"

// useWallet(): one tiny external store shared by every component. The unlocked key lives only in
// this module's memory for the session; reloading the page locks it again.
import { useSyncExternalStore } from "react"
import type { Hex } from "viem"
import { type PrivateKeyAccount, privateKeyToAccount } from "viem/accounts"
import { createWallet, loadSealed, type Sealed, unlockWallet } from "./vault"

export type WalletState =
  | { status: "loading" }
  | { status: "none" }
  | { status: "locked"; address: Hex; mode: Sealed["mode"] }
  | { status: "unlocked"; address: Hex; mode: Sealed["mode"] }
  | { status: "unsupported"; reason: string }

let state: WalletState = { status: "loading" }
let sealed: Sealed | undefined
let account: PrivateKeyAccount | undefined
const listeners = new Set<() => void>()
const emit = (s: WalletState) => {
  state = s
  for (const l of listeners) l()
}

let booted = false
function boot() {
  if (booted || typeof window === "undefined") return
  booted = true
  if (!window.indexedDB || !window.crypto?.subtle) {
    emit({ status: "unsupported", reason: "This browser can't store a wallet. Try Safari or Chrome." })
    return
  }
  loadSealed()
    .then((s) => {
      sealed = s
      emit(s ? { status: "locked", address: s.address, mode: s.mode } : { status: "none" })
    })
    .catch(() =>
      emit({ status: "unsupported", reason: "Private browsing blocks wallet storage. Open a normal tab." }),
    )
}

function subscribe(l: () => void) {
  listeners.add(l)
  boot()
  return () => listeners.delete(l)
}

/** Create (if needed) and unlock, then return the account. One tap on first use. */
export async function ensureAccount(): Promise<PrivateKeyAccount> {
  if (account) return account
  if (!sealed) {
    const created = await createWallet()
    sealed = created.sealed
    account = privateKeyToAccount(created.privateKey)
  } else {
    account = privateKeyToAccount(await unlockWallet(sealed))
  }
  emit({ status: "unlocked", address: account.address, mode: sealed.mode })
  return account
}

export function useWallet() {
  const s = useSyncExternalStore(
    subscribe,
    () => state,
    () => ({ status: "loading" }) as WalletState,
  )
  return { ...s, ensureAccount }
}
