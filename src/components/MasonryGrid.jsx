import ArtworkCard from "./ArtworkCard"

// 핀터레스트형 마소너리(Masonry) 그리드 컴포넌트
// CSS columns 방식을 사용해서 이미지 높이가 달라도 빈칸 없이 쌓임
export default function MasonryGrid({ artworks, onCardClick }) {
  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-lg font-medium">검색 결과가 없습니다</p>
        <p className="text-sm mt-1">다른 필터를 선택해 보세요</p>
      </div>
    )
  }

  return (
    <div
      className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4"
      style={{ columnFill: "balance" }}
    >
      {artworks.map((artwork) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
          onClick={onCardClick}
        />
      ))}
    </div>
  )
}
