-- 02. profiles 테이블 생성
-- 3가지 유저 타입(student, teacher, academy) 지원
-- 실행 방법: mcp__supabase__apply_migration (name: "create_profiles")

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL DEFAULT 'student' CHECK (user_type IN ('student', 'teacher', 'academy')),
  name TEXT,
  nickname TEXT,
  phone TEXT,
  target_university TEXT,
  target_major TEXT,
  target_year INTEGER,
  current_status TEXT,
  academy_name TEXT,
  exam_types TEXT[] DEFAULT '{}',
  agree_terms BOOLEAN DEFAULT false,
  agree_privacy BOOLEAN DEFAULT false,
  agree_marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 본인만 조회
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- RLS 정책: 본인만 생성
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- RLS 정책: 본인만 수정
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 회원가입 시 profiles 자동 생성 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- 기존 트리거가 있으면 삭제 후 재생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
