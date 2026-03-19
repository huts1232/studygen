import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusIcon, BookOpenIcon, CalendarIcon, ClockIcon, TrophyIcon } from '@heroicons/react/24/outline'

export default async function GoalsPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: goals, error } = await supabase
    .from('goals')
    .select(`
      *,
      documents (
        id,
        title
      )
    `)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      paused: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return priorityConfig[priority as keyof typeof priorityConfig] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateProgress = (goal: any) => {
    if (!goal.total_sessions || goal.total_sessions === 0) return 0
    return Math.round((goal.completed_sessions / goal.total_sessions) * 100)
  }

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate)
    const today = new Date()
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Study Goals</h1>
              <p className="mt-2 text-gray-600">
                Create and track your learning objectives with structured study plans
              </p>
            </div>
            <Link
              href="/goals/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Goal
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error loading goals. Please try again.</p>
          </div>
        )}

        {goals && goals.length === 0 ? (
          <div className="text-center py-12">
            <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No goals yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first study goal.
            </p>
            <div className="mt-6">
              <Link
                href="/goals/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Goal
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {goals?.map((goal) => {
              const progress = calculateProgress(goal)
              const daysRemaining = getDaysRemaining(goal.target_date)
              
              return (
                <div
                  key={goal.id}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                            goal.status
                          )}`}
                        >
                          {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(
                            goal.priority
                          )}`}
                        >
                          {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {goal.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {goal.description}
                    </p>

                    {goal.documents && (
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <BookOpenIcon className="h-4 w-4 mr-1" />
                        <span>{goal.documents.title}</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{formatDate(goal.target_date)}</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>
                            {daysRemaining > 0
                              ? `${daysRemaining} days left`
                              : daysRemaining === 0
                              ? 'Due today'
                              : `${Math.abs(daysRemaining)} days overdue`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                          {goal.completed_sessions || 0} / {goal.total_sessions || 0} sessions
                        </span>
                        <span>{goal.weekly_hours}h/week</span>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-2">
                      <Link
                        href={`/goals/${goal.id}`}
                        className="flex-1 bg-indigo-600 text-white text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Details
                      </Link>
                      {goal.status === 'active' && (
                        <Link
                          href={`/goals/${goal.id}/session`}
                          className="flex-1 bg-white text-indigo-600 border border-indigo-600 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Start Session
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {goals && goals.length > 0 && (
          <div className="mt-12 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Stats</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-indigo-600">
                    {goals.filter(g => g.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Active Goals</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {goals.filter(g => g.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {goals.reduce((sum, g) => sum + (g.completed_sessions || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Sessions</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(
                      goals.reduce((sum, g) => {
                        const progress = calculateProgress(g)
                        return sum + progress
                      }, 0) / goals.length
                    )}%
                  </div>
                  <div className="text-sm text-gray-600">Average Progress</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}