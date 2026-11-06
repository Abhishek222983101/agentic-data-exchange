import type { TaskDTO } from "@adx/shared"
import Link from "next/link"
import { Countdown } from "./countdown"
import { SlotRail } from "./slot-rail"

export function TaskCard({ task }: { task: TaskDTO }) {
  const full = task.filled >= task.slots
  return (
    <Link
      href={`/tasks/${task.key}`}
      className="group block rounded-[18px] border bg-card p-5 transition-colors hover:border-foreground/25 focus-visible:border-signal"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-[17px] leading-snug font-semibold tracking-[-0.01em] text-pretty">
          {task.title}
        </h2>
        <div className="shrink-0 text-right">
          <div className="font-mono text-[22px] leading-none font-medium tracking-tight tabular">
            {task.reward}
          </div>
          <div className="mt-1 text-[12px] text-muted-foreground">USDC</div>
        </div>
      </div>
      {task.rubric ? (
        <p className="mt-2 line-clamp-2 max-w-[60ch] text-[14px] text-muted-foreground">
          {task.rubric.summary}
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <SlotRail slots={task.slots} filled={task.filled} />
        <Countdown
          deadline={task.deadline}
          className={full ? "text-[13px] text-muted-foreground" : "text-[13px] text-foreground/80"}
        />
      </div>
    </Link>
  )
}
