-- 03. saved_items 테이블 생성
-- 하트/저장 기능용
-- 실행 방법: mcp__supabase__apply_migration (name: "create_saved_items")

CREATE TABLE IF NOT EXISTS public.saved_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  artwork_id BIGINT NOT NULL REFERENCES public.artworks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, artwork_id)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON public.saved_items(user_id);

-- RLS 활성화
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 본인 저장만 조회
DROP POLICY IF EXISTS "saved_items_select_own" ON public.saved_items;
CREATE POLICY "saved_items_select_own" ON public.saved_items
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- RLS 정책: 본인만 저장
DROP POLICY IF EXISTS "saved_items_insert_own" ON public.saved_items;
CREATE POLICY "saved_items_insert_own" ON public.saved_items
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS 정책: 본인만 삭제
DROP POLICY IF EXISTS "saved_items_delete_own" ON public.saved_items;
CREATE POLICY "saved_items_delete_own" ON public.saved_items
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());
