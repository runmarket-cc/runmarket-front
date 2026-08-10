# 🌐 RunMarket Front (`runmarket-front`)

> **RunMarket 서비스 공식 웹 플랫폼 (`https://runmarket.cc`)**  
> Next.js (App Router) 기반으로 러너 회원가입, Cloudflare Turnstile 보안 인증, 마라톤/레이스 대회 정보 탐색(Leaflet 지도 뷰어), 개인 러닝 히스토리 분석(Recharts) 및 관리자 대시보드를 제공하는 웹 프론트엔드입니다.

---

## 🌐 RunMarket 생태계 & 연관 프로젝트

`runmarket-front`는 사용자가 계정을 생성하고 마라톤 레이스 정보 및 러닝 기록을 웹에서 확인할 수 있도록 지원하는 프론트엔드 포털입니다.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      runmarket-front (Web Frontend)                     │
│                        https://runmarket.cc                             │
│                                                                         │
│  - Next.js 16 (App Router) / React 19 / Tailwind CSS v4                 │
│  - 사용자 회원가입 (/signup) 및 Turnstile CAPTCHA 보안 인증            │
│  - 마라톤 대회 검색 & Leaflet 인터랙티브 지도 뷰어 (/races)              │
│  - Recharts 기반 마이페이지 러닝 데이터 통계 (/mypage, /mypage/runs)    │
│  - 관리자 레이스 등록/수정/삭제 콘솔 (/admin)                           │
│  - 앱스토어/플래이스토어 제출용 약관 (/terms, /privacy)                 │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                   HTTP REST API │ (https://api.runmarket.cc)
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          pacer (Backend Service)                        │
│                     Spring Boot / Kotlin 백엔드 API                     │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                        인증 세션 공유 & 실시간 트래킹
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          runmarket-app (Mobile App)                     │
│               러너 GPS 실시간 위치 공유 & 관전 모바일 앱                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 각 프로젝트별 상세 역할 (Project Roles & Responsibilities)

RunMarket 전체 생태계 내 4개 핵심 프로젝트의 역할 및 구체적 담당 기능은 다음과 같습니다.

| 프로젝트명 | 경로 / 도메인 | 주요 역할 & 담당 기능 |
|---|---|---|
| **`runmarket-front`** | `/runmarket/runmarket-front`<br>`https://runmarket.cc` | **웹 플랫폼 & 회원가입 전용 포털 (Next.js)**<br>• 신규 사용자 회원가입 및 계정 생성 관리 (모바일 앱 전용 로그인 계정 생성)<br>• Cloudflare Turnstile CAPTCHA 위젯을 통한 가입 및 비밀번호 재설정 보안 검증<br>• 마라톤/레이스 대회 조회 & Leaflet 인터랙티브 지도 탐색<br>• Recharts 차트 기반 마이페이지 러닝 기록 및 통계 분석<br>• 관리자 레이스 등록/수정/삭제 콘솔 및 스토어 제출용 법적 약관 문서 제공 |
| **`runmarket-app`** | `/runmarket/runmarket-app`<br>`cc.runmarket.app` | **크로스플랫폼 모바일 앱 (iOS/Android)**<br>• 러너(RUNNER): GPS 위치/페이스 수집 및 백엔드로 실시간 전송<br>• 관전자(SPECTATOR): 지도 위 러너 위치 및 이동 동선 실시간 라이브 트래킹<br>• iOS Dynamic Island / 잠금 화면 Live Activity 실시간 현황 표시<br>• Apple HealthKit 운동 자동 동기화 & SQLite 오프라인 기록 저장 |
| **`pacer`** | `/runmarket/pacer`<br>`api.runmarket.cc`<br>`pulse.runmarket.cc` | **백엔드 핵심 코어 API & WebSocket 중계 서버**<br>• REST API: 회원 로그인, 인증 토큰(JWT) 발급, 레이스/달리기 기록 CRUD<br>• WebSocket Broker: 러너의 위치 메세지를 실시간 수신 및 관전자 채널로 브로드캐스트<br>• 보안 & 권한 제어: Turnstile 캡차 검증, 소켓 엑세스 토큰 발급 및 검증<br>• Spring Boot 멀티모듈 (`web`, `socket`, `domain`, `infrastructure`, `batch`, `event-bus`) |
| **`iac`** | `/iac`<br>`Kubernetes Cluster` | **클라우드 인프라 & K8s 배포 매니페스트 (Infrastructure as Code)**<br>• Kubernetes Helm Chart (`helm/runmarket`)를 통한 백엔드 배포 자동화<br>• PostgreSQL 17 DB 컨테이너 배포 및 Persistent Volume 스토리지 관리<br>• Nginx Ingress 컨트롤러 설정 (도메인 라우팅, SSL/TLS 패스스루, 헬스체크)<br>• K8s Secret 관리 (JWT 암호화 키, DB 계정 정보 등) |

---

## ✨ 주요 기능 (Key Features)

1. **🛡️ Cloudflare Turnstile 회원가입 & 이메일 인증**
   - 신규 러너 계정 생성(`POST /api/v1/auth/register`) 시 Cloudflare Turnstile CAPTCHA를 이용한 봇 방지 보안 검증
   - 이메일 인증 핀/토큰 확인(`PATCH /api/v1/auth/verify`), 비밀번호 재설정(`POST/PATCH /api/v1/auth/password-reset`)

2. **🗺️ 마라톤/레이스 대회 조회 & Leaflet 지도 탐색**
   - 전국 주요 마라톤 대회 목록 및 상세 정보 제공 (`/races`, `/races/[id]`)
   - `leaflet` 지도 뷰어를 통한 대회 코스 및 개최지 인터랙티브 위치 안내
   - 관심 있는 마라톤 대회 좋아요 및 스크랩 기능 (`POST/DELETE /api/v1/races/{id}/like`)

3. **📊 마이페이지 & Recharts 러닝 통계 분석**
   - 사용자 개인 프로필 관리 및 좋아요한 대회 모아보기 (`/mypage`)
   - `recharts` 기반 러닝 거리, 페이스, 구간 기록 대시보드 및 상세 기록 조회 (`/mypage/runs`)
   - 회원 탈퇴 기능 (`DELETE /api/v1/users/me`)

4. **⚙️ 관리자 대시보드 (Admin Console)**
   - 관리자 전용 인증 및 레이스 관리 콘솔 (`/admin`, `/admin/races`)
   - 대회 일정, 개최지, 상세 코스 정보 등록/수정/삭제 (`/admin/races/register`)

5. **📜 앱 스토어 심사용 법적 고지 문서**
   - 모바일 앱스토어(App Store / Google Play) 심사에 필수적인 법적 고지 페이지 제공
   - 이용약관 (`/terms`), 개인정보처리방침 (`/privacy`)

---

## 🛠️ 기술 스택 (Tech Stack)

| 구분 | 기술 / 라이브러리 |
|---|---|
| **Framework** | Next.js `16.1` (App Router), React `19.2` |
| **Language** | TypeScript `5.7` |
| **Styling & Design** | Tailwind CSS `v4`, Radix UI (Shadcn UI), Lucide React |
| **Maps & Charts** | Leaflet (`leaflet`), Recharts `2.15` |
| **Form & Validation** | React Hook Form `7.54`, Zod `3.24`, `@hookform/resolvers` |
| **UI Components** | Sonner (Toast), Embla Carousel, Vaul Drawer |
| **Analytics** | Vercel Analytics |
| **Package Manager** | `pnpm` (또는 `npm`) |

---

## 📁 디렉토리 구조 (Directory Structure)

```
runmarket-front/
├── app/                          # Next.js App Router 파일 기반 라우팅
│   ├── (auth)/                   # 인증 관련 라우트
│   │   ├── login/                # 로그인 페이지 (/login)
│   │   ├── signup/               # 회원가입 페이지 (/signup)
│   │   ├── verify/               # 이메일 인증 확인 (/verify)
│   │   ├── forgot-password/      # 비밀번호 찾기 (/forgot-password)
│   │   └── reset-password/       # 비밀번호 재설정 (/reset-password)
│   ├── races/                    # 마라톤 대회 탐색 & 상세 (/races)
│   ├── mypage/                   # 마이페이지 및 러닝 히스토리 (/mypage, /mypage/runs)
│   ├── admin/                    # 관리자 대시보드 (/admin)
│   ├── terms/                    # 이용약관 페이지 (/terms)
│   ├── privacy/                  # 개인정보처리방침 페이지 (/privacy)
│   ├── layout.tsx                # 루트 레이아웃 & 테이밍 프로바이더
│   └── page.tsx                  # 웹 서비스 메인 랜딩 페이지
├── components/                   # UI 컴포넌트 (Shadcn UI, 지도, 차트, 네비게이션)
├── lib/                          # 공통 유틸리티 & API 클라이언트
│   ├── api.ts                    # REST API 통신 클라이언트 (Fetch API)
│   ├── api-types.ts              # 백엔드 API 응답/요청 타입 정의
│   └── auth.ts                   # 브라우저 토큰 및 세션 관리 유틸
├── public/                       # 정적 리소스 (이미지, 아이콘 등)
└── package.json                  # 프로젝트 의존성 및 패키지 설정
```

---

## 🚀 개발 환경 세팅 & 실행 (Getting Started)

### 1. 의존성 패키지 설치
```bash
pnpm install
# 또는
npm install
```

### 2. 개발 서버 실행
```bash
pnpm dev
# 또는
npm run dev
```
브라우저에서 `http://localhost:3000` 접속 후 결과를 확인할 수 있습니다.

### 3. 프로덕션 빌드 & 실행
```bash
# Next.js 앱 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

---

## 🌿 Git 브랜치 작업 가이드

본 프로젝트는 `upstream/main` 브랜치를 기준으로 기능 개발 브랜치를 생성하여 작업합니다.

```bash
# 최신 upstream 변경사항 동기화 및 작업 브랜치 생성
git fetch upstream
git checkout -b docs/add-readme upstream/main

# 변경사항 커밋 및 push
git add README.md
git commit -m "docs: runmarket-front README.md 작성 및 연관 프로젝트 구조 명시"
git push -u origin docs/add-readme
```

---

## 📄 라이선스 (License)

본 프로젝트는 RunMarket 서비스 웹 플랫폼 시스템입니다.
