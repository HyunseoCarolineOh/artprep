-- 01. artworks 테이블 보완
-- 기존 artworks 테이블에 누락된 컬럼 추가 + RLS 설정
-- 실행 방법: mcp__supabase__apply_migration (name: "alter_artworks")

-- 누락 컬럼 추가 (이미 존재하면 무시)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artworks' AND column_name = 'like_count') THEN
    ALTER TABLE public.artworks ADD COLUMN like_count INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artworks' AND column_name = 'uploaded_by') THEN
    ALTER TABLE public.artworks ADD COLUMN uploaded_by UUID REFERENCES auth.users(id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'artworks' AND column_name = 'updated_at') THEN
    ALTER TABLE public.artworks ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_artworks_university ON public.artworks(university);
CREATE INDEX IF NOT EXISTS idx_artworks_art_type ON public.artworks(art_type);
CREATE INDEX IF NOT EXISTS idx_artworks_year ON public.artworks(year);
CREATE INDEX IF NOT EXISTS idx_artworks_created_at ON public.artworks(created_at DESC);

-- RLS 활성화
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 누구나 조회 가능
DROP POLICY IF EXISTS "artworks_select_all" ON public.artworks;
CREATE POLICY "artworks_select_all" ON public.artworks
  FOR SELECT USING (true);

-- RLS 정책: 로그인한 사용자만 INSERT
DROP POLICY IF EXISTS "artworks_insert_authenticated" ON public.artworks;
CREATE POLICY "artworks_insert_authenticated" ON public.artworks
  FOR INSERT TO authenticated
  WITH CHECK (true);
