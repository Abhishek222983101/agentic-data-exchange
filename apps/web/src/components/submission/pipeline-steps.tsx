import { PIPELINE_STEPS, type PipelineEvent } from "@adx/shared/events"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * The live check list. Each row is one stage of the pipeline with how long it took.
 * The first unfinished stage pulses; everything after it waits. Announced politely to screen readers.
 */
export function PipelineSteps({ events }: { events: PipelineEvent[] }) {
  const byStep = new Map(events.map((e) => [e.step, e]))
  const failed = events.find((e) => !e.ok)
  const firstPending = PIPELINE_STEPS.findIndex((s) => !byStep.has(s.id))
  return (
    <ol aria-live="polite" className="relative">
      {PIPELINE_STEPS.map((s, i) => {
        const ev = byStep.get(s.id)
        const state = ev
          ? ev.ok
            ? "done"
            : "fail"
          : failed
            ? "skipped"
            : i === firstPending
              ? "active"
              : "waiting"
        return (
          <li key={s.id} className="relative flex items-center gap-3.5 py-2.5">
            {i < PIPELINE_STEPS.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-[34px] left-[11px] h-[calc(100%-22px)] w-px",
                  state === "done" ? "bg-foreground/30" : "bg-border",
                )}
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 grid size-[23px] shrink-0 place-items-center rounded-full border",
                state === "done" && "border-foreground bg-foreground text-background",
                state === "fail" && "border-danger bg-danger text-white",
                state === "active" && "border-signal bg-signal-soft",
                (state === "waiting" || state === "skipped") && "border-border bg-background",
              )}
            >
              {state === "done" ? <Check className="size-3.5" strokeWidth={3} /> : null}
              {state === "fail" ? <X className="size-3.5" strokeWidth={3} /> : null}
              {state === "active" ? (
                <span className="size-2 animate-pulse rounded-full bg-signal motion-reduce:animate-none" />
              ) : null}
            </span>
            <span
              className={cn(
                "flex-1 text-[15px]",
                state === "waiting" || state === "skipped" ? "text-muted-foreground" : "text-foreground",
                state === "active" && "font-medium",
              )}
            >
              {s.label}
              {state === "fail" && ev?.data?.reason ? (
                <span className="block text-[13px] text-danger">{ev.data.reason}</span>
              ) : null}
            </span>
            <span className="font-mono text-[12px] text-muted-foreground tabular">
              {ev?.ms != null ? (ev.ms >= 1000 ? `${(ev.ms / 1000).toFixed(1)} s` : `${ev.ms} ms`) : ""}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
