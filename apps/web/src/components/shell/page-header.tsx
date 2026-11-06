import type { ReactNode } from "react"

export function PageHeader({
  title,
  lead,
  children,
}: {
  title: string
  lead?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pt-8 pb-6">
      <div className="min-w-0">
        <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.03em] md:text-[34px]">{title}</h1>
        {lead ? (
          <p className="mt-1.5 max-w-[60ch] text-[15px] text-muted-foreground text-pretty">{lead}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}

export function Page({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[1120px] px-5">{children}</div>
}

export function Pending({ what }: { what: string }) {
  return <div className="rounded-xl border border-dashed p-8 text-[15px] text-muted-foreground">{what}</div>
}
