'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, 
  BookOpen, 
  Brain, 
  Target, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'

interface Document {
  id: string
  title: string
  file_name: string
  file_size: number
  extraction_status: 'pending' | 'processing' | 'completed' | 'failed'
  content_preview: string
  key_terms: string[]
  concepts: string[]
  flashcard_count: number
  quiz_count: number
  created_at: string
  updated_at: string
}

interface StudyStats {
  flashcards_studied: number
  quizzes_completed: number
  average_quiz_score: number
  study_streak: number
  last_studied: string
}

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const [document, setDocument] = useState<Document | null>(null)
  const [studyStats, setStudyStats] = useState<StudyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        // Fetch document details
        const { data: docData, error: docError } = await supabase
          .from('documents')
          .select('*')
          .eq('id', params.id)
          .single()

        if (docError) throw docError
        setDocument(docData)

        // Fetch study statistics
        const { data: statsData, error: statsError } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('document_id', params.id)

        if (!statsError && statsData) {
          const flashcardSessions = statsData.filter(s => s.type === 'flashcard').length
          const quizSessions = statsData.filter(s => s.type === 'quiz')
          const avgScore = quizSessions.length > 0 
            ? quizSessions.reduce((acc, s) => acc + (s.score || 0), 0) / quizSessions.length 
            : 0

          setStudyStats({
            flashcards_studied: flashcardSessions,
            quizzes_completed: quizSessions.length,
            average_quiz_score: Math.round(avgScore),
            study_streak: 0, // Calculate based on consecutive days
            last_studied: statsData.length > 0 ? statsData[0].created_at : ''
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document')
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [params.id])

  const handleCreateFlashcards = async () => {
    try {
      const { data, error } = await supabase
        .from('flashcard_sets')
        .insert({
          document_id: params.id,
          title: `${document?.title} - Flashcards`,
          description: `Flashcards generated from ${document?.file_name}`
        })
        .select()
        .single()

      if (error) throw error
      router.push(`/flashcards/${data.id}`)
    } catch (err) {
      console.error('Error creating flashcards:', err)
    }
  }

  const handleCreateQuiz = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          document_id: params.id,
          title: `${document?.title} - Quiz`,
          description: `Quiz generated from ${document?.file_name}`,
          question_count: 10
        })
        .select()
        .single()

      if (error) throw error
      router.push(`/quiz/${data.id}`)
    } catch (err) {
      console.error('Error creating quiz:', err)
    }
  }

  const handleDeleteDocument = async () => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', params.id)

      if (error) throw error
      router.push('/dashboard')
    } catch (err) {
      console.error('Error deleting document:', err)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Extraction Complete'
      case 'processing':
        return 'Processing...'
      case 'failed':
        return 'Extraction Failed'
      default:
        return 'Pending'
    }
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Error Loading Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error || 'Document not found'}</p>
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{document.title}</h1>
          <p className="text-gray-600 mt-1">{document.file_name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDeleteDocument}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(document.extraction_status)}
                <span className="font-medium">{getStatusText(document.extraction_status)}</span>
              </div>
              <Badge variant="secondary">
                {formatFileSize(document.file_size)}
              </Badge>
              <Badge variant="outline">
                {new Date(document.created_at).toLocaleDateString()}
              </Badge>
            </div>
            {document.extraction_status === 'processing' && (
              <Progress value={65} className="w-32" />
            )}
          </div>
        </CardContent>
      </Card>

      {document.extraction_status === 'completed' && (
        <>
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleCreateFlashcards}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Create Flashcards</h3>
                    <p className="text-sm text-gray-600">Generate study cards</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleCreateQuiz}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Brain className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Create Quiz</h3>
                    <p className="text-sm text-gray-600">Test your knowledge</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/goals/create')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Study Plan</h3>
                    <p className="text-sm text-gray-600">Set learning goals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="terms">Key Terms</TabsTrigger>
              <TabsTrigger value="concepts">Concepts</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Document Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Key Terms Extracted:</span>
                      <span className="font-semibold">{document.key_terms?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Concepts Identified:</span>
                      <span className="font-semibold">{document.concepts?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Flashcard Sets:</span>
                      <span className="font-semibold">{document.flashcard_count || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quizzes Created:</span>
                      <span className="font-semibold">{document.quiz_count || 0}</span>
                    </div>
                  </CardContent>
                </Card>

                {studyStats && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Study Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Flashcards Studied:</span>
                        <span className="font-semibold">{studyStats.flashcards_studied}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quizzes Completed:</span>
                        <span className="font-semibold">{studyStats.quizzes_completed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Quiz Score:</span>
                        <span className="font-semibold">{studyStats.average_quiz_score}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Study Streak:</span>
                        <span className="font-semibold">{studyStats.study_streak} days</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Extracted Content</CardTitle>
                  <CardDescription>Preview of the content extracted from your document</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {document.content_preview || 'Content extraction is still in progress...'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms">
              <Card>
                <CardHeader>
                  <CardTitle>Key Terms</CardTitle>
                  <CardDescription>Important terms and definitions identified in the document</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {document.key_terms?.map((term, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {term}
                      </Badge>
                    )) || <p className="text-gray-500">No key terms extracted yet.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="concepts">
              <Card>
                <CardHeader>
                  <CardTitle>Concepts</CardTitle>
                  <CardDescription>Main concepts and topics covered in the document</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {document.concepts?.map((concept, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900">{concept}</h4>
                      </div>
                    )) || <p className="text-gray-500">No concepts identified yet.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>Track your study progress for this document</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Flashcard Mastery</span>
                        <span className="text-sm text-gray-600">75%</span>
                      </div>
                      <Progress value={75} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Quiz Performance</span>
                        <span className="text-sm text-gray-600">82%</span>
                      </div>
                      <Progress value={82} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Overall Understanding</span>
                        <span className="text-sm text-gray-600">68%</span>
                      </div>
                      <Progress value={68} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}