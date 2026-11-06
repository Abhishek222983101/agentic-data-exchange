import type { Metadata } from "next"
import { Page, PageHeader, Pending } from "@/components/shell/page-header"

export const metadata: Metadata = { title: "Tasks" }

export default function TasksPage() {
  return (
    <Page>
      <PageHeader title="Tasks" lead="Open tasks from robot teams appear here, read live from Arkiv." />
      <Pending what="This screen is being built in the current phase." />
    </Page>
  )
}
