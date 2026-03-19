'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Target, Calendar, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface StudyGoal {
  title: string;
  description: string;
  target_date: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  study_frequency: 'daily' | 'weekly' | 'bi-weekly';
  estimated_hours: number;
}

export default function CreateGoalPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<StudyGoal>({
    title: '',
    description: '',
    target_date: '',
    difficulty_level: 'beginner',
    study_frequency: 'daily',
    estimated_hours: 10
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { error } = await supabase
        .from('study_goals')
        .insert({
          ...formData,
          user_id: user.id,
          status: 'active',
          progress: 0,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Generate initial study plan
      const studyPlan = generateStudyPlan(formData);
      
      const { error: planError } = await supabase
        .from('study_plans')
        .insert(studyPlan.map(session => ({
          ...session,
          user_id: user.id,
          goal_id: null // Will be updated after goal creation
        })));

      if (planError) throw planError;

      router.push('/goals');
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Failed to create goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateStudyPlan = (goal: StudyGoal) => {
    const targetDate = new Date(goal.target_date);
    const today = new Date();
    const daysDiff = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    const sessionsNeeded = Math.ceil(goal.estimated_hours / 2); // 2 hours per session
    const sessionInterval = Math.floor(daysDiff / sessionsNeeded);
    
    const sessions = [];
    for (let i = 0; i < sessionsNeeded; i++) {
      const sessionDate = new Date(today);
      sessionDate.setDate(today.getDate() + (i * sessionInterval));
      
      sessions.push({
        title: `Study Session ${i + 1}`,
        description: `Focus on ${goal.title} concepts and practice`,
        scheduled_date: sessionDate.toISOString().split('T')[0],
        duration_minutes: 120,
        status: 'pending',
        session_type: i < sessionsNeeded / 2 ? 'learning' : 'practice'
      });
    }
    
    return sessions;
  };

  const handleInputChange = (field: keyof StudyGoal, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to this topic' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some prior knowledge' },
    { value: 'advanced', label: 'Advanced', description: 'Extensive experience' }
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily', description: 'Study every day' },
    { value: 'weekly', label: 'Weekly', description: 'Study once per week' },
    { value: 'bi-weekly', label: 'Bi-weekly', description: 'Study twice per week' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/goals"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Goals
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Create Study Goal</CardTitle>
            <CardDescription>
              Define your learning objective and we'll create a personalized study plan
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Goal Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Master React Fundamentals"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you want to learn and achieve..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target_date" className="text-sm font-medium">
                    Target Completion Date *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="target_date"
                      type="date"
                      value={formData.target_date}
                      onChange={(e) => handleInputChange('target_date', e.target.value)}
                      required
                      className="pl-10"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_hours" className="text-sm font-medium">
                    Estimated Study Hours
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="estimated_hours"
                      type="number"
                      min="1"
                      max="1000"
                      value={formData.estimated_hours}
                      onChange={(e) => handleInputChange('estimated_hours', parseInt(e.target.value) || 10)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Difficulty Level</Label>
                <Select
                  value={formData.difficulty_level}
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                    handleInputChange('difficulty_level', value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-xs text-gray-500">{level.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Study Frequency</Label>
                <Select
                  value={formData.study_frequency}
                  onValueChange={(value: 'daily' | 'weekly' | 'bi-weekly') => 
                    handleInputChange('study_frequency', value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        <div>
                          <div className="font-medium">{freq.label}</div>
                          <div className="text-xs text-gray-500">{freq.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      What happens next?
                    </h4>
                    <p className="text-sm text-blue-700">
                      We'll create a personalized study plan with scheduled sessions, 
                      track your progress, and suggest relevant study materials based on your goal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/goals')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formData.title || !formData.target_date}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Creating Goal...' : 'Create Goal'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}