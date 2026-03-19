"use client"

import { useState } from "react"
import Link from "next/link"

const SAMPLE_GOALS = [
  { id: 1, title: "Biology Exam", deadline: "Apr 15, 2026", progress: 65, topics: 8, completed: 5 },
  { id: 2, title: "History Final", deadline: "Apr 20, 2026", progress: 30, topics: 12, completed: 4 },
]

export default function Goals() {
  const [goals] = useState(SAMPLE_GOALS)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <span className="text-lg font-bold text-gray-900">StudyGen</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link href="/goals" className="text-sm font-medium text-blue-600">Goals</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Study Goals</h1>
            <p className="text-sm text-gray-500 mt-1">Set goals and track your exam preparation</p>
          </div>
          <button className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            + New Goal
          </button>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-500">Deadline: {goal.deadline}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  goal.progress >= 60 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {goal.progress}% complete
                </span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{goal.completed}/{goal.topics} topics covered</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: goal.progress + "%" }} />
                </div>
              </div>
              <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                Continue studying →
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
