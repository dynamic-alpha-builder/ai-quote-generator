import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Quote Generator',
  description:
    'Generate original, deeply inspirational quotes powered by AI. Find wisdom about growth, resilience, and human potential.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-dark text-white antialiased">
        {children}
      </body>
    </html>
  )
}
