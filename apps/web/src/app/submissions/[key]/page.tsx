import type { Metadata } from "next"
import Link from "next/link"
import { ProofLink } from "@/components/proof/proof-link"
import { DemoBadge } from "@/components/shell/demo-badge"
import { Page, PageHeader } from "@/components/shell/page-header"
import { PipelineSteps } from "@/components/submission/pipeline-steps"
import { VerdictCard } from "@/components/submission/verdict-card"
import { Button } from "@/components/ui/button"
import { DEMO_EVENTS, DEMO_VERDICT } from "@/lib/demo"

export const metadata: Metadata = { title: "Your clip" }

// P4 replaces the sample events with the live SSE stream for this submission.
export default function SubmissionPage() {
  return (
    <Page>
      <PageHeader
        title="Your clip"
        lead="Each check ticks off as it finishes. It usually takes about 20 seconds."
      >
        <DemoBadge />
      </PageHeader>
      <div className="grid grid-cols-1 gap-8 pb-10 lg:grid-cols-[minmax(0,380px)_1fr]">
        <section aria-label="Checks" className="rounded-[20px] border bg-card p-5">
          <PipelineSteps events={DEMO_EVENTS} />
        </section>
        <div className="space-y-5">
          <VerdictCard v={DEMO_VERDICT} />
          <div className="flex flex-wrap gap-2">
            <ProofLink kind="arkiv" label="Verdict on Arkiv" />
            <ProofLink kind="swarm" label="Encrypted clip on Swarm" />
          </div>
          <p className="text-[14px] text-muted-foreground">
            The buyer's agent pays automatically once your clip is accepted. You'll see the payment and your
            licence on{" "}
            <Link href="/me" className="font-medium text-foreground underline underline-offset-4">
              your page
            </Link>
            .
          </p>
          <Button asChild variant="outline" size="lg">
            <Link href="/tasks">Find another task</Link>
          </Button>
        </div>
      </div>
    </Page>
  )
}
