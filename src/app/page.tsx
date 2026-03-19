import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BookOpen, Brain, Target, TrendingUp, FileText, Zap, Check, Star } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const features = [
  {
    icon: FileText,
    title: "PDF Content Extraction",
    description: "Upload PDFs and automatically extract key terms and concepts for study material generation",
    priority: "MVP"
  },
  {
    icon: Brain,
    title: "Flashcard Generator",
    description: "Create interactive flashcards from extracted content with spaced repetition",
    priority: "MVP"
  },
  {
    icon: BookOpen,
    title: "Quiz Builder",
    description: "Generate multiple choice and fill-in-the-blank quizzes from study content",
    priority: "MVP"
  },
  {
    icon: Target,
    title: "Goal-Based Study Plans",
    description: "Input learning objectives and get structured study sessions with relevant exercises",
    priority: "MVP"
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Track study streaks, quiz scores, and mastery levels for each topic",
    priority: "Nice-to-have"
  }
]

const benefits = [
  "Save hours of manual study material creation",
  "Improve retention with spaced repetition",
  "Track progress and identify weak areas",
  "Generate unlimited practice materials",
  "Study anywhere with mobile-friendly design"
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Medical Student",
    content: "StudyGen transformed how I study for exams. The flashcards generated from my textbooks are incredibly accurate.",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "Law Student",
    content: "The goal-based study plans keep me organized and focused. I've improved my grades significantly.",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    role: "Graduate Student",
    content: "Being able to turn any PDF into interactive quizzes is a game-changer for my research studies.",
    rating: 5
  }
]

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">StudyGen</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#benefits" className="text-gray-600 hover:text-gray-900 transition-colors">Benefits</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            Transform Your Study Experience
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Any Content Into
            <span className="text-blue-600 block">Personalized Study Tools</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your PDFs, set your learning goals, and let StudyGen create interactive flashcards, 
            quizzes, and study plans tailored to your needs. Study smarter, not harder.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Studying Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Watch Demo
            </Button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-2xl h-96 flex items-center justify-center">
              <div className="text-white text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-80" />
                <p className="text-lg font-medium">Interactive Study Dashboard</p>
                <p className="text-sm opacity-80">Preview Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Study Effectively
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform extracts key information from your content and creates 
              personalized study materials that adapt to your learning style.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <feature.icon className="h-10 w-10 text-blue-600" />
                    <Badge variant={feature.priority === "MVP" ? "default" : "secondary"}>
                      {feature.priority}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose StudyGen?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                StudyGen leverages AI to automatically generate study materials from your content, 
                saving you time and improving your learning outcomes.
              </p>
              
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link href="/auth/signup" className="inline-block mt-8">
                <Button size="lg">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Studies?</h3>
              <p className="text-lg opacity-90 mb-6">
                Join thousands of students who have already improved their learning with StudyGen.
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-sm opacity-80">Students</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-sm opacity-80">Study Sets</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">95%</div>
                  <div className="text-sm opacity-80">Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">4.9★</div>
                  <div className="text-sm opacity-80">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Students Are Saying
            </h2>
            <p className="text-xl text-gray-600">
              See how StudyGen is helping students achieve their academic goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free and upgrade as your study needs grow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="text-3xl font-bold text-gray-900">$0<span className="text-sm text-gray-600">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />5 PDF uploads per month</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Basic flashcards</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Simple quizzes</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Progress tracking</li>
                </ul>
                <Link href="/auth/signup">
                  <Button className="w-full" variant="outline">Get Started Free</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                Most Popular
              </Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="text-3xl font-bold text-gray-900">$9<span className="text-sm text-gray-600">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Unlimited PDF uploads</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Advanced flashcards with spaced repetition</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Custom quiz types</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Goal-based study plans</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Advanced progress analytics</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Priority support</li>
                </ul>
                <Link href="/auth/signup">
                  <Button className="w-full">Start Pro Trial</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Study Smarter?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already using StudyGen to ace their exams 
            and achieve their academic goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-6 w-6" />
                <span className="text-xl font-bold">StudyGen</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transform any content into personalized study tools instantly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 StudyGen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}