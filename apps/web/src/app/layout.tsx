import type { Metadata, Viewport } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { BottomNav } from "@/components/shell/nav"
import { SiteHeader } from "@/components/shell/site-header"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://adx-paradigm.vercel.app"),
  title: { default: "Paradigm — paid tasks that teach robots", template: "%s · Paradigm" },
  description:
    "Robot teams' AI agents post the exact demonstrations their models fail on. Verified humans film them on a phone and get paid in USDC. Every task, verdict, receipt and licence is an open record on Arkiv.",
  applicationName: "Paradigm",
  appleWebApp: { capable: true, title: "Paradigm", statusBarStyle: "black-translucent" },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f0e3",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh flex flex-col">
        <ThemeProvider attribute="class" forcedTheme="light" defaultTheme="light" disableTransitionOnChange>
          <TooltipProvider delayDuration={200}>
            <SiteHeader />
            <main id="main" className="flex-1 pb-24 md:pb-12">
              {children}
            </main>
            <BottomNav />
            <Toaster position="top-center" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
