import type { Metadata } from "next"
import { Page, PageHeader, Pending } from "@/components/shell/page-header"

export const metadata: Metadata = { title: "Record" }

export default function RecordPage() {
  return (
    <Page>
      <PageHeader title="Record" lead="Claim a task first. Your camera opens here with your challenge." />
      <Pending what="This screen is being built in the current phase." />
    </Page>
  )
}
