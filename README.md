# ArtPrep - 미대입시 작품 갤러리

미대입시 합격작과 작품들을 탐색하고 공유할 수 있는 웹 갤러리 서비스입니다.

## 주요 기능

- **작품 갤러리** - 핀터레스트 스타일 Masonry 그리드로 작품 탐색
- **필터 & 검색** - 대학교, 전형 유형, 학생 구분, 출제 연도별 필터링
- **작품 상세보기** - 모달로 작품 정보, 태그, 좋아요 확인
- **회원가입 / 로그인** - Supabase Auth 기반 이메일+비밀번호 인증
- **프로필 관리** - 닉네임 기반 사용자 프로필

## 기술 스택

- **Frontend**: React 19 + Vite
- **스타일링**: Tailwind CSS
- **라우팅**: React Router v7
- **UI 컴포넌트**: Radix UI (Dialog, Tabs, Toast 등)
- **아이콘**: Lucide React
- **백엔드 / DB**: Supabase (PostgreSQL, Auth)

## 시작하기

```bash
# 의존성 설치
npm install

# 환경변수 설정 (.env 파일 생성)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 개발 서버 실행
npm run dev
```

## 프로젝트 구조

```
src/
├── components/       # UI 컴포넌트
│   ├── ui/           # 공통 UI (Button, Badge, Dialog)
│   ├── Header.jsx    # 상단 헤더 (검색, 로그인 상태)
│   ├── FilterBar.jsx # 필터 바
│   ├── MasonryGrid.jsx
│   ├── ArtworkCard.jsx
│   └── ArtworkDetailModal.jsx
├── contexts/         # React Context
│   └── AuthContext.jsx
├── data/             # 정적 데이터 (필터 옵션)
├── lib/              # 유틸리티
│   ├── supabase.js   # Supabase 클라이언트
│   └── utils.js
└── pages/            # 페이지 컴포넌트
    ├── HomePage.jsx
    ├── LoginPage.jsx
    └── SignupPage.jsx
```

## Supabase 테이블

### artworks
작품 데이터를 저장하는 메인 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | bigint | PK, 자동 증가 |
| title | text | 작품 제목 |
| image | text | 이미지 URL |
| year | integer | 출제 연도 |
| art_type | text | 전형 유형 (기초디자인, 소묘 등) |
| university | text | 대학교명 |
| academy_type | text | 학생 구분 (현역, 재수 등) |
| region | text | 지역 |
| tags | text[] | 태그 배열 |
| like_count | integer | 좋아요 수 |
| passed | boolean | 합격 여부 |
| description | text | 작품 설명 |
| created_at | timestamptz | 등록일 |
| updated_at | timestamptz | 수정일 |

### profiles
사용자 프로필 테이블 (auth.users와 연동)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK, auth.users FK |
| nickname | text | 닉네임 |
| created_at | timestamptz | 가입일 |
