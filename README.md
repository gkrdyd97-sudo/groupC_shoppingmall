# RNDO — 러닝기어 편집샵

러너를 위한 러닝 기어(의류/신발/잡화)를 큐레이션해서 판매하는 쇼핑몰입니다.

> 팀명: 할수있조 | 4인 팀 프로젝트

## 배포 링크

> 추후 업데이트 예정

## 스크린샷

> 추후 업데이트 예정 (홈 화면, 상품 상세, 장바구니, 결제 화면 캡처 추가)

## 프로젝트 소개

- **기간**: 2026.10.13 ~ 2026.10.23 (11일)
- **구성**: Phase 1(정적 UI, 10/13~10/16) → Phase 2(Supabase 연동 + 토스 결제, 10/17~10/23)
- Next.js App Router 기반으로, 서버 컴포넌트(RSC)와 Server Actions만으로 데이터를 다루는 **No-API-Route 아키텍처**를 지향했습니다.

## 주요 기능

- 회원가입 / 로그인 (Supabase Auth)
- 마이페이지 (주문 내역 조회, 회원 정보 수정)
- 카테고리 탐색 (중첩 카테고리 GNB 드롭다운)
- 상품 목록 / 상품 상세
- 장바구니 (수량 변경, 삭제, 합계 계산)
- 주문서 작성 및 토스페이먼츠 결제 연동
- 주문 완료/실패 처리 및 주문 상세(영수증) 조회
- 관리자 페이지 (상품/카테고리/게시판 관리)

## Stacks 🐱

### Environment

![VS Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

### Config

![npm](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)

### Development

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Toss Payments](https://img.shields.io/badge/Toss%20Payments-0064FF?style=for-the-badge&logo=tosspayments&logoColor=white)

### Communication

![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)

## 팀원 & 역할 분담

| 이름 | 역할 | 담당 Task |
| --- | --- | --- |
| 정학용 (리더) | Git 관리, 인증·회원 관리, user | 로그인/회원가입 페이지, 마이페이지(주문내역, 정보 수정) |
| 김민지 | main | 메인페이지 / Header, Footer, Nav 공통 컴포넌트 |
| 김태양 | pay, cart | 주문서/결제 페이지, 장바구니 페이지(수량 변경, 삭제, 합계 계산) |
| 서종찬 | product | 상품 목록 페이지 / 상품 상세 페이지 |

## 트러블슈팅 & 회고

각자 겪은 기술적 문제와 해결 과정, 회고는 아래 문서에서 확인할 수 있습니다.

| 이름 | 문서 |
| --- | --- |
| 정학용 | [docs/troubleshooting/정학용.md](docs/troubleshooting/정학용.md) |
| 김민지 | [docs/troubleshooting/김민지.md](docs/troubleshooting/김민지.md) |
| 김태양 | [docs/troubleshooting/김태양.md](docs/troubleshooting/김태양.md) |
| 서종찬 | [docs/troubleshooting/서종찬.md](docs/troubleshooting/서종찬.md) |

## 실행 방법

```bash
# 1. 패키지 설치
npm install

# 2. 환경변수 설정 (.env.local)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 폴더 구조

```
app/
├── (shop)/        # 쇼핑몰 공통 레이아웃 Route Group
│   ├── (auth)/      # 로그인/회원가입
│   ├── products/    # 상품 목록/상세
│   ├── cart/        # 장바구니
│   ├── checkout/    # 주문/결제
│   ├── orders/      # 주문 상세
│   └── mypage/      # 마이페이지
├── admin/         # 관리자 대시보드
└── (mobile)/      # 모바일 전용 라우트

domains/           # 도메인별 비즈니스 로직 (actions/components/queries/types)
shared/            # 공통 컴포넌트, 유틸리티, Supabase 클라이언트
```
