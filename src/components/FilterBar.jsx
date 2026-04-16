import { useState, useRef, useEffect } from "react"
import { ChevronDown, X } from "lucide-react"
import { universities, artTypes, academyTypes, years } from "../data/artworks"
import { cn } from "../lib/utils"

export default function FilterBar({ filters, onFilterChange }) {
  const hasActiveFilter = Object.values(filters).some((v) => v !== "전체")

  function handleChange(key, value) {
    onFilterChange({ ...filters, [key]: value })
  }

  function handleReset() {
    onFilterChange({
      university: "전체",
      type: "전체",
      academyType: "전체",
      year: "전체",
    })
  }

  return (
    <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2">
        <FilterChip
          label="대학교"
          options={universities}
          value={filters.university}
          onChange={(v) => handleChange("university", v)}
        />
        <FilterChip
          label="전형 유형"
          options={artTypes}
          value={filters.type}
          onChange={(v) => handleChange("type", v)}
        />
        <FilterChip
          label="학생 구분"
          options={academyTypes}
          value={filters.academyType}
          onChange={(v) => handleChange("academyType", v)}
        />
        <FilterChip
          label="출제 연도"
          options={years}
          value={filters.year}
          onChange={(v) => handleChange("year", v)}
        />
        {hasActiveFilter && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>초기화</span>
          </button>
        )}
      </div>
    </div>
  )
}

function FilterChip({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const isActive = value !== "전체"

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  function handleSelect(opt) {
    onChange(opt)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border transition-colors",
          isActive
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
        )}
      >
        <span>{isActive ? value : label}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[140px] max-h-60 overflow-y-auto z-50">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className={cn(
                "w-full text-left px-4 py-2 text-sm transition-colors",
                opt === value
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {opt === "전체" ? `${label} 전체` : opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
