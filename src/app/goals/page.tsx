export default function Goals() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-blue-600">StudyGen</a>
          <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</a>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Study Goals</h1>
          <a href="/goals/create" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">New Goal</a>
        </div>
        <div className="bg-white rounded-xl border p-8 text-center">
          <p className="text-gray-500">No study goals yet. Create one to get started!</p>
        </div>
      </main>
    </div>
  )
}
