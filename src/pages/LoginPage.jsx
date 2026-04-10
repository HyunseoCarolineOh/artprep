import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "../components/ui/button"
import { supabase } from "../lib/supabase"

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ email: "", password: "" })

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError("")
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (authError) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.")
      setLoading(false)
      return
    }

    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">돌아가기</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="font-bold text-gray-900">ArtGallery</span>
          </Link>
          <div className="w-16" />
        </div>
      </header>

      <div className="flex items-start justify-center px-4 py-8 md:py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인</h1>
            <p className="text-sm text-gray-500">계정에 로그인하세요</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력해 주세요"
                    className="form-input pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-sm font-medium mt-2"
                disabled={loading}
              >
                {loading ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              아직 계정이 없으신가요?{" "}
              <Link to="/signup" className="text-gray-900 font-medium hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
