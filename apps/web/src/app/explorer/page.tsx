import type { Metadata } from "next"
import { Page, PageHeader, Pending } from "@/components/shell/page-header"

export const metadata: Metadata = { title: "Explorer" }

export default function ExplorerPage() {
  return (
    <Page>
      <PageHeader title="Explorer" lead="Run the same Arkiv queries the app uses and see the raw results." />
      <Pending what="This screen is being built in the current phase." />
    </Page>
  )
}
