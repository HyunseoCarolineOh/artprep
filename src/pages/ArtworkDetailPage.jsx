import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Heart, Share2, Download } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { supabase } from "../lib/supabase"

export default function ArtworkDetailPage() {
  const { id } = useParams()
  const [artwork, setArtwork] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    async function fetchArtwork() {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from("artworks")
        .select("*")
        .eq("id", id)
        .single()

      if (fetchError) {
        setError("작품을 찾을 수 없습니다.")
      } else {
        setArtwork(data)
        setLikeCount(data.like_count ?? 0)
      }
      setLoading(false)
    }
    fetchArtwork()
  }, [id])

  function handleLike() {
    if (liked) {
      setLiked(false)
      setLikeCount((c) => c - 1)
    } else {
      setLiked(true)
      setLikeCount((c) => c + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">갤러리로 돌아가기</span>
          </Link>
          <Link to="/">
            <span className="text-xl italic text-[#195AE6]">
              <span className="font-medium">Art</span>
              <span className="font-extrabold">PREP</span>
            </span>
          </Link>
          <div className="w-16" />
        </div>
      </header>

      {/* 본문 */}
      {loading ? (
        <div className="flex justify-center py-24 text-gray-400">
          <p className="text-lg">작품을 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <p className="text-lg font-medium">{error}</p>
          <Link to="/" className="text-sm mt-3 text-gray-900 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      ) : (
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row min-h-[60vh]">
              {/* 이미지 영역 */}
              <div className="md:w-3/5 bg-gray-100 flex items-center justify-center min-h-64">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-contain max-h-[80vh]"
                />
              </div>

              {/* 정보 영역 */}
              <div className="md:w-2/5 flex flex-col p-6 overflow-y-auto">
                {/* 액션 버튼 */}
                <div className="flex items-center gap-2 mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    className={`gap-1.5 ${liked ? "border-red-300 text-red-500" : ""}`}
                  >
                    <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                    {likeCount}
                  </Button>
                  <Button variant="ghost" size="icon" title="공유">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="다운로드">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>

                {/* 작품 정보 */}
                <h1 className="text-xl font-bold text-gray-900 mb-3">{artwork.title}</h1>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">{artwork.description}</p>

                {/* 메타 정보 */}
                <div className="space-y-3 mb-6">
                  <InfoRow label="대학교" value={artwork.university} />
                  <InfoRow label="전형 유형" value={artwork.art_type} />
                  <InfoRow label="출제 연도" value={`${artwork.year}년`} />
                  <InfoRow label="학생 구분" value={artwork.academy_type} />
                </div>

                {/* 태그 */}
                {artwork.tags && artwork.tags.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2 font-medium">태그</p>
                    <div className="flex flex-wrap gap-1.5">
                      {artwork.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{value}</span>
    </div>
  )
}
