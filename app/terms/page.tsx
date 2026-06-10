import type { Metadata } from 'next'
import Link from 'next/link'
import { RunmarketLogo } from '@/components/runmarket-logo'

export const metadata: Metadata = {
  title: '이용약관 - 런마켓',
  description: '런마켓 서비스 이용약관',
}

const OPERATOR = {
  serviceName: '런마켓(RunMarket)',
  contactEmail: 'gudrb963@gmail.com',
}

const EFFECTIVE_DATE = '2026년 6월 10일'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-100 pb-20 pt-8">
      <div className="mx-auto w-full max-w-3xl px-4">
        <RunmarketLogo variant="on-light" size="lg" className="mb-6" />

        <article className="rounded-lg border border-gray-300 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
          <h1 className="mb-2 text-2xl font-bold text-foreground">이용약관</h1>
          <p className="mb-8 text-sm text-muted-foreground">시행일: {EFFECTIVE_DATE}</p>

          <div className="space-y-8 text-sm leading-relaxed text-foreground">
            <section>
              <h2 className="mb-2 text-base font-semibold">제1조 (목적)</h2>
              <p className="text-muted-foreground">
                이 약관은 {OPERATOR.serviceName}(이하 &ldquo;서비스&rdquo;)을 운영하는 운영자(이하
                &ldquo;운영자&rdquo;)와 이용자 간의 권리·의무 및 책임사항, 서비스 이용조건 및 절차 등
                기본적인 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제2조 (정의)</h2>
              <p className="mb-2 text-muted-foreground">이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>
                  &ldquo;서비스&rdquo;란 운영자가 제공하는 마라톤·러닝 등 각종 대회 정보의 검색·조회,
                  관심 대회 저장(찜) 등 일체의 서비스를 의미합니다.
                </li>
                <li>
                  &ldquo;이용자&rdquo;란 이 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.
                </li>
                <li>
                  &ldquo;회원&rdquo;이란 이메일을 제공하여 회원등록을 한 자로서, 서비스를 계속적으로
                  이용할 수 있는 자를 말합니다.
                </li>
                <li>
                  &ldquo;대회 주최자&rdquo;란 서비스에 게재된 대회를 실제로 개최·운영하며, 참가
                  신청·접수·결제를 직접 처리하는 제3의 주체를 말합니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제3조 (약관의 게시와 개정)</h2>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>
                  운영자는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 화면을 통하여
                  게시합니다.
                </li>
                <li>
                  운영자는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있으며, 개정 시
                  적용일자 및 개정사유를 명시하여 적용일자 7일 전부터(이용자에게 불리한 변경의 경우
                  30일 전부터) 서비스 화면에 공지합니다.
                </li>
                <li>
                  이용자가 개정 약관에 동의하지 않는 경우 이용계약을 해지(회원 탈퇴)할 수 있으며,
                  공지된 적용일자 이후에도 서비스를 계속 이용하는 경우 개정 약관에 동의한 것으로
                  봅니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제4조 (회원가입 및 이용계약의 성립)</h2>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>
                  이용계약은 이용자가 이 약관 및 개인정보처리방침에 동의하고 이메일·비밀번호를 입력한
                  후 이메일 인증을 완료함으로써 성립합니다.
                </li>
                <li>
                  운영자는 다음 각 호에 해당하는 경우 가입 신청을 승낙하지 않거나 사후에 이용계약을
                  해지할 수 있습니다.
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    <li>타인의 정보를 도용하거나 허위의 정보를 기재한 경우</li>
                    <li>이미 가입된 이메일로 중복하여 가입을 신청한 경우</li>
                    <li>관련 법령을 위반하거나 서비스 운영을 방해할 목적으로 신청한 경우</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제5조 (회원 정보의 관리)</h2>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>회원은 이메일·비밀번호 등 계정 정보를 선량한 관리자의 주의로 관리하여야 합니다.</li>
                <li>
                  회원은 자신의 계정 정보를 제3자에게 양도하거나 대여할 수 없으며, 계정이 도용되었음을
                  인지한 경우 즉시 운영자에게 통지하고 안내에 따라야 합니다.
                </li>
                <li>
                  제2항의 통지를 하지 않거나 통지 후 운영자의 안내에 따르지 않아 발생한 불이익에
                  대하여 운영자는 책임을 지지 않습니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제6조 (서비스의 내용)</h2>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>
                  운영자는 이용자에게 마라톤·러닝 등 대회의 명칭, 일정, 장소, 종목(거리), 접수 상태,
                  공식 홈페이지 링크 등 대회 관련 정보를 검색·조회할 수 있는 서비스를 제공합니다.
                </li>
                <li>회원은 관심 있는 대회를 저장(찜)하고 마이페이지에서 이를 조회할 수 있습니다.</li>
                <li>
                  <strong className="text-foreground">
                    운영자는 대회 정보를 수집·정리하여 제공하는 정보 매개자일 뿐, 서비스에 게재된
                    대회를 직접 주최·운영하지 않습니다.
                  </strong>{' '}
                  대회 참가 신청·접수·결제·환불 등은 각 대회 주최자가 운영하는 공식 홈페이지 등
                  외부 채널에서 이루어지며, 운영자는 그 거래의 당사자가 아닙니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제7조 (서비스의 제공 및 변경·중단)</h2>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.</li>
                <li>
                  운영자는 다음 각 호의 경우 서비스의 전부 또는 일부를 제한하거나 중단할 수 있습니다.
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    <li>설비의 보수·점검 또는 시스템 장애가 발생한 경우</li>
                    <li>천재지변, 정전, 통신망 두절 등 불가항력적 사유가 있는 경우</li>
                    <li>외부 서비스 제공자(호스팅·인증 등)의 장애가 있는 경우</li>
                    <li>그 밖에 운영자의 운영상·기술상 필요에 의한 경우</li>
                  </ul>
                </li>
                <li>
                  서비스는 운영자의 사정에 따라 변경되거나 종료될 수 있으며, 이 경우 운영자는 사전에
                  공지하도록 노력합니다. 다만 무료로 제공되는 서비스의 특성상 부득이한 경우 사후에
                  공지할 수 있습니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제8조 (이용자의 의무)</h2>
              <p className="mb-2 text-muted-foreground">이용자는 다음 각 호의 행위를 하여서는 안 됩니다.</p>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>타인의 정보를 도용하거나 허위 사실을 등록하는 행위</li>
                <li>서비스에 게재된 정보를 무단으로 복제·배포하거나 상업적으로 이용하는 행위</li>
                <li>
                  자동화된 수단(봇, 크롤러, 스크래퍼 등)을 이용하여 서비스에 비정상적으로 접근하거나
                  대량의 정보를 수집하는 행위
                </li>
                <li>운영자 및 제3자의 지식재산권, 명예, 그 밖의 권리를 침해하는 행위</li>
                <li>서비스의 안정적 운영을 방해하는 행위</li>
                <li>그 밖에 관련 법령 또는 이 약관에 위배되는 행위</li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제9조 (저작권 및 지식재산권)</h2>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>
                  서비스에 게재된 디자인, 상표, 로고, 소프트웨어 및 운영자가 정리·제공한 정보에 대한
                  저작권 및 지식재산권은 운영자 또는 정당한 권리자에게 귀속됩니다.
                </li>
                <li>
                  이용자는 운영자의 사전 동의 없이 제1항의 정보를 복제·전송·배포 기타 방법으로
                  영리 목적에 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제10조 (이용계약의 해지 및 이용제한)</h2>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>
                  회원은 언제든지 마이페이지의 회원 탈퇴 기능을 통하여 이용계약을 해지할 수 있으며,
                  탈퇴 시 회원의 개인정보는 개인정보처리방침에 따라 지체 없이 파기됩니다.
                </li>
                <li>
                  회원이 이 약관 또는 관련 법령을 위반하는 경우, 운영자는 서비스 이용을 제한하거나
                  이용계약을 해지할 수 있습니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제11조 (책임의 제한)</h2>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>
                  운영자는 서비스에 게재된 대회 정보의 정확성·완전성·최신성을 확보하기 위하여 노력하나,
                  해당 정보는 대회 주최자가 제공·변경하는 내용에 기초합니다. 따라서 대회의 일정·장소·
                  종목·참가비·접수 상태 등이 실제와 다를 수 있으며,{' '}
                  <strong className="text-foreground">
                    이용자는 참가 신청 전 반드시 각 대회 공식 홈페이지에서 최종 정보를 확인하여야
                    합니다.
                  </strong>
                </li>
                <li>
                  운영자는 대회의 개최·취소·연기·변경, 참가 신청·결제·환불, 대회 진행 중 발생한 사고나
                  분쟁 등 대회 주최자와 이용자 간에 발생하는 일체의 문제에 대하여 책임을 지지 않습니다.
                </li>
                <li>
                  운영자는 천재지변, 불가항력, 이용자의 귀책사유, 제3자(외부 서비스 제공자 포함)의
                  귀책사유로 서비스를 제공할 수 없는 경우 그에 대한 책임이 면제됩니다.
                </li>
                <li>
                  서비스는 무료로 제공되며, 운영자는 관련 법령에 특별한 규정이 없는 한 무료 서비스의
                  이용과 관련하여 책임을 지지 않습니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제12조 (준거법 및 재판관할)</h2>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>운영자와 이용자 간에 발생한 분쟁에 관하여는 대한민국 법령을 준거법으로 합니다.</li>
                <li>
                  서비스 이용과 관련한 분쟁에 관한 소송은 「민사소송법」에 따른 관할 법원을 제1심
                  관할 법원으로 합니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제13조 (문의)</h2>
              <p className="text-muted-foreground">
                서비스 이용과 관련한 문의는 아래 이메일로 연락하실 수 있습니다.
                <br />
                <a href={`mailto:${OPERATOR.contactEmail}`} className="text-blue-600 hover:underline">
                  {OPERATOR.contactEmail}
                </a>
              </p>
            </section>

            <section className="border-t border-gray-200 pt-6">
              <h2 className="mb-2 text-base font-semibold">부칙</h2>
              <p className="text-muted-foreground">이 약관은 {EFFECTIVE_DATE}부터 시행합니다.</p>
            </section>
          </div>
        </article>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link href="/" className="font-medium text-blue-600 hover:underline">
            ← 홈으로
          </Link>
          <Link href="/privacy" className="font-medium text-blue-600 hover:underline">
            개인정보처리방침 →
          </Link>
        </div>
      </div>
    </div>
  )
}
