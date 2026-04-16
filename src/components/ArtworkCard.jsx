import { Heart } from "lucide-react"
import { useState } from "react"
import { Badge } from "./ui/badge"

export default function ArtworkCard({ artwork, onClick }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(artwork.like_count)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [heartAnimate, setHeartAnimate] = useState(false)

  function handleLike(e) {
    e.stopPropagation() // 카드 클릭 이벤트와 분리
    setHeartAnimate(true)
    setTimeout(() => setHeartAnimate(false), 350)
    if (liked) {
      setLiked(false)
      setLikeCount((c) => c - 1)
    } else {
      setLiked(true)
      setLikeCount((c) => c + 1)
    }
  }

  return (
    <div
      className="group relative cursor-pointer rounded-xl overflow-hidden bg-gray-100 break-inside-avoid mb-4"
      onClick={() => onClick(artwork)}
    >
      {/* 작품 이미지 */}
      <img
        src={artwork.image}
        alt={artwork.title}
        className={`w-full object-cover block transition-all duration-500 group-hover:scale-105 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
      />

      {/* 호버시 오버레이 */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex flex-col justify-between p-3">
        {/* 상단: 뱃지 */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge variant="secondary" className="text-xs">
            {artwork.art_type}
          </Badge>
        </div>

        {/* 하단: 좋아요 버튼 */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 bg-white rounded-full px-3 py-1.5 text-sm font-medium shadow-md hover:scale-105 transition-transform"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-gray-600"} ${heartAnimate ? "heart-pop" : ""}`}
            />
            <span className="text-gray-800">{likeCount}</span>
          </button>
        </div>
      </div>

      {/* 하단 정보 (항상 보임) */}
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 line-clamp-1">{artwork.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{artwork.university} · {artwork.year}</p>
      </div>
    </div>
  )
}
