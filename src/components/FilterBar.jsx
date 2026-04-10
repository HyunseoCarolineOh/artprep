import { universities, artTypes, academyTypes, years } from "../data/artworks"
import { cn } from "../lib/utils"

export default function FilterBar({ filters, onFilterChange }) {
  function handleChange(key, value) {
    onFilterChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-3">
        <FilterSelect
          label="대학교"
          options={universities}
          value={filters.university}
          onChange={(v) => handleChange("university", v)}
        />
        <FilterSelect
          label="전형 유형"
          options={artTypes}
          value={filters.type}
          onChange={(v) => handleChange("type", v)}
        />
        <FilterSelect
          label="학생 구분"
          options={academyTypes}
          value={filters.academyType}
          onChange={(v) => handleChange("academyType", v)}
        />
        <FilterSelect
          label="출제 연도"
          options={years}
          value={filters.year}
          onChange={(v) => handleChange("year", v)}
        />
      </div>
    </div>
  )
}

function FilterSelect({ label, options, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "text-sm px-3 py-1.5 rounded-full border cursor-pointer outline-none transition",
        value === "전체"
          ? "border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
          : "border-gray-900 text-gray-900 bg-gray-900 text-white font-medium"
      )}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt === "전체" ? `${label} 전체` : opt}
        </option>
      ))}
    </select>
  )
}
