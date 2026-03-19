export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-blue-600">StudyGen</a>
          <div className="flex gap-4 items-center">
            <a href="/upload" className="text-sm text-gray-600 hover:text-gray-900">Upload</a>
            <a href="/goals" className="text-sm text-gray-600 hover:text-gray-900">Goals</a>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">S</div>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border p-5">
            <p className="text-sm text-gray-500">Documents</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <p className="text-sm text-gray-500">Flashcard Sets</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <p className="text-sm text-gray-500">Quizzes Taken</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <p className="text-sm text-gray-500">Study Streak</p>
            <p className="text-3xl font-bold text-gray-900">0 days</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-8 text-center">
          <p className="text-gray-500 mb-4">No study materials yet. Upload a PDF to get started!</p>
          <a href="/upload" className="inline-flex px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Upload PDF</a>
        </div>
      </main>
    </div>
  )
}
