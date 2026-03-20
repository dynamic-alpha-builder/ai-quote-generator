import type { Quote } from '@/types'
import HistoryItem from './HistoryItem'

interface QuoteHistoryProps {
  history: Quote[]
  loadError: boolean
}

export default function QuoteHistory({ history, loadError }: QuoteHistoryProps) {
  return (
    <section aria-labelledby="history-heading" className="w-full">
      <div className="mb-4 flex items-center gap-3">
        <h2
          id="history-heading"
          className="text-base font-semibold text-[#e0e0e0]"
        >
          Recent Quotes
        </h2>
        {history.length > 0 && (
          <span
            className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent-purple px-1.5 text-xs font-bold text-white"
            aria-label={`${history.length} quotes`}
          >
            {history.length}
          </span>
        )}
      </div>

      <div
        className="rounded-2xl border border-brand-border bg-brand-card overflow-hidden"
        style={{
          boxShadow: '0 4px 24px -8px rgba(0,0,0,0.4)',
        }}
      >
        {loadError ? (
          <p className="px-4 py-6 text-center text-sm text-[#888888]">
            Unable to load history. Please try again later.
          </p>
        ) : history.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-[#888888]">
            No quotes yet. Generate your first one above.
          </p>
        ) : (
          <ul aria-label="Quote history" className="py-1">
            {history.map((quote, index) => (
              <HistoryItem
                key={quote.id}
                quote={quote}
                isLast={index === history.length - 1}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
