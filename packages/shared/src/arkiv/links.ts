// Explorer links. Every on-chain thing in the UI is clickable (system architecture §14).
export const ARKIV_EXPLORER = "https://rabdi.explorer.arkiv.network"
export const HASHSCAN = "https://hashscan.io/testnet"
export const SWARM_GATEWAY = "https://api.gateway.ethswarm.org"

export const links = {
  arkivEntity: (key: string) => `${ARKIV_EXPLORER}/entity/${key}`,
  arkivTx: (hash: string) => `${ARKIV_EXPLORER}/tx/${hash}`,
  arkivAddress: (addr: string) => `${ARKIV_EXPLORER}/address/${addr}`,
  hashscanTx: (txId: string) => `${HASHSCAN}/transaction/${txId}`,
  hashscanAccount: (id: string) => `${HASHSCAN}/account/${id}`,
  swarm: (ref: string) => `${SWARM_GATEWAY}/bytes/${ref}`,
}

export function shortHex(h: string, head = 6, tail = 4): string {
  return h.length <= head + tail + 1 ? h : `${h.slice(0, head)}…${h.slice(-tail)}`
}
