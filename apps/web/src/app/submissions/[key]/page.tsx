import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Page, PageHeader } from "@/components/shell/page-header"
import { LiveStatus } from "@/components/submission/live-status"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { isSubmissionId, submissionView } from "@/lib/server/submissions"

export const metadata: Metadata = { title: "Your clip" }

export default function SubmissionPage({ params }: PageProps<"/submissions/[key]">) {
  return (
    <Page>
      <PageHeader title="Your clip" lead="Each check ticks off as it finishes." />
      <div className="grid grid-cols-1 gap-6 pb-10 lg:grid-cols-[minmax(0,460px)_1fr]">
        <Suspense fallback={<Skeleton className="h-80 w-full rounded-[20px]" />}>
          <Status params={params} />
        </Suspense>
        <div className="space-y-4 text-[14px] text-muted-foreground">
          <p>
            When your clip is accepted, the robot team's agent pays you automatically. You'll see the payment
            and your licence on{" "}
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

async function Status({ params }: { params: PageProps<"/submissions/[key]">["params"] }) {
  const { key } = await params
  if (!isSubmissionId(key)) notFound()
  const view = await submissionView(key)
  if (!view) notFound()
  return <LiveStatus id={key} initial={view} />
}
