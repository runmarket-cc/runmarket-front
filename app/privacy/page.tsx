import type { Metadata } from 'next'
import Link from 'next/link'
import { RunmarketLogo } from '@/components/runmarket-logo'

export const metadata: Metadata = {
  title: '개인정보처리방침 - 런마켓',
  description: '런마켓 개인정보처리방침',
}

const OPERATOR = {
  serviceName: '런마켓(RunMarket)',
  privacyEmail: 'gudrb963@gmail.com',
}

const EFFECTIVE_DATE = '2026년 6월 10일'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-100 pb-20 pt-8">
      <div className="mx-auto w-full max-w-3xl px-4">
        <RunmarketLogo variant="on-light" size="lg" className="mb-6" />

        <article className="rounded-lg border border-gray-300 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
          <h1 className="mb-2 text-2xl font-bold text-foreground">개인정보처리방침</h1>
          <p className="mb-8 text-sm text-muted-foreground">시행일: {EFFECTIVE_DATE}</p>

          <div className="space-y-8 text-sm leading-relaxed text-foreground">
            <section>
              <p className="text-muted-foreground">
                {OPERATOR.serviceName}(이하 &ldquo;서비스&rdquo;)의 운영자(이하 &ldquo;운영자&rdquo;)는
                「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 최소한으로 수집합니다.
                본 개인정보처리방침을 통하여 이용자의 개인정보가 어떠한 목적과 방식으로 처리되는지
                알려드립니다.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제1조 (수집하는 개인정보 항목 및 수집 방법)</h2>
              <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">필수 수집 항목</span>: 이메일 주소
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    <li>회원 식별, 로그인 및 이메일 인증을 위해 수집합니다.</li>
                    <li>
                      비밀번호는 로그인 인증을 위해 입력받되 복호화할 수 없는 형태(일방향 암호화)로만
                      저장되며, 운영자가 원문을 알 수 없습니다.
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium text-foreground">서비스 이용 과정에서 생성되는 정보</span>:
                  관심 대회 저장(찜) 내역
                </li>
                <li>
                  <span className="font-medium text-foreground">자동으로 수집되는 정보</span>:
                  서비스 보안 및 안정적 운영 과정에서 접속 IP 주소, 쿠키, 접속 일시 등이 자동으로
                  수집·처리될 수 있습니다.
                </li>
              </ol>
              <p className="mt-3 text-muted-foreground">
                운영자는 위 항목 외에 이름, 전화번호, 주소, 결제정보 등 별도의 개인정보를 수집하지
                않습니다. 수집 방법은 회원가입·서비스 이용 시 이용자가 직접 입력하거나, 서비스 이용
                과정에서 자동으로 생성·수집되는 방식입니다.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제2조 (개인정보의 처리 목적)</h2>
              <p className="mb-2 text-muted-foreground">운영자는 수집한 개인정보를 다음의 목적으로만 처리합니다.</p>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>회원 식별 및 본인 확인, 회원제 서비스 제공</li>
                <li>이메일 인증을 통한 가입 의사 확인 및 부정 가입 방지</li>
                <li>관심 대회 저장(찜) 기능 제공</li>
                <li>고객 문의 접수 및 처리</li>
                <li>부정 이용 방지 및 서비스의 안정적 운영·보안</li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제3조 (개인정보의 보유 및 이용 기간)</h2>
              <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
                <li>
                  운영자는 이용자의 개인정보를 회원 탈퇴 시까지 보유하며, 회원 탈퇴 시 지체 없이
                  파기합니다.
                </li>
                <li>
                  다만 관련 법령에 따라 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안
                  보관합니다.
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    <li>웹사이트 방문 기록(접속 로그, 접속 IP 등): 3개월 (통신비밀보호법)</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제4조 (개인정보의 제3자 제공)</h2>
              <p className="text-muted-foreground">
                운영자는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 이용자가 사전에
                동의하거나, 법령의 규정에 의하여 수사기관 등이 법령에 정해진 절차와 방법에 따라 요구하는
                경우에는 예외로 합니다.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제5조 (개인정보 처리의 위탁 및 국외 이전)</h2>
              <p className="mb-2 text-muted-foreground">
                운영자는 서비스 운영을 위하여 아래의 외부 서비스를 이용하고 있으며, 이 과정에서
                접속 IP·쿠키 등 일부 정보가 해외 서버로 이전·처리될 수 있습니다.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs text-muted-foreground">
                  <thead>
                    <tr className="border-b border-gray-300 text-foreground">
                      <th className="py-2 pr-4 font-semibold">제공자 (국가)</th>
                      <th className="py-2 pr-4 font-semibold">이용 목적</th>
                      <th className="py-2 pr-4 font-semibold">이전 항목</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4">Vercel Inc. (미국)</td>
                      <td className="py-2 pr-4">서비스 호스팅 및 이용 통계 분석</td>
                      <td className="py-2 pr-4">접속 IP, 쿠키, 접속 기록</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4">Cloudflare, Inc. (미국)</td>
                      <td className="py-2 pr-4">봇 차단 등 보안 인증 및 네트워크 보안</td>
                      <td className="py-2 pr-4">접속 IP, 쿠키, 기기·브라우저 정보</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-muted-foreground">
                이전 일시 및 방법은 서비스 이용 시점에 정보통신망을 통하여 수시로 이전됩니다.
                이용자는 운영자에게 연락하여 국외 이전을 거부할 수 있으나, 이 경우 회원가입 및 서비스
                이용이 제한될 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제6조 (정보주체의 권리·의무 및 행사 방법)</h2>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>
                  이용자는 언제든지 자신의 개인정보에 대한 열람·정정·삭제·처리정지를 요구할 수
                  있습니다.
                </li>
                <li>
                  회원은 마이페이지의 회원 탈퇴 기능을 통하여 직접 회원 탈퇴(개인정보 삭제)를 할 수
                  있으며, 그 밖의 권리 행사는 아래 연락처로 요청할 수 있습니다. 운영자는 지체 없이
                  필요한 조치를 취합니다.
                </li>
                <li>
                  만 14세 미만 아동의 회원가입은 허용하지 않으며, 운영자는 만 14세 미만 아동의
                  개인정보를 수집하지 않습니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제7조 (개인정보의 파기 절차 및 방법)</h2>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>
                  운영자는 개인정보의 처리 목적이 달성되거나 보유 기간이 경과한 경우 지체 없이 해당
                  개인정보를 파기합니다.
                </li>
                <li>
                  전자적 파일 형태로 저장된 개인정보는 복구·재생이 불가능한 방법으로 영구 삭제합니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제8조 (개인정보의 안전성 확보 조치)</h2>
              <p className="mb-2 text-muted-foreground">
                운영자는 개인정보의 안전성 확보를 위하여 다음과 같은 조치를 취하고 있습니다.
              </p>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>비밀번호의 일방향 암호화 저장 및 전송 구간 암호화(SSL/TLS) 적용</li>
                <li>개인정보에 대한 접근 권한 관리 및 접근 통제</li>
                <li>봇 차단 등 비인가 접근을 막기 위한 보안 인증 수단 운영</li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제9조 (쿠키 등 자동 수집 장치의 운영 및 거부)</h2>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>
                  서비스는 로그인 유지 및 이용 통계 분석 등을 위하여 쿠키(cookie)를 사용할 수
                  있습니다.
                </li>
                <li>
                  이용자는 웹 브라우저 설정을 통하여 쿠키 저장을 거부할 수 있습니다. 다만 쿠키 저장을
                  거부하는 경우 로그인 유지 등 일부 서비스 이용에 어려움이 있을 수 있습니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제10조 (개인정보 보호책임자 및 문의)</h2>
              <p className="mb-2 text-muted-foreground">
                개인정보 처리에 관한 문의, 불만 처리, 피해 구제 등에 관한 사항은 아래로 연락하실 수
                있습니다.
              </p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>개인정보 보호책임자: 런마켓 운영자</li>
                <li>
                  연락처:{' '}
                  <a href={`mailto:${OPERATOR.privacyEmail}`} className="text-blue-600 hover:underline">
                    {OPERATOR.privacyEmail}
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold">제11조 (권익침해 구제 방법)</h2>
              <p className="mb-2 text-muted-foreground">
                이용자는 개인정보 침해로 인한 분쟁 해결이나 상담이 필요한 경우 아래 기관에 문의할 수
                있습니다.
              </p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>개인정보 분쟁조정위원회: (국번 없이) 1833-6972 / www.kopico.go.kr</li>
                <li>개인정보침해 신고센터: (국번 없이) 118 / privacy.kisa.or.kr</li>
                <li>경찰청 사이버수사국: (국번 없이) 182 / ecrm.police.go.kr</li>
              </ul>
            </section>

            <section className="border-t border-gray-200 pt-6">
              <h2 className="mb-2 text-base font-semibold">제12조 (개인정보처리방침의 변경)</h2>
              <p className="text-muted-foreground">
                이 개인정보처리방침은 {EFFECTIVE_DATE}부터 적용됩니다. 내용이 추가·삭제·수정되는 경우
                변경 사항의 시행 7일 전(이용자에게 불리한 변경의 경우 30일 전)부터 서비스 화면을 통하여
                고지하겠습니다.
              </p>
            </section>
          </div>
        </article>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link href="/" className="font-medium text-blue-600 hover:underline">
            ← 홈으로
          </Link>
          <Link href="/terms" className="font-medium text-blue-600 hover:underline">
            이용약관 →
          </Link>
        </div>
      </div>
    </div>
  )
}
