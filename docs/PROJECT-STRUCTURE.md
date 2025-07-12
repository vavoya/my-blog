# 프로젝트 구조 설명


| 경로                                      | 목적                                                     |
|-----------------------------------------|--------------------------------------------------------|
| app/                                    | Next.js 라우트 및 페이지, 레이아웃, 관리 백오피스 UI                    |
| app/api/                                | Next.js api 라우트                                        |
| app/api/cron                            | Vercel Cron 작업 API                                     |
| app/api/server                          | Next.js 서버 내에서만 호출되는 내부 API (API 키 필수)                 |
| app/api/client                          | 전체적으로 호출되는 API                                         |
| app/api/_utils                          | api에 사용되는 공통 유틸 함수들                                    |
| app/api/auth                            | Auth.js 용 예약 API                                       |
| app/server/\*\*, app/client/\*\*        | REST API에 맞는 경로 ( `me/` -> 세션 기반 API)                  |
| app/legal                               | 이용약관 및 개인정보처리 페이지                                      |
| app/\*\*                                | 각각의 페이지                                                |
| components/                             | 공통 컴포넌트                                                |
| const/                                  | 공통 상수                                                  |
| data-access/                            | MongoDB 접근 함수                                          |
| fetch/                                  | fetch 함수 집합                                            |
| hook/                                   | 공통 hook                                                |
| lib/                                    | 클래스 또는 인스턴스 또는 외부 통신 함수                                |
| services/                               | 시나리오 또는 비지니스에 따른 함수 집합                                 |
| store/                                  | 전역 상태                                                  |
| utils/                                  | 공통 유틸 함수 집합                                            |
| validation/                             | 데이터 검증 함수 집합                                           |
| [google-service-account-key.json](#google-service-account-key-service-account-keyjson) | 구글 클라우드 서비스 계정 정보 json (search console sitemap 갱신에 사용) |


## 세부 사항
### Google Service Account Key (`service-account-key.json`)

이 파일은 Google Cloud Platform 서비스 계정의 인증 키를 담고 있습니다.
Google Search Console API와 같은 Google Cloud 서비스를 백엔드에서 호출하는 데 사용됩니다.

**주의사항:**
* 이 파일은 **절대 Git 저장소에 커밋되어서는 안 됩니다.** (`.gitignore`에 추가되어 있습니다.)
* 이 파일의 내용물(`client_email`, `private_key`)은 프로젝트의 환경 변수(예: `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`)로 설정되어야 합니다.
* 자세한 설정 방법은 [Google Cloud 서비스 계정 문서](링크_필요시_추가)를 참조하세요.

**터미널에 아래의 명령어로 정상 동작 검증(개발서버)**
```curl
curl -H "Authorization: Bearer PqzKeZkf1mseYQcH" http://localhost:3000/api/cron/ping-sitemap
```