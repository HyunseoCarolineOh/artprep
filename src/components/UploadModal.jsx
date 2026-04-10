import { useState, useRef } from "react"
import { Upload, ImagePlus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { universities, artTypes, academyTypes, years } from "../data/artworks"

export default function UploadModal({ open, onClose }) {
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({
    title: "",
    year: "2024",
    type: "기초디자인",
    university: "",
    academyType: "현역",
    tags: "",
    description: "",
  })
  const fileInputRef = useRef(null)

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // 실제 업로드 로직은 백엔드 연동 후 구현
    alert("업로드 기능은 백엔드 연동 후 완성됩니다.")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle>작품 업로드</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-6 p-6 max-h-[75vh] overflow-y-auto">
            {/* 이미지 업로드 영역 */}
            <div className="md:w-2/5">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-400 transition bg-gray-50"
              >
                {preview ? (
                  <img src={preview} alt="미리보기" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <>
                    <ImagePlus className="w-10 h-10 text-gray-300" />
                    <p className="text-sm text-gray-400">이미지를 클릭해서 업로드</p>
                    <p className="text-xs text-gray-300">JPG, PNG (최대 10MB)</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* 정보 입력 영역 */}
            <div className="md:w-3/5 space-y-4">
              <FormField label="작품 제목">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="예: 기초디자인 - 투명 구와 금속 원기둥"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                  required
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="출제 연도">
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    {years.filter((y) => y !== "전체").map((y) => (
                      <option key={y} value={y}>{y}년</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="전형 유형">
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    {artTypes.filter((t) => t !== "전체").map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label="출제 대학교">
                <input
                  name="university"
                  value={form.university}
                  onChange={handleChange}
                  placeholder="예: 홍익대학교"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                />
              </FormField>

              <FormField label="학생 구분">
                <select
                  name="academyType"
                  value={form.academyType}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                >
                  {academyTypes.filter((a) => a !== "전체").map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="태그 (쉼표로 구분)">
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="예: 투명체, 금속, 구"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                />
              </FormField>

              <FormField label="작품 설명">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="작품에 대한 간단한 설명을 입력해 주세요"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 resize-none"
                />
              </FormField>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-end gap-2 px-6 pb-6 pt-2 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" className="gap-1.5">
              <Upload className="w-4 h-4" />
              업로드
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
