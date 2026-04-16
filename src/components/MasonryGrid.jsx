import { SearchX } from "lucide-react"
import ArtworkCard from "./ArtworkCard"

// 핀터레스트형 마소너리(Masonry) 그리드 컴포넌트
// CSS columns 방식을 사용해서 이미지 높이가 달라도 빈칸 없이 쌓임
export default function MasonryGrid({ artworks, onCardClick }) {
  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-lg font-medium text-gray-500">검색 결과가 없습니다</p>
        <p className="text-sm mt-1 text-gray-400">다른 필터를 선택해 보세요</p>
      </div>
    )
  }

  return (
    <div
      className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4"
      style={{ columnFill: "balance" }}
    >
      {artworks.map((artwork, index) => (
        <div
          key={artwork.id}
          className="card-enter"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ArtworkCard
            artwork={artwork}
            onClick={onCardClick}
          />
        </div>
      ))}
    </div>
  )
}
