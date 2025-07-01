# 프로젝트 구조 설명


| 경로                               | 목적                                     |
|----------------------------------|----------------------------------------|
| app/                             | Next.js 라우트 및 페이지, 레이아웃, 관리 백오피스 UI    |
| app/api/                         | Next.js api 라우트                        |
| app/api/server                   | Next.js 서버 내에서만 호출되는 내부 API (API 키 필수) |
| app/api/client                   | 전체적으로 호출되는 API                         |
| app/api/_utils                   | api에 사용되는 공통 유틸 함수들                    |
| app/api/auth                     | Auth.js 용 예약 API                       |
| app/server/\*\*, app/client/\*\* | REST API에 맞는 경로 ( `me/` -> 세션 기반 API)  |
| app/legal                        | 이용약관 및 개인정보처리 페이지                      |
| app/\*\*                         | 각각의 페이지 |
| components/                      | 공통 컴포넌트 |
| const/                           | 공통 상수 |
| data-access/                     | MongoDB 접근 함수 |
| fetch/                           | fetch 함수 집합|
| hook/                            | 공통 hook|
| lib/                             | 클래스 또는 인스턴스 또는 외부 통신 함수 |
| services/                        | 시나리오 또는 비지니스에 따른 함수 집합|
| store/                           | 전역 상태|
| utils/                           | 공통 유틸 함수 집합|
| validation/                      | 데이터 검증 함수 집합|
