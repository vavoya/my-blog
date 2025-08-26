# sim-log
Next.js 15과 TypeScript 기반으로 만든 블로그 서비스 플랫폼입니다. 폴더·시리즈 개념과 창 기반 UI를 도입해 글을 쓰고 관리하는 과정을 효율적으로 돕는 것을 목표로 합니다

## 주요 기능
- 회원가입: Naver 로 회원가입 및 로그인이 가능합니다.
- 폴더/시리즈 분류: 포스트를 주제나 프로젝트별로 정리하고 연재물처럼 연결할 수 있습니다
- 창 기반 멀티태스킹: 데스크톱처럼 여러 작업 창을 띄워 동시에 관리합니다
- 마크다운 에디터: 마크다운 문법으로 빠르게 글을 작성하고 즉시 미리보기가 가능합니다

## 기술 스택
- Framework: Next.js 15, React 19
- Auth: NextAuth (Naver OAuth)
- Data: MongoDB, React Query, Zustand
- Testing: Vitest + Testing Library

## 프로젝트 구조
디렉터리별 역할은 `docs/PROJECT-STRUCTURE.md`에 정리되어 있습니다. 예를 들어 `app/`는 라우트와 관리용 UI, `data-access/`는 MongoDB 접근 함수, `services/`는 비즈니스 로직을 담당합니다
시작하기

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 실행
npm run start

# ESLint 검사
npm run lint

# 테스트 실행
npm test
```

## 테스팅
FE는 핵심 백오피스 시나리오 중심의 통합 테스트를, BE는 가능한 모든 함수에 대한 단위 테스트를 지향합니다. 진행 현황과 폴더 구조는 `docs/TESTING.md`를 참고하세요

## 기여 가이드
ESLint와 AirBnB 스타일을 기반으로 한 코드 컨벤션, 브랜치 전략, 한글 커밋 메시지 규칙 등이 `docs/CONTRIBUTING.md`에 정의돼 있습니다

## 연락처
질문이나 제안은 vavoya6324@gmail.com로 보내주세요