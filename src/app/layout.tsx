import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SupabaseProvider } from '@/providers/supabase-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { Toaster } from '@/components/ui/toaster'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'StudyGen - Transform Content into Personalized Study Tools',
  description: 'Upload PDFs, create flashcards, generate quizzes, and track your learning progress with AI-powered study tools.',
  keywords: 'study tools, flashcards, quiz generator, PDF content extraction, learning objectives, progress tracking',
  authors: [{ name: 'StudyGen Team' }],
  creator: 'StudyGen',
  publisher: 'StudyGen',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'StudyGen - Transform Content into Personalized Study Tools',
    description: 'Upload PDFs, create flashcards, generate quizzes, and track your learning progress with AI-powered study tools.',
    url: '/',
    siteName: 'StudyGen',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyGen - Transform Content into Personalized Study Tools',
    description: 'Upload PDFs, create flashcards, generate quizzes, and track your learning progress with AI-powered study tools.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <SupabaseProvider session={session}>
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">
                {children}
              </div>
            </div>
            <Toaster />
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}