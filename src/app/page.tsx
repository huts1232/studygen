export default function Home() {
  return (
    <div className="min-h-screen">
      <nav className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">StudyGen</span>
          <div className="flex gap-3">
            <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</a>
            <a href="/upload" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Get Started</a>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
          Transform any content into<br /><span className="text-blue-600">personalized study tools</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload PDFs and documents. AI generates flashcards, quizzes, and study plans instantly.
          Study smarter, not harder.
        </p>
        <div className="flex gap-4 justify-center mb-16">
          <a href="/upload" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Upload a PDF
          </a>
          <a href="/dashboard" className="px-8 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            View Dashboard
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-xl border p-6">
            <div className="text-2xl mb-3">📄</div>
            <h3 className="font-semibold text-gray-900 mb-2">PDF Content Extraction</h3>
            <p className="text-sm text-gray-600">Upload PDFs and automatically extract key terms and concepts for study material generation.</p>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="text-2xl mb-3">🗂️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Flashcard Generator</h3>
            <p className="text-sm text-gray-600">Create interactive flashcards from extracted content with spaced repetition.</p>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="text-2xl mb-3">📝</div>
            <h3 className="font-semibold text-gray-900 mb-2">Quiz Builder</h3>
            <p className="text-sm text-gray-600">Generate multiple choice and fill-in-the-blank quizzes from study content.</p>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Goal-Based Study Plans</h3>
            <p className="text-sm text-gray-600">Input learning objectives and get structured study sessions.</p>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-sm text-gray-600">Track study streaks, quiz scores, and mastery levels for each topic.</p>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="text-2xl mb-3">💰</div>
            <h3 className="font-semibold text-gray-900 mb-2">Free to Start</h3>
            <p className="text-sm text-gray-600">Free tier with basic features. Pro plan at $9/month for unlimited access.</p>
          </div>
        </div>
      </main>
      <footer className="border-t py-8 text-center text-sm text-gray-500">
        © 2026 StudyGen. Built with Next.js + Supabase.
      </footer>
    </div>
  )
}
