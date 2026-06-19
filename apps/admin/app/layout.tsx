import type { Metadata } from 'next'
import { AppShell } from './app-shell'

export const metadata: Metadata = {
  title: 'Kuest Admin',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#0F172A', color: '#F1F5F9' }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
