# ArtPrep MVP - 미대입시 실기자료 AI 큐레이션 플랫폼

- **프로젝트 이름**: ArtPrep
- **최초 작성일**: 2026-03-18
- **최종 수정일**: 2026-04-09
- **버전**: MVP (Phase 1) — 코드 현실 반영 보완판

---

## 1. 프로젝트 개요

### 한 줄 정의
미대입시 실기 참고작을 한곳에서 탐색/저장할 수 있는 핀터레스트형 갤러리 플랫폼

### 배경
미대입시생은 실기 참고작을 인스타그램, 핀터레스트, 학원 블로그 등 비정형 SNS에서 장시간 탐색하고 있으며, 참고작의 품질이나 합격 기준을 판단하기 어렵다. ArtPrep은 작품 자료를 학교/유형별로 구조화하여 신뢰성 있는 참고작 접근성을 높이고자 한다.

### 사용자 문제
- 비정형 SNS 탐색으로 참고작을 찾는 데 시간이 과도하게 소요됨
- 합격 수준의 참고작인지 판단하기 어려워 잘못된 레퍼런스를 채택하는 비율이 높음
- 학교/실기유형별 참고작 정보가 흩어져 단일한 신뢰 출처가 없음

### 해결 방식
- 작품 DB를 학교/실기유형/합격연도 등의 메타데이터로 구조화하여 필터/정렬 가능한 이미지 그리드 탐색 제공
- 마음에 드는 작품을 하트로 저장하고 저장 보드에서 모아보기 가능
- 비회원도 탐색은 허용하되, 저장 기능은 로그인 후 이용 (Supabase Auth)
- (선택) 사용자 프로필 기반으로 AI를 활용한 작품 추천 기능

### 타겟 사용자 및 역할

**사용자 역할 (4종)**
- **비회원**: 갤러리 탐색만 가능, 저장/업로드 불가
- **입시생 (student)**: 미대입시 준비생. 참고작 탐색, 저장, 업로드 가능
- **강사 (teacher)**: 미술학원 강사. 작품 공유, 학생 참고작 관리
- **학원 (academy)**: 미술학원 계정. 학원 소속 학생 작품 관리, 홍보

**주요 사용자**: 미대입시생 (B2C) — 10~20대(고3, 재수/반수 포함), 실기 준비를 병행하며 참고작을 탐색하는 학생

### 사용 시나리오

**입시생 시나리오**
1. 사이트에 접속해 갤러리 그리드에서 실기유형/학교/연도를 필터링하며 참고작을 탐색
2. 저장 기능을 사용하려면 이메일+비밀번호로 회원가입/로그인 진행
3. 마음에 드는 작품을 하트로 저장하고, 저장 보드에서 모아보며 학습에 활용
4. (선택) 프로필에 목표 학교/실기유형을 입력하고 AI 큐레이션으로 추천 작품 확인

**강사 시나리오**
1. 강사 계정으로 가입, 소속 학원과 전문 분야 입력
2. 학생들에게 보여줄 참고작을 찾아 저장/공유

**학원 시나리오**
1. 학원 계정으로 가입, 학원 이름과 지도 분야 입력
2. 학원 학생들의 우수 작품을 업로드하여 홍보

### 디바이스
데스크탑 웹 (우선), 모바일은 추후 개선

---

## 2. MVP 기능 목록

---

### 2.1 갤러리 탐색 (핀터레스트형 그리드 + 필터)
> **중요도**: 높음 | **구현 상태**: UI 완료, Supabase 연동 완료

작품을 이미지 그리드(Pinterest 스타일)로 표시하고, 필터를 통해 원하는 작품을 빠르게 찾을 수 있다.

**수용 기준**
- 실기유형/학교/연도 필터가 동작하고 조합 필터링이 가능하다
- 이미지 그리드(Masonry)로 목록이 노출된다
- 최신순 정렬이 동작한다
- 비회원도 탐색이 가능하다

**상세**
- 필터 항목: 대학교, 실기유형(art_type), 연도, 학생구분(academy_type: 현역/재수생/N수생)
- 그리드 레이아웃: CSS columns 기반 Masonry 스타일
- 작품 카드 표시 정보: 썸네일 이미지, 실기유형 뱃지(호버 시), 좋아요 버튼(호버 시), 제목, 대학교, 연도
- 작품 상세 모달: 큰 이미지, 제목, 대학교, 연도, 실기유형, 학생구분, 태그, 설명, 좋아요 수

**관련 파일**
- `src/pages/HomePage.jsx` — 갤러리 메인 페이지, Supabase 쿼리
- `src/components/FilterBar.jsx` — 필터 드롭다운
- `src/components/MasonryGrid.jsx` — 그리드 레이아웃
- `src/components/ArtworkCard.jsx` — 작품 카드
- `src/components/ArtworkDetailModal.jsx` — 작품 상세 모달

---

### 2.2 회원가입 / 로그인
> **중요도**: 높음 | **구현 상태**: 회원가입 UI 완료, Supabase Auth 미연동

Supabase Auth 기반 인증을 제공한다.

**수용 기준**
- 이메일+비밀번호로 회원가입/로그인/로그아웃이 가능하다
- 비회원은 갤러리 탐색만 가능하고, 저장 기능 사용 시 로그인 유도
- profiles 테이블은 본인만 접근 가능 (RLS)

**회원가입 플로우 (2단계)**

*Step 1: 인증 방법 선택 + 기본 정보*
- SSO 버튼 4종 (카카오, 네이버, Google, Apple) — UI 구현 완료, 백엔드 연동 대기
- 이메일 가입: 이름(필수), 이메일(필수), 비밀번호(필수, 8자 이상), 비밀번호 확인

*Step 2: 유저 타입 선택 + 상세 정보 + 약관*
- 회원 유형 선택: 입시생 / 강사 / 학원
- 공통 필드: 닉네임, 연락처
- 입시생 전용: 입시 연도, 수험 구분(현역/재수/N수), 지원 대학교, 지원 전공, 실기 유형(복수 선택), 소속 학원(선택)
- 강사 전용: 소속 학원, 전문 분야(복수 선택)
- 학원 전용: 학원 이름(필수), 지도 분야(복수 선택)
- 약관 동의: 이용약관(필수), 개인정보 수집 및 이용(필수), 마케팅 정보 수신(선택)

**관련 파일**
- `src/pages/SignupPage.jsx` — 2단계 회원가입 폼

---

### 2.3 하트/저장 기능
> **중요도**: 높음 | **구현 상태**: 클라이언트 UI 완료, DB 미연동 (useState만 사용)

작품에 하트를 눌러 저장하고, 저장 보드에서 모아볼 수 있다.

**수용 기준**
- 작품 카드에서 하트 버튼으로 저장/해제가 토글된다
- 저장 보드에서 내가 저장한 작품 목록을 확인할 수 있다
- 로그인한 사용자만 저장 기능을 사용할 수 있다

**상세**
- 하트 토글: INSERT(저장) / DELETE(해제)로 saved_items 테이블 연동
- 중복 저장 방지: UNIQUE(user_id, artwork_id) 제약
- 저장 보드: 저장한 작품을 그리드로 표시 (별도 페이지 필요)
- 좋아요 수: artworks.like_count 컬럼으로 denormalized 관리

---

### 2.4 AI 큐레이션 (선택 — 시간 허락 시)
> **중요도**: 중간 | **구현 상태**: 미구현

회원이 프로필(목표 학교, 실기유형)을 입력하면 AI가 추천 작품과 이유를 제공한다.

**수용 기준**
- 프로필 입력 후 큐레이션을 실행할 수 있다
- 추천 결과(작품 + 추천 이유)가 화면에 표시된다
- 로그인한 사용자만 사용 가능

**상세**
- Gemini API를 활용하여 작품 DB와 매칭 후 추천
- 결과는 화면에만 표시 (세션 저장/히스토리 기능 없음)
- 프로필 정보는 profiles 테이블의 데이터를 재사용

---

### 2.5 작품 업로드
> **중요도**: 중간 | **구현 상태**: UI 완료, Supabase Storage 미연동

로그인한 사용자가 작품 이미지와 메타데이터를 업로드할 수 있다.

**수용 기준**
- 이미지 파일(JPG, PNG, WebP, 최대 10MB)을 선택하고 미리보기가 가능하다
- 작품 정보(제목, 연도, 실기유형, 대학교, 학생구분, 태그, 설명)를 입력할 수 있다
- 업로드 완료 시 갤러리에 즉시 반영된다

**상세**
- 이미지 저장: Supabase Storage `artworks` 버킷 (공개)
- 메타데이터 저장: artworks 테이블 INSERT
- 접근 제어: 로그인한 사용자만 업로드 가능

**관련 파일**
- `src/components/UploadModal.jsx` — 업로드 폼 UI

---

## 3. 데이터 구조 (Supabase 테이블)

### 3.1 artworks (작품)

- **id**: BIGINT, PK, 자동증가 — 작품 고유 ID
- **title**: TEXT, NOT NULL — 작품 제목
- **description**: TEXT — 작품 설명
- **image**: TEXT, NOT NULL — 이미지 URL (Supabase Storage 공개 URL)
- **year**: INTEGER, NOT NULL — 합격 연도 (2024, 2023...)
- **art_type**: TEXT, NOT NULL — 실기유형 (기초디자인, 소묘, 발상과표현 등)
- **university**: TEXT, NOT NULL — 대학교명
- **academy_type**: TEXT — 현역 / 재수생 / N수생
- **tags**: TEXT[], DEFAULT '{}' — 태그 배열
- **like_count**: INTEGER, DEFAULT 0 — 좋아요 수 (denormalized)
- **uploaded_by**: UUID, FK -> auth.users — 업로드한 사용자 (NULL이면 관리자 등록)
- **created_at**: TIMESTAMPTZ, DEFAULT now() — 등록일

**권한 (RLS)**
- SELECT: 누구나 (anon + authenticated)
- INSERT: 로그인한 사용자만 (authenticated)

**인덱스**: university, art_type, year, created_at DESC

### 3.2 profiles (회원 프로필)

- **id**: UUID, PK, FK -> auth.users ON DELETE CASCADE — 사용자 ID
- **user_type**: TEXT, NOT NULL, DEFAULT 'student', CHECK ('student','teacher','academy') — 회원 유형
- **name**: TEXT — 실명
- **nickname**: TEXT — 닉네임
- **phone**: TEXT — 연락처
- **target_university**: TEXT — 지원 대학교 (입시생)
- **target_major**: TEXT — 지원 전공 (입시생)
- **target_year**: INTEGER — 입시 연도 (입시생)
- **current_status**: TEXT — 현역 / 재수 / N수 (입시생)
- **academy_name**: TEXT — 소속/운영 학원명 (모든 유형)
- **exam_types**: TEXT[], DEFAULT '{}' — 실기유형 배열 (모든 유형)
- **agree_terms**: BOOLEAN, DEFAULT false — 이용약관 동의
- **agree_privacy**: BOOLEAN, DEFAULT false — 개인정보 동의
- **agree_marketing**: BOOLEAN, DEFAULT false — 마케팅 동의
- **created_at**: TIMESTAMPTZ, DEFAULT now() — 가입일
- **updated_at**: TIMESTAMPTZ, DEFAULT now() — 수정일

**권한 (RLS)**: 본인만 조회/생성/수정 가능 (id = auth.uid())

**트리거**: auth.users INSERT 시 profiles 행 자동 생성

**설계 결정**: 3가지 유저 타입을 단일 테이블로 관리. MVP 규모에서 테이블 분리는 JOIN 복잡도만 증가시키고 이점이 없음. nullable 필드로 충분히 처리 가능.

### 3.3 saved_items (하트/저장)

- **id**: BIGINT, PK, 자동증가 — 저장 고유 ID
- **user_id**: UUID, NOT NULL, FK -> auth.users ON DELETE CASCADE — 저장한 사용자
- **artwork_id**: BIGINT, NOT NULL, FK -> artworks ON DELETE CASCADE — 저장된 작품
- **created_at**: TIMESTAMPTZ, DEFAULT now() — 저장일

**제약**: UNIQUE(user_id, artwork_id) — 같은 작품 중복 저장 방지

**권한 (RLS)**: 본인의 저장만 조회/생성/삭제 가능 (user_id = auth.uid())

### 3.4 Supabase Storage

- **버킷명**: artworks (공개)
- **용도**: 작품 이미지 파일 저장
- artworks 테이블의 image 컬럼에 해당 이미지의 공개 URL 저장

---

## 4. 기술 스택

- **프론트엔드**: React 19 + Vite 8 + Tailwind CSS 3
- **UI 컴포넌트**: Radix UI (Dialog, Dropdown, Tabs, Toast) + Lucide Icons
- **라우팅**: React Router DOM 7
- **백엔드/DB**: Supabase (Auth, Database, Storage)
- **AI (선택)**: Gemini 2.0 Flash API
- **배포**: Vercel

---

## 5. 로드맵

### Phase 1 (MVP) — 현재
- 갤러리 탐색 + 필터 (완료)
- 이메일+비밀번호 회원가입 (UI 완료, Auth 연동 필요)
- 하트/저장 기능 (UI 완료, DB 연동 필요)
- 테이블 설계 및 RLS (이번 작업)

### Phase 1.5
- SSO 로그인 백엔드 연동 (카카오, 네이버, Google, Apple — UI 구현 완료)
- 로그인 페이지 (`/login` 라우트)
- 저장 보드 페이지
- 프로필 수정 페이지

### Phase 2
- 작품 업로드 Supabase Storage 연동 (UI 구현 완료)
- AI 큐레이션 기능

### 향후 (MVP 이후)
- 관리자 페이지 — 데이터 관리는 Supabase 대시보드에서 직접 처리
- 큐레이션 세션 저장/히스토리
- 완벽한 반응형 디자인 (모바일 최적화)
- 비기능 요구사항 (LCP 최적화, 접근성 체크리스트 등)
