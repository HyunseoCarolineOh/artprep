# ArtPrep 검색 기능 기획서 (PRD v2)

- **프로젝트**: ArtPrep
- **작성일**: 2026-04-09
- **버전**: v2 — 검색 기능
- **관련 문서**: [기존 PRD (MVP)](./PRD.md)

---

## 1. 기능 요약

검색창에 키워드를 입력하면 서버(Supabase)에서 **작품 제목, 대학교, 실기유형, 태그**를 검색하여 결과를 반환한다. 기존 드롭다운 필터와 함께 사용 가능하며, 자동완성, 최근 검색어, 정렬 옵션을 포함한다.

**현재 문제**: 브라우저에서 클라이언트 사이드 필터링만 하고 있어, 데이터가 많아지면 느려지고 태그 검색도 안 됨.

**해결**: 서버 사이드 검색으로 전환 + UX 편의 기능 추가. **MVP Phase 1에 포함.**

---

## 2. 사용자 시나리오

| # | 상황 | 동작 |
|---|------|------|
| 1 | 입시생이 "기초디자인 투명체" 검색 | 0.3초 후 관련 작품 표시 |
| 2 | "홍익"까지 입력 | 자동완성에 "홍익대학교" 추천 → 클릭하면 바로 검색 |
| 3 | 검색어 "소묘" + 필터 "서울대학교" | 두 조건 모두 만족하는 결과만 표시 |
| 4 | 결과를 인기순으로 변경 | 좋아요 많은 순으로 재정렬 |
| 5 | 어제 검색한 "발상과표현" 재검색 | 검색창 클릭 → 최근 검색어에서 탭 |
| 6 | "추상조각" 검색 → 결과 없음 | 안내 메시지 + 다른 검색어 제안 |

---

## 3. 검색 로직

### 3.1 검색 대상

| 필드 | 매칭 방식 |
|------|-----------|
| title (제목) | 부분 일치 (ilike) |
| university (대학교) | 부분 일치 (ilike) |
| art_type (실기유형) | 부분 일치 (ilike) |
| tags (태그 배열) | 배열을 문자열로 변환 후 부분 일치 |

4개 필드 중 **하나라도 매칭되면 결과에 포함** (OR 조건).

### 3.2 검색어 + 필터 조합

- 검색 필드 간: **OR** (하나만 맞아도 됨)
- 검색어 vs 필터: **AND** (검색 결과 중 필터도 만족하는 것만)
- 필터가 "전체"이면 해당 조건 무시

### 3.3 ilike를 쓰는 이유

PostgreSQL의 full-text search(tsvector)는 한국어 파서가 없어서 "기초디자인" 같은 복합어의 부분 매칭이 안 됨. ilike + pg_trgm GIN 인덱스 조합이 한국어 환경에서 현실적인 선택.

### 3.4 Debounce

- 타이핑 멈춘 후 **0.3초 대기** 후 서버 요청 (한국어 IME 조합 특성 고려)
- 새 입력 시 이전 요청은 AbortController로 취소

---

## 4. 자동완성

### 4.1 추천 데이터 소스

| 우선순위 | 종류 | 데이터 출처 |
|----------|------|------------|
| 1 | 최근 검색어 (🕐) | localStorage |
| 2 | 인기 태그 (#) | DB에서 앱 로딩 시 1회 조회 (30개) |
| 3 | 대학교/실기유형 | 정적 리스트 (src/data/artworks.js) |

총 70개 정도로 한정적이므로 서버 요청 없이 **클라이언트에서 필터링** → 즉각 반응.

### 4.2 동작

- 검색창 포커스 시 드롭다운 표시 (최근 검색어 + 추천)
- 1글자 이상 입력 시 필터링된 추천 표시 (최대 8개)
- 키보드 방향키 탐색 + Enter 선택 + Esc 닫기
- 항목 선택 시 해당 검색어로 즉시 검색 실행

### 4.3 드롭다운 UI

```
포커스 시:                          입력 중 ("기초디"):
┌──────────────────────────┐      ┌──────────────────────────┐
│ 최근 검색        모두 삭제│      │ 📝 기초디자인    실기유형 │
│ 🕐 기초디자인 투명체   ✕ │      │ 🕐 기초디자인 투명체  최근│
│ 🕐 홍익대학교          ✕ │      │ # 기초디자인        태그 │
│ 추천 검색어              │      └──────────────────────────┘
│ # 투명체                 │
│ 🏫 홍익대학교            │
│ 📝 기초디자인            │
└──────────────────────────┘
```

---

## 5. 최근 검색어

- **저장소**: localStorage (`artprep_recent_searches`)
- **최대**: 10개 (초과 시 가장 오래된 것 삭제)
- **중복**: 같은 검색어 재검색 시 맨 위로 이동
- **저장 시점**: Enter 또는 추천 항목 클릭 시 (빈 문자열 제외)
- **삭제**: 개별(✕ 버튼) + 전체("모두 삭제")
- 로그인 상태와 무관, 디바이스별 저장

---

## 6. 정렬

| 옵션 | 정렬 기준 | 기본 선택 조건 |
|------|-----------|---------------|
| 관련도순 | 제목 매칭 > 유형 > 대학교 > 태그 순 가중치 | 검색어 있을 때 |
| 최신순 | created_at DESC | 검색어 없을 때 |
| 인기순 | like_count DESC | 수동 선택 |

- 검색어 없으면 "관련도순" 비활성화
- 정렬 변경 시 스크롤 위치 초기화

**UI**: 결과 개수 옆에 드롭다운 — `작품 24개 | 정렬: [관련도순 ▼]`

---

## 7. 무한 스크롤

- 1회 로딩: **20개**
- 스크롤 하단 도달 시 IntersectionObserver로 감지 → 다음 20개 자동 로딩
- 반환 건수 < 20이면 "모든 작품을 확인했습니다" 표시
- 검색어/필터/정렬 변경 시 초기화

---

## 8. 화면 상태

| 상태 | 표시 |
|------|------|
| 로딩 중 | "작품을 불러오는 중..." |
| 결과 있음 | "작품 N개" + 그리드 |
| 결과 없음 (검색어) | "'{검색어}'에 대한 검색 결과가 없습니다" + 필터 초기화 버튼 |
| 결과 없음 (필터만) | "다른 필터를 선택해 보세요" |

---

## 9. DB 변경사항

마이그레이션 파일: `docs/migrations/04_search_feature.sql`

| 항목 | 용도 |
|------|------|
| pg_trgm 확장 | ilike 검색 성능 향상 |
| title/university/art_type trigram GIN 인덱스 | 문자열 검색 속도 향상 |
| tags GIN 인덱스 | 태그 배열 검색 |
| like_count DESC 인덱스 | 인기순 정렬 |
| `search_artworks` RPC 함수 | 검색+필터+정렬+페이지네이션 통합 처리 |
| `get_popular_tags` RPC 함수 | 인기 태그 30개 조회 (자동완성용) |

---

## 10. 파일 변경 목록

**신규:**
| 파일 | 역할 |
|------|------|
| `docs/migrations/04_search_feature.sql` | DB 인덱스 + RPC 함수 |
| `src/lib/searchArtworks.js` | Supabase RPC 호출 래퍼 |
| `src/lib/recentSearches.js` | 최근 검색어 CRUD |
| `src/hooks/useDebounce.js` | Debounce 커스텀 hook |
| `src/components/SearchDropdown.jsx` | 자동완성 드롭다운 |

**수정:**
| 파일 | 변경 내용 |
|------|-----------|
| `Header.jsx` | 자동완성 연결, X 버튼, debounce 적용 |
| `HomePage.jsx` | 클라이언트 → 서버 검색 전환, 정렬/무한 스크롤 상태 |
| `FilterBar.jsx` | 정렬 드롭다운 추가 |
| `MasonryGrid.jsx` | IntersectionObserver sentinel 추가 |

**구현 순서**: DB 준비 → 서버 검색 전환 → 검색 UX(debounce, 자동완성) → 최근 검색어 → 정렬 → 무한 스크롤

---

## 11. Phase 2+ 확장 후보

- 다중 키워드 AND 매칭 ("기초디자인 투명체" → 두 단어 모두 포함)
- 검색 로그/통계 테이블
- 태그 클릭 → 해당 태그 검색
- 검색 결과 하이라이팅
- TanStack Query 도입 (검색 결과 캐싱)

---

<details>
<summary>부록: SQL 코드 (개발 시 참고)</summary>

### search_artworks RPC

```sql
CREATE OR REPLACE FUNCTION search_artworks(
  search_query TEXT DEFAULT NULL,
  filter_university TEXT DEFAULT NULL,
  filter_art_type TEXT DEFAULT NULL,
  filter_academy_type TEXT DEFAULT NULL,
  filter_year INTEGER DEFAULT NULL,
  sort_by TEXT DEFAULT 'relevance',
  page_limit INTEGER DEFAULT 20,
  page_offset INTEGER DEFAULT 0
)
RETURNS SETOF artworks
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM artworks a
  WHERE
    (search_query IS NULL OR search_query = '' OR (
      a.title ILIKE '%' || search_query || '%'
      OR a.university ILIKE '%' || search_query || '%'
      OR a.art_type ILIKE '%' || search_query || '%'
      OR array_to_string(a.tags, ' ') ILIKE '%' || search_query || '%'
    ))
    AND (filter_university IS NULL OR a.university = filter_university)
    AND (filter_art_type IS NULL OR a.art_type = filter_art_type)
    AND (filter_academy_type IS NULL OR a.academy_type = filter_academy_type)
    AND (filter_year IS NULL OR a.year = filter_year)
  ORDER BY
    CASE
      WHEN sort_by = 'relevance' AND search_query IS NOT NULL AND search_query != '' THEN
        CASE
          WHEN a.title ILIKE '%' || search_query || '%' THEN 1
          WHEN a.art_type ILIKE '%' || search_query || '%' THEN 2
          WHEN a.university ILIKE '%' || search_query || '%' THEN 3
          ELSE 4
        END
      ELSE 0
    END ASC,
    CASE WHEN sort_by = 'newest' OR (sort_by = 'relevance' AND (search_query IS NULL OR search_query = '')) THEN a.created_at END DESC,
    CASE WHEN sort_by = 'popular' THEN a.like_count END DESC,
    a.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$;
```

### 인덱스

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_artworks_title_trgm ON public.artworks USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_artworks_university_trgm ON public.artworks USING GIN (university gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_artworks_art_type_trgm ON public.artworks USING GIN (art_type gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_artworks_tags_gin ON public.artworks USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_artworks_like_count ON public.artworks (like_count DESC);
```

### get_popular_tags

```sql
CREATE OR REPLACE FUNCTION get_popular_tags(max_count INTEGER DEFAULT 30)
RETURNS TABLE(tag TEXT, count BIGINT)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT unnest(tags) AS tag, COUNT(*) AS count
  FROM artworks GROUP BY tag ORDER BY count DESC LIMIT max_count;
$$;
```

### 프론트엔드 호출 패턴

```javascript
const { data, error } = await supabase.rpc('search_artworks', {
  search_query: query || null,
  filter_university: university === '전체' ? null : university,
  filter_art_type: artType === '전체' ? null : artType,
  filter_academy_type: academyType === '전체' ? null : academyType,
  filter_year: year === '전체' ? null : parseInt(year),
  sort_by: sortBy,
  page_limit: 20,
  page_offset: offset,
}, { signal })
```

</details>
