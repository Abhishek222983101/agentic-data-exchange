/** Marks any screen region that still shows sample data. Removed as each phase wires the real source. */
export function DemoBadge({ what = "Sample data" }: { what?: string }) {
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-dashed border-warning/60 px-2.5 text-[12px] font-medium text-warning">
      <span className="size-1.5 rounded-full bg-warning" aria-hidden="true" />
      {what}
    </span>
  )
}
