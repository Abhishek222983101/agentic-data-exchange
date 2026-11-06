// Paradigm mark: an open slot (bracket frame) with one filled cell — "one verified human, one slot".
export function Mark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <path
        d="M11 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M21 4h5a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2h-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x="11" y="11" width="10" height="10" rx="2" fill="var(--signal)" />
    </svg>
  )
}

export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2 font-semibold tracking-[-0.02em] text-[17px]">
      <Mark className="size-[22px]" />
      Paradigm
    </span>
  )
}
