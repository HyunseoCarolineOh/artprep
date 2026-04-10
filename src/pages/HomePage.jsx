import { useState, useMemo, useEffect } from "react"
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
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    async function fetchArtworks() {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from("artworks")
        .select("*")
        .order("created_at", { ascending: false })

      if (fetchError) {
        setError("작품 데이터를 불러오지 못했습니다.")
        console.error(fetchError)
      } else {
        setArtworks(data)
      }
      setLoading(false)
    }
    fetchArtworks()
  }, [])

  const filtered = useMemo(() => {
    return artworks.filter((a) => {
      if (filters.university !== "전체" && a.university !== filters.university) return false
      if (filters.type !== "전체" && a.art_type !== filters.type) return false
      if (filters.academyType !== "전체" && a.academy_type !== filters.academyType) return false
      if (filters.year !== "전체" && String(a.year) !== filters.year) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const hit =
          a.title.toLowerCase().includes(q) ||
          a.university.toLowerCase().includes(q) ||
          a.art_type.toLowerCase().includes(q)
        if (!hit) return false
      }
      return true
    })
  }, [filters, searchQuery, artworks])

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
              작품 {filtered.length}개
            </p>
            <MasonryGrid artworks={filtered} onCardClick={setSelectedArtwork} />
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
