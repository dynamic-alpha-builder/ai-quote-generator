export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { anthropic } from '@/lib/openai'
import { supabaseServer } from '@/lib/supabase-server'
import type { Quote } from '@/types'

const FALLBACK_QUOTES: { quote_text: string; author: string }[] = [
  {
    quote_text:
      'The oak fought the wind and was broken, the willow bent when it must and survived.',
    author: 'Robert Jordan',
  },
  {
    quote_text:
      'Growth is never by mere chance; it is the result of forces working together.',
    author: 'James Cash Penney',
  },
  {
    quote_text:
      'Do not judge me by my success, judge me by how many times I fell down and got back up again.',
    author: 'Nelson Mandela',
  },
  {
    quote_text:
      'The human capacity for burden is like bamboo — far more flexible than you would ever believe at first glance.',
    author: 'Jodi Picoult',
  },
  {
    quote_text:
      'What lies behind us and what lies before us are tiny matters compared to what lies within us.',
    author: 'Ralph Waldo Emerson',
  },
  {
    quote_text:
      'You may encounter many defeats, but you must not be defeated. In fact, it may be necessary to encounter the defeats so you can know who you are.',
    author: 'Maya Angelou',
  },
  {
    quote_text: 'It is not the mountain we conquer, but ourselves.',
    author: 'Edmund Hillary',
  },
  {
    quote_text: 'In the middle of every difficulty lies opportunity.',
    author: 'Albert Einstein',
  },
  {
    quote_text:
      'Resilience is knowing that you are the only one that has the power and the responsibility to pick yourself up.',
    author: 'Mary Holloway',
  },
  {
    quote_text:
      'The greatest glory in living lies not in never falling, but in rising every time we fall.',
    author: 'Nelson Mandela',
  },
]

async function saveFallbackQuote(): Promise<NextResponse> {
  const pick =
    FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]

  const { data, error } = await supabaseServer
    .from('quotes')
    .insert({ quote_text: pick.quote_text, author: pick.author })
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: `Database error: ${error.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json(data as Quote, { status: 201 })
}

export async function POST(): Promise<NextResponse> {
  // Use fallback immediately when no API key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    return saveFallbackQuote()
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content:
            'Generate an original, deeply inspirational quote about growth, resilience, or human potential. Respond ONLY with a valid JSON object in this exact format, no markdown, no explanation: {"quote_text": "the quote here", "author": "Author Name"}',
        },
      ],
    })

    const rawContent =
      message.content[0]?.type === 'text' ? message.content[0].text : null
    if (!rawContent) {
      return saveFallbackQuote()
    }

    // Strip any markdown code fences if present
    const cleaned = rawContent
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/```$/i, '')
      .trim()

    let parsed: { quote_text: string; author: string }
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      return saveFallbackQuote()
    }

    if (!parsed.quote_text || !parsed.author) {
      return saveFallbackQuote()
    }

    const { data, error } = await supabaseServer
      .from('quotes')
      .insert({ quote_text: parsed.quote_text, author: parsed.author })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(data as Quote, { status: 201 })
  } catch (err: unknown) {
    // AI call failed — fall back to a hardcoded quote
    console.error('AI request failed, using fallback quote:', err)
    return saveFallbackQuote()
  }
}
