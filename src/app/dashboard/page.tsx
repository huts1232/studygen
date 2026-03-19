import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { 
  BookOpenIcon, 
  DocumentTextIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  PlusIcon,
  ArrowRightIcon,
  FireIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Document {
  id: string;
  title: string;
  created_at: string;
  page_count?: number;
  status: 'processing' | 'completed' | 'failed';
}

interface FlashcardSet {
  id: string;
  title: string;
  card_count: number;
  last_studied?: string;
}

interface Quiz {
  id: string;
  title: string;
  question_count: number;
  best_score?: number;
  created_at: string;
}

interface StudyGoal {
  id: string;
  title: string;
  target_date: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
}

interface ProgressStats {
  study_streak: number;
  total_cards_studied: number;
  total_quizzes_taken: number;
  average_quiz_score: number;
}

async function getDashboardData() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const [documentsRes, flashcardSetsRes, quizzesRes, goalsRes, progressRes] = await Promise.all([
    supabase
      .from('documents')
      .select('id, title, created_at, page_count, status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    
    supabase
      .from('flashcard_sets')
      .select('id, title, card_count, last_studied')
      .eq('user_id', user.id)
      .order('last_studied', { ascending: false, nullsFirst: false })
      .limit(5),
    
    supabase
      .from('quizzes')
      .select('id, title, question_count, best_score, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    
    supabase
      .from('study_goals')
      .select('id, title, target_date, progress, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('target_date', { ascending: true })
      .limit(3),
    
    supabase
      .from('user_progress')
      .select('study_streak, total_cards_studied, total_quizzes_taken, average_quiz_score')
      .eq('user_id', user.id)
      .single()
  ]);

  return {
    documents: documentsRes.data || [],
    flashcardSets: flashcardSetsRes.data || [],
    quizzes: quizzesRes.data || [],
    goals: goalsRes.data || [],
    progress: progressRes.data || {
      study_streak: 0,
      total_cards_studied: 0,
      total_quizzes_taken: 0,
      average_quiz_score: 0
    }
  };
}

function StatsCard({ title, value, icon: Icon, description, color = 'blue' }: {
  title: string;
  value: string | number;
  icon: any;
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200'
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Link
          href="/upload"
          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Upload Document</p>
              <p className="text-sm text-gray-500">Add new study material</p>
            </div>
          </div>
          <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
        </Link>
        
        <Link
          href="/goals/create"
          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <PlusIcon className="h-5 w-5 text-gray-400 group-hover:text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Create Study Goal</p>
              <p className="text-sm text-gray-500">Set learning objectives</p>
            </div>
          </div>
          <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-green-600" />
        </Link>
      </div>
    </div>
  );
}

function RecentDocuments({ documents }: { documents: Document[] }) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Documents</h3>
        <Link
          href="/upload"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all
        </Link>
      </div>
      
      {documents.length === 0 ? (
        <div className="text-center py-8">
          <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No documents uploaded yet</p>
          <Link
            href="/upload"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
          >
            Upload your first document
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}`}
              className="block p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 truncate">{doc.title}</p>
                    <p className="text-sm text-gray-500">
                      {doc.page_count ? `${doc.page_count} pages` : 'Processing...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : doc.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StudyGoals({ goals }: { goals: StudyGoal[] }) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Active Goals</h3>
        <Link
          href="/goals"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Manage goals
        </Link>
      </div>
      
      {goals.length === 0 ? (
        <div className="text-center py-8">
          <AcademicCapIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No active study goals</p>
          <Link
            href="/goals/create"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
          >
            Create your first goal
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{goal.title}</h4>
                <span className="text-xs text-gray-500">
                  Due {new Date(goal.target_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {goal.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecentActivity({ flashcardSets, quizzes }: { 
  flashcardSets: FlashcardSet[];
  quizzes: Quiz[];
}) {
  const activities = [
    ...flashcardSets.map(set => ({
      type: 'flashcards',
      id: set.id,
      title: `Studied ${set.title}`,
      subtitle: `${set.card_count} cards`,
      timestamp: set.last_studied || '',
      href: `/flashcards/${set.id}`
    })),
    ...quizzes.map(quiz => ({
      type: 'quiz',
      id: quiz.id,
      title: `Completed ${quiz.title}`,
      subtitle: quiz.best_score ? `Best: ${quiz.best_score}%` : 'New quiz',
      timestamp: quiz.created_at,
      href: `/quiz/${quiz.id}`
    }))
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <Link
              key={`${activity.type}-${activity.id}`}
              href={activity.href}
              className="block p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {activity.type === 'flashcards' ? (
                  <BookOpenIcon className="h-5 w-5 text-blue-500" />
                ) : (
                  <AcademicCapIcon className="h-5 w-5 text-green-500" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.subtitle}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {activity.timestamp && new Date(activity.timestamp).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

async function DashboardContent() {
  const { documents, flashcardSets, quizzes, goals, progress } = await getDashboardData();

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Study Streak"
          value={progress.study_streak}
          icon={FireIcon}
          description="days in a row"
          color="orange"
        />
        <StatsCard
          title="Cards Studied"
          value={progress.total_cards_studied}
          icon={BookOpenIcon}
          description="total flashcards"
          color="blue"
        />
        <StatsCard
          title="Quizzes Taken"
          value={progress.total_quizzes_taken}
          icon={AcademicCapIcon}
          description="completed"
          color="green"
        />
        <StatsCard
          title="Average Score"
          value={`${Math.round(progress.average_quiz_score)}%`}
          icon={ChartBarIcon}
          description="quiz performance"
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <RecentDocuments documents={documents} />
          <RecentActivity flashcardSets={flashcardSets} quizzes={quizzes} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <QuickActions />
          <StudyGoals goals={goals} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Track your study progress and access your learning materials
          </p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}