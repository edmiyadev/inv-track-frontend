import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Suspense } from "react"
import { AuthProvider } from "@/components/providers/auth-provider"

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "Professional inventory management admin panel",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <ThemeProvider defaultTheme="dark" storageKey="inventory-theme">
            <AuthProvider>{children}</AuthProvider>
            {/* </CHANGE> */}
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
