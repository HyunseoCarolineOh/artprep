import { Heart, X, Download, Share2 } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogClose } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

export default function ArtworkDetailModal({ artwork, open, onClose }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(artwork?.like_count ?? 0)

  if (!artwork) return null

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[60vh] max-h-[90vh]">
          {/* 이미지 영역 */}
          <div className="md:w-3/5 bg-gray-100 flex items-center justify-center min-h-64">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-contain max-h-[90vh]"
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
            <h2 className="text-xl font-bold text-gray-900 mb-3">{artwork.title}</h2>
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
      </DialogContent>
    </Dialog>
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
