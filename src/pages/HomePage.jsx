import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import FilterBar from "../components/FilterBar"
import MasonryGrid from "../components/MasonryGrid"
import ArtworkDetailModal from "../components/ArtworkDetailModal"
import UploadModal from "../components/UploadModal"
import { supabase } from "../lib/supabase"

const defaultFilters = {
  university: "전체",
  type: "전체",
  academyType: "전체",
  year: "전체",
}

export default function HomePage() {
  const navigate = useNavigate()
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)

      let query = supabase
        .from("artworks")
        .select("*")
        .order("created_at", { ascending: false })

      if (filters.university !== "전체") query = query.eq("university", filters.university)
      if (filters.type !== "전체") query = query.eq("art_type", filters.type)
      if (filters.academyType !== "전체") query = query.eq("academy_type", filters.academyType)
      if (filters.year !== "전체") query = query.eq("year", Number(filters.year))

      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,university.ilike.%${searchQuery}%,art_type.ilike.%${searchQuery}%`
        )
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        setError("작품 데이터를 불러오지 못했습니다.")
        console.error(fetchError)
      } else {
        setArtworks(data)
      }
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [filters, searchQuery])

  return (
    <div className="min-h-screen bg-white">
      <Header
        onSearch={setSearchQuery}
        onUploadClick={() => setShowUpload(true)}
        onSavedClick={() => {}}
      />
      <FilterBar filters={filters} onFilterChange={setFilters} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-24 text-gray-400">
            <p className="text-lg">작품을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-red-400">
            <p className="text-lg font-medium">{error}</p>
            <p className="text-sm mt-1">잠시 후 다시 시도해 주세요.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">
              작품 {artworks.length}개
            </p>
            {artworks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <p className="text-lg">검색 결과가 없습니다</p>
                <p className="text-sm mt-1">다른 검색어나 필터를 시도해 보세요.</p>
              </div>
            ) : (
              <MasonryGrid artworks={artworks} onCardClick={(artwork) => navigate(`/artwork/${artwork.id}`)} />
            )}
          </>
        )}
      </main>
      <ArtworkDetailModal
        artwork={selectedArtwork}
        open={!!selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />
      <UploadModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
      />
    </div>
  )
}
