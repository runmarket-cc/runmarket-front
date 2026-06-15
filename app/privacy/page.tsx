import type { Metadata } from 'next'
import { LegalDocumentView } from '@/components/legal-document'

export const metadata: Metadata = {
  title: '개인정보처리방침 - 런마켓',
  description: '런마켓 개인정보처리방침',
}

export default function PrivacyPage() {
  return <LegalDocumentView docType="privacy" crossLinkHref="/terms" crossLinkLabel="이용약관 →" />
}
