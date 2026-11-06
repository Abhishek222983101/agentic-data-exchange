import { Video } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Page } from "@/components/shell/page-header"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Record" }

// P3: when this device holds an active claim, this page jumps straight to /record/[claim].
export default function RecordPage() {
  return (
    <Page>
      <div className="mx-auto flex max-w-sm flex-col items-center pt-20 pb-10 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-sunken">
          <Video className="size-7 text-muted-foreground" />
        </span>
        <h1 className="mt-6 text-[24px] font-semibold tracking-[-0.02em]">Nothing to record yet</h1>
        <p className="mt-2 text-[15px] text-muted-foreground text-pretty">
          Claim a task first. You'll get a word to say and a number of fingers to show, then the camera opens
          here.
        </p>
        <Button asChild variant="signal" size="xl" className="mt-8">
          <Link href="/tasks">See open tasks</Link>
        </Button>
      </div>
    </Page>
  )
}
