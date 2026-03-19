"use client"

import { useState, useRef } from "react"
import Link from "next/link"

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f && f.type === "application/pdf") setFile(f)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    // Simulate upload (would use Supabase Storage in production)
    await new Promise(r => setTimeout(r, 2000))
    setUploading(false)
    setDone(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <span className="text-lg font-bold text-gray-900">StudyGen</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Document</h1>
        <p className="text-gray-600 mb-8">Upload a PDF to generate flashcards, quizzes, and study plans.</p>

        {done ? (
          <div className="bg-white rounded-2xl border-2 border-green-200 p-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload complete!</h3>
            <p className="text-gray-600 mb-6">AI is generating your study materials...</p>
            <Link href="/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
              Go to Dashboard →
            </Link>
          </div>
        ) : (
          <>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`bg-white rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50/50 ${
                file ? "border-blue-400 bg-blue-50/30" : "border-gray-300"
              }`}
            >
              <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={handleChange} />
              {file ? (
                <>
                  <div className="text-4xl mb-4">📄</div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-4">📤</div>
                  <p className="font-medium text-gray-900 mb-1">Drop your PDF here</p>
                  <p className="text-sm text-gray-500">or click to browse · Max 10MB</p>
                </>
              )}
            </div>
            {file && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full mt-4 py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    Uploading & Processing...
                  </>
                ) : (
                  "Upload & Generate Study Materials"
                )}
              </button>
            )}
          </>
        )}

        <div className="mt-8 bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-3">What happens after upload?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex gap-3"><span className="text-blue-600 font-bold">1.</span> AI reads and understands your document</div>
            <div className="flex gap-3"><span className="text-blue-600 font-bold">2.</span> Key terms and concepts are extracted</div>
            <div className="flex gap-3"><span className="text-blue-600 font-bold">3.</span> Flashcards are generated for each concept</div>
            <div className="flex gap-3"><span className="text-blue-600 font-bold">4.</span> Quiz questions are created from the content</div>
            <div className="flex gap-3"><span className="text-blue-600 font-bold">5.</span> A personalized study plan is built for you</div>
          </div>
        </div>
      </main>
    </div>
  )
}
