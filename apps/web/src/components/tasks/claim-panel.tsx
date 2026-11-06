import { Button } from "@/components/ui/button"
import { ClaimFlow } from "./claim-flow"

type State = "open" | "full" | "closed"

/**
 * The single primary action on a task. On phones it docks above the bottom nav (thumb reach);
 * on desktop it sits in the sidebar. The claim flow itself is in claim-flow.tsx.
 */
export function ClaimPanel({
  taskKey,
  title,
  reward,
  state,
}: {
  taskKey: `0x${string}`
  title: string
  reward: string
  state: State
}) {
  return (
    <div className="fixed inset-x-0 bottom-16 z-30 border-t bg-background/95 p-4 backdrop-blur-xl md:static md:rounded-[18px] md:border md:bg-card md:p-5">
      <div className="mx-auto flex max-w-md items-center gap-4 md:max-w-none md:flex-col md:items-stretch">
        <div className="md:flex md:items-baseline md:justify-between">
          <div className="font-mono text-[22px] leading-none font-medium tabular md:text-[28px]">
            {reward} <span className="font-sans text-[13px] font-normal text-muted-foreground">USDC</span>
          </div>
          <div className="mt-1 text-[12px] text-muted-foreground md:mt-0">per accepted clip</div>
        </div>
        {state === "open" ? (
          <div className="flex-1 md:w-full">
            <ClaimFlow taskKey={taskKey} title={title} />
          </div>
        ) : (
          <Button variant="outline" size="xl" className="flex-1 md:w-full" disabled>
            {state === "full" ? "All slots taken" : "This task has closed"}
          </Button>
        )}
      </div>
      <p className="mx-auto mt-3 hidden max-w-md text-[13px] text-muted-foreground md:block">
        One slot per person. You prove you're a unique human with World ID; we never learn who you are.
      </p>
    </div>
  )
}
