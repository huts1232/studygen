import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Nav */}
      <nav className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-gray-900">StudyGen</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Dashboard</Link>
            <Link href="/upload" className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
          ✨ AI-powered study tools
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
          Transform any document into<br />
          <span className="text-blue-600">personalized study tools</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload a PDF, lecture notes, or any document. AI instantly creates flashcards, quizzes,
          and study plans tailored to your learning goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/upload" className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30">
            Upload Your First PDF →
          </Link>
          <Link href="/dashboard" className="px-8 py-3.5 border-2 border-gray-200 rounded-xl font-semibold text-lg text-gray-700 hover:bg-gray-50 transition-all">
            View Dashboard
          </Link>
        </div>
        <p className="text-sm text-gray-500">Free to start · No credit card required · Works with any PDF</p>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How it works</h2>
        <p className="text-gray-600 text-center mb-12">Three steps to better studying</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl mx-auto mb-4">📄</div>
            <div className="text-sm font-mono text-blue-600 mb-2">01</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Upload a document</h3>
            <p className="text-sm text-gray-600">Drop any PDF, Word doc, or text file. Our AI reads and understands the content.</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 rounded-2xl bg-purple-100 flex items-center justify-center text-3xl mx-auto mb-4">🤖</div>
            <div className="text-sm font-mono text-purple-600 mb-2">02</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI generates materials</h3>
            <p className="text-sm text-gray-600">Get flashcards, quizzes, and summaries automatically created from your content.</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">🎯</div>
            <div className="text-sm font-mono text-green-600 mb-2">03</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Study & track progress</h3>
            <p className="text-sm text-gray-600">Use spaced repetition to memorize faster. Track your streaks and mastery levels.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything you need to ace your exams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "📄", title: "PDF Content Extraction", desc: "Upload PDFs and automatically extract key terms, definitions, and concepts for study material generation." },
              { icon: "🗂️", title: "Smart Flashcards", desc: "AI creates interactive flashcards with spaced repetition scheduling. Study the right cards at the right time." },
              { icon: "📝", title: "Auto-Generated Quizzes", desc: "Multiple choice, fill-in-the-blank, and true/false questions generated from your content." },
              { icon: "🎯", title: "Goal-Based Study Plans", desc: "Set your exam date and learning objectives. Get a structured daily study schedule." },
              { icon: "📊", title: "Progress Analytics", desc: "Track study streaks, quiz scores, mastery levels, and time spent per topic." },
              { icon: "🧠", title: "Spaced Repetition", desc: "Science-backed algorithm shows you cards just before you forget them. Learn faster, retain longer." },
            ].map((f, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Simple pricing</h2>
        <p className="text-gray-600 text-center mb-12">Start free, upgrade when you need more</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
            <h3 className="text-lg font-bold text-gray-900">Free</h3>
            <div className="text-3xl font-bold text-gray-900 mt-2">$0<span className="text-base font-normal text-gray-500">/month</span></div>
            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li className="flex gap-2">✓ 3 documents</li>
              <li className="flex gap-2">✓ Basic flashcards</li>
              <li className="flex gap-2">✓ 5 quizzes/month</li>
            </ul>
            <Link href="/upload" className="block mt-8 text-center py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">
              Get Started
            </Link>
          </div>
          <div className="bg-white rounded-2xl border-2 border-blue-600 p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
            <h3 className="text-lg font-bold text-gray-900">Pro</h3>
            <div className="text-3xl font-bold text-gray-900 mt-2">$9<span className="text-base font-normal text-gray-500">/month</span></div>
            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li className="flex gap-2">✓ Unlimited documents</li>
              <li className="flex gap-2">✓ AI flashcards + quizzes</li>
              <li className="flex gap-2">✓ Study plans & goals</li>
              <li className="flex gap-2">✓ Progress analytics</li>
              <li className="flex gap-2">✓ Spaced repetition</li>
            </ul>
            <Link href="/upload" className="block mt-8 text-center py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
              Start Pro Trial
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to study smarter?</h2>
          <p className="text-blue-100 mb-8 text-lg">Upload your first document and see the magic happen.</p>
          <Link href="/upload" className="inline-flex px-8 py-3.5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg">
            Upload a PDF — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-gray-500">
          <span>© 2026 StudyGen</span>
          <span>Built with Next.js + Supabase</span>
        </div>
      </footer>
    </div>
  )
}
