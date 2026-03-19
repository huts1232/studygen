"use client"

import { useState } from "react"
import Link from "next/link"

const SAMPLE_DOCS = [
  { id: 1, name: "Biology Chapter 5.pdf", pages: 24, flashcards: 45, quizzes: 3, mastery: 72, date: "Mar 18, 2026" },
  { id: 2, name: "History Notes.pdf", pages: 12, flashcards: 28, quizzes: 2, mastery: 45, date: "Mar 17, 2026" },
]

export default function Dashboard() {
  const [docs] = useState(SAMPLE_DOCS)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <span className="text-lg font-bold text-gray-900">StudyGen</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-blue-600">Dashboard</Link>
            <Link href="/upload" className="text-sm text-gray-600 hover:text-gray-900">Upload</Link>
            <Link href="/goals" className="text-sm text-gray-600 hover:text-gray-900">Goals</Link>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">S</div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Your study materials at a glance</p>
          </div>
          <Link href="/upload" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            + Upload PDF
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Documents", value: docs.length.toString(), icon: "📄" },
            { label: "Flashcards", value: docs.reduce((a, d) => a + d.flashcards, 0).toString(), icon: "🗂️" },
            { label: "Quizzes Taken", value: docs.reduce((a, d) => a + d.quizzes, 0).toString(), icon: "📝" },
            { label: "Avg Mastery", value: Math.round(docs.reduce((a, d) => a + d.mastery, 0) / Math.max(docs.length, 1)) + "%", icon: "🎯" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{s.label}</span>
                <span className="text-xl">{s.icon}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Your Documents</h2>
          </div>
          {docs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-gray-500 mb-4">No documents yet</p>
              <Link href="/upload" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                Upload your first PDF
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {docs.map((doc) => (
                <div key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-lg">📄</div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.pages} pages · Uploaded {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-900">{doc.flashcards}</p>
                      <p className="text-[10px] text-gray-500">Cards</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-900">{doc.quizzes}</p>
                      <p className="text-[10px] text-gray-500">Quizzes</p>
                    </div>
                    <div className="w-24">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Mastery</span>
                        <span className="font-medium text-gray-900">{doc.mastery}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: doc.mastery + "%" }} />
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                      Study →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
