export default function Upload() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-blue-600">StudyGen</a>
          <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</a>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Document</h1>
        <p className="text-gray-600 mb-8">Upload a PDF to generate flashcards and quizzes.</p>
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center hover:border-blue-400 transition-colors cursor-pointer">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-gray-900 font-medium mb-1">Drop your PDF here</p>
          <p className="text-sm text-gray-500">or click to browse (max 10MB)</p>
        </div>
      </main>
    </div>
  )
}
