import type { Metadata } from 'next'
import { LegalDocumentView } from '@/components/legal-document'

export const metadata: Metadata = {
  title: '이용약관 - 런마켓',
  description: '런마켓 서비스 이용약관',
}

export default function TermsPage() {
  return <LegalDocumentView docType="terms" crossLinkHref="/privacy" crossLinkLabel="개인정보처리방침 →" />
}
