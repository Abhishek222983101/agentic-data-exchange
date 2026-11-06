import type { Metadata } from "next"
import { Page, PageHeader, Pending } from "@/components/shell/page-header"

export const metadata: Metadata = { title: "Console" }

export default function ConsolePage() {
  return (
    <Page>
      <PageHeader title="Console" lead="The buyer agent's policy, live feed and approvals will show here." />
      <Pending what="This screen is being built in the current phase." />
    </Page>
  )
}
