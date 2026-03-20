interface QuoteActionsProps {
  hasQuote: boolean
  isLoading: boolean
  onGenerate: () => void
  onCopy: () => void
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

export default function QuoteActions({
  hasQuote,
  isLoading,
  onGenerate,
  onCopy,
}: QuoteActionsProps) {
  const baseButton =
    'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark disabled:cursor-not-allowed disabled:opacity-50'

  const primaryButton = `${baseButton} bg-accent-purple text-white hover:bg-accent-purple-light active:scale-95 shadow-lg shadow-purple-900/40`

  const secondaryButton = `${baseButton} border border-brand-border bg-brand-card text-[#e0e0e0] hover:border-accent-purple hover:text-white active:scale-95`

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-3"
      role="group"
      aria-label="Quote actions"
    >
      {!hasQuote ? (
        <button
          type="button"
          className={primaryButton}
          onClick={onGenerate}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner />
              Generating...
            </>
          ) : (
            <>
              <span aria-hidden="true">✨</span>
              Generate Quote
            </>
          )}
        </button>
      ) : (
        <>
          <button
            type="button"
            className={secondaryButton}
            onClick={onCopy}
            disabled={isLoading}
          >
            <span aria-hidden="true">📋</span>
            Copy to Clipboard
          </button>

          <button
            type="button"
            className={primaryButton}
            onClick={onGenerate}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner />
                Generating...
              </>
            ) : (
              <>
                <span aria-hidden="true">🔄</span>
                Generate Another
              </>
            )}
          </button>
        </>
      )}
    </div>
  )
}
