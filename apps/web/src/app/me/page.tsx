import type { Metadata } from "next"
import { Page, PageHeader, Pending } from "@/components/shell/page-header"

export const metadata: Metadata = { title: "Me" }

export default function MePage() {
  return (
    <Page>
      <PageHeader title="Me" lead="Your wallet, earnings and licences will show here." />
      <Pending what="This screen is being built in the current phase." />
    </Page>
  )
}
