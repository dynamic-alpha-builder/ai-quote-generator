'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Quote } from '@/types'
import QuoteCard from '@/components/QuoteCard'
import QuoteActions from '@/components/QuoteActions'

export default function HomePage() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [history, setHistory] = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Hydrate history on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch('/api/quotes')
        if (!res.ok) return
        const data: Quote[] | { error: string } = await res.json()
        if (Array.isArray(data)) {
          setHistory(data.slice(0, 10))
        }
      } catch {
        // silently ignore — history is non-critical
      }
    }
    loadHistory()
  }, [])

  const handleGenerate = useCallback(async () => {
    setIsLoading(true)
    setIsCopied(false)

    try {
      const res = await fetch('/api/generate-quote', { method: 'POST' })
      const data: Quote | { error: string } = await res.json()

      if (!res.ok || 'error' in data) {
        console.error(
          'Error generating quote:',
          'error' in data ? data.error : `HTTP ${res.status}`
        )
        return
      }

      setCurrentQuote(data)
      setHistory((prev) => {
        const updated = [data, ...prev.filter((q) => q.id !== data.id)]
        return updated.slice(0, 10)
      })
    } catch (err) {
      console.error('Error generating quote:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleCopy = useCallback(() => {
    if (!currentQuote) return
    const text = `${currentQuote.quote_text} — ${currentQuote.author}`
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
      .catch((err) => {
        console.error('Failed to copy to clipboard:', err)
      })
  }, [currentQuote])

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-20">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1
            className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl"
            style={{
              background:
                'linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ✨ AI Quote Generator
          </h1>
          <p className="text-base text-[#888888] sm:text-lg">
            Original wisdom about growth, resilience, and human potential
          </p>
        </header>

        {/* Main content */}
        <main>
          <QuoteCard quote={currentQuote} isCopied={isCopied} />

          <div className="mt-6">
            <QuoteActions
              hasQuote={currentQuote !== null}
              isLoading={isLoading}
              onGenerate={handleGenerate}
              onCopy={handleCopy}
            />
          </div>

          {/* Quote History */}
          <section className="mt-12" aria-label="Quote history">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent-purple">
              Recent Quotes
            </h2>

            {history.length === 0 ? (
              <p className="text-sm text-[#555555]">No quotes generated yet.</p>
            ) : (
              <ul className="space-y-3">
                {history.map((q) => (
                  <li
                    key={q.id}
                    className="rounded-xl border border-brand-border bg-brand-card px-5 py-4"
                  >
                    <p className="text-sm leading-relaxed text-[#e0e0e0]">
                      &ldquo;{q.quote_text}&rdquo;
                    </p>
                    <p className="mt-1 text-xs font-medium tracking-wide text-accent-purple-light">
                      — {q.author}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-xs text-[#555555]">Powered by AI &amp; Supabase</p>
        </footer>
      </div>
    </div>
  )
}
