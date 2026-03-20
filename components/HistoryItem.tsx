import type { Quote } from '@/types'

interface HistoryItemProps {
  quote: Quote
  isLast: boolean
}

function getRelativeTime(dateString: string): string {
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diffMs = now - then

  if (isNaN(then)) return ''

  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'yesterday'
  return `${diffDays}d ago`
}

export default function HistoryItem({ quote, isLast }: HistoryItemProps) {
  const relativeTime = getRelativeTime(quote.created_at)

  return (
    <li>
      <div className="flex items-start justify-between gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors duration-150">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-[#e0e0e0] leading-snug" title={quote.quote_text}>
            &ldquo;{quote.quote_text}&rdquo;
          </p>
          <p className="mt-1 text-xs font-medium text-accent-purple truncate">
            &mdash; {quote.author}
          </p>
        </div>
        {relativeTime && (
          <time
            dateTime={quote.created_at}
            className="shrink-0 text-xs text-[#666666] pt-0.5"
          >
            {relativeTime}
          </time>
        )}
      </div>
      {!isLast && (
        <div className="mx-4 h-px bg-brand-border" aria-hidden="true" />
      )}
    </li>
  )
}
