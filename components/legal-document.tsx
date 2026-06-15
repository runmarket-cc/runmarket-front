'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { RunmarketLogo } from '@/components/runmarket-logo'
import { api } from '@/lib/api'
import type { LegalBlock, LegalDocument, LegalListItem } from '@/lib/api-types'

function ListItems({ items, ordered, nested }: { items: LegalListItem[]; ordered: boolean; nested?: boolean }) {
  const children = items.map((item, i) => (
    <li key={i}>
      {item.text}
      {item.subItems && item.subItems.length > 0 && (
        <ListItems items={item.subItems} ordered={false} nested />
      )}
    </li>
  ))

  if (ordered) {
    return <ol className="list-decimal space-y-1 pl-5">{children}</ol>
  }
  return <ul className={nested ? 'mt-1 list-disc space-y-1 pl-5' : 'list-disc space-y-1 pl-5'}>{children}</ul>
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="text-muted-foreground">{block.text}</p>
    case 'orderedList':
      return <ListItems items={block.items ?? []} ordered />
    case 'unorderedList':
      return <ListItems items={block.items ?? []} ordered={false} />
    case 'table':
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-muted-foreground">
            <thead>
              <tr className="border-b border-gray-300 text-foreground">
                {block.table?.headers.map((h, i) => (
                  <th key={i} className="py-2 pr-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.table?.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-gray-200">
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-2 pr-4">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    default:
      return null
  }
}

interface LegalDocumentViewProps {
  docType: 'terms' | 'privacy'
  crossLinkHref: string
  crossLinkLabel: string
}

export function LegalDocumentView({ docType, crossLinkHref, crossLinkLabel }: LegalDocumentViewProps) {
  const [doc, setDoc] = useState<LegalDocument | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetcher = docType === 'terms' ? api.getTerms() : api.getPrivacy()
    fetcher
      .then(setDoc)
      .catch((err) => setError(err instanceof Error ? err.message : '문서를 불러오지 못했습니다.'))
  }, [docType])

  return (
    <div className="min-h-screen bg-gray-100 pb-20 pt-8">
      <div className="mx-auto w-full max-w-3xl px-4">
        <RunmarketLogo variant="on-light" size="lg" className="mb-6" />

        <article className="rounded-lg border border-gray-300 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
          {!doc && !error && (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              불러오는 중...
            </div>
          )}

          {error && <p className="py-16 text-center text-sm text-muted-foreground">{error}</p>}

          {doc && (
            <>
              <h1 className="mb-2 text-2xl font-bold text-foreground">{doc.title}</h1>
              <p className="mb-8 text-sm text-muted-foreground">시행일: {doc.effectiveDate}</p>

              <div className="space-y-8 text-sm leading-relaxed text-foreground">
                {doc.sections.map((section, si) => (
                  <section key={si}>
                    {section.heading && (
                      <h2 className="mb-2 text-base font-semibold">{section.heading}</h2>
                    )}
                    <div className="space-y-2">
                      {section.blocks.map((block, bi) => (
                        <Block key={bi} block={block} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </>
          )}
        </article>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link href="/" className="font-medium text-blue-600 hover:underline">
            ← 홈으로
          </Link>
          <Link href={crossLinkHref} className="font-medium text-blue-600 hover:underline">
            {crossLinkLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}
