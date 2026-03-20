import type { Quote } from '@/types'
import CopyFeedback from './CopyFeedback'

interface QuoteCardProps {
  quote: Quote | null
  isCopied: boolean
}

export default function QuoteCard({ quote, isCopied }: QuoteCardProps) {
  return (
    <div
      className="relative w-full rounded-2xl border border-brand-border bg-brand-card p-8 shadow-2xl shadow-black/50 md:p-12"
      style={{
        boxShadow:
          '0 0 0 1px #333333, 0 25px 50px -12px rgba(0,0,0,0.6), 0 0 80px -20px rgba(139,92,246,0.15)',
      }}
    >
      {/* Decorative top-left glow accent */}
      <div
        className="pointer-events-none absolute -left-px -top-px h-32 w-32 rounded-tl-2xl opacity-30"
        style={{
          background:
            'radial-gradient(circle at top left, #8b5cf6 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative flex min-h-[160px] flex-col items-center justify-center text-center">
        {quote ? (
          <>
            {/* Opening quotation mark */}
            <span
              className="mb-4 block font-serif text-6xl leading-none text-accent-purple opacity-60 select-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>

            <blockquote className="mb-6 text-xl font-light leading-relaxed text-white md:text-2xl">
              {quote.quote_text}
            </blockquote>

            <p className="text-sm font-medium tracking-widest text-accent-purple-light uppercase">
              &mdash; {quote.author}
            </p>

            {isCopied && (
              <div className="mt-4">
                <CopyFeedback />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-border bg-brand-dark text-3xl"
              aria-hidden="true"
            >
              ✨
            </div>
            <p className="text-lg font-light text-[#e0e0e0]">
              Click{' '}
              <span className="font-medium text-accent-purple">
                Generate Quote
              </span>{' '}
              to get started
            </p>
            <p className="text-sm text-[#888888]">
              Discover original wisdom about growth, resilience, and human
              potential
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
