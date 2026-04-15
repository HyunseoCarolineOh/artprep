import { Search, Upload, User, Heart, LogOut } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function Header({ onSearch, onUploadClick, onSavedClick }) {
  const [query, setQuery] = useState("")
  const { user, profile, signOut } = useAuth()

  function handleSubmit(e) {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* 로고 */}
        <a href="/" className="shrink-0">
          <span className="text-xl italic text-[#195AE6]">
            <span className="font-medium">Art</span>
            <span className="font-extrabold">PREP</span>
          </span>
        </a>

        {/* 검색창 */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="검색"
              value={query}
              onChange={(e) => { setQuery(e.target.value); onSearch(e.target.value) }}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none outline-none text-sm focus:ring-2 focus:ring-gray-300 transition"
            />
          </div>
        </form>

        {/* 우측 버튼 영역 */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSavedClick}
            title="저장한 작품"
          >
            <Heart className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onUploadClick}
            className="hidden sm:flex gap-1"
          >
            <Upload className="w-4 h-4" />
            업로드
          </Button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {profile?.nickname ?? "사용자"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                title="로그아웃"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="icon" title="로그인">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
