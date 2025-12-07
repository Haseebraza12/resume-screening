'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Bell,
  HelpCircle,
  AlertTriangle,
  Plus,
  ArrowRight,
  Clock,
  Users,
  Briefcase,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { analyticsApi, authApi, jobApi, User, Job, DashboardStats } from '@/lib/api'

interface TopCandidate {
  resume_id: number
  candidate_name: string
  rerank_score: number
  job_title?: string
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [topCandidates, setTopCandidates] = useState<TopCandidate[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all data in parallel
        const [userRes, jobsRes, statsRes] = await Promise.all([
          authApi.getCurrentUser().catch(() => null),
          jobApi.getJobs(0, 10, 'active').catch(() => ({ data: [] })),
          analyticsApi.getDashboardStats().catch(() => null)
        ])

        setUser(userRes?.data || null)
        setJobs(jobsRes?.data || [])
        setStats(statsRes?.data || null)

        // Fetch top candidates from ranked overview if available
        try {
          const rankedRes = await analyticsApi.getRankedOverview(undefined, 50, 3)
          if (rankedRes?.data?.ranked_resumes) {
            setTopCandidates(rankedRes.data.ranked_resumes.slice(0, 3))
          }
        } catch (err) {
          // If ranked overview fails, try to get from matches
          console.log('No ranked candidates available yet')
        }

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Calculate time saved based on resume count (10 min per resume)
  const timeSaved = stats ? Math.round((stats.total_resumes * 10) / 60) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const userName = user?.full_name?.split(' ')[0] || user?.username || 'there'
  const activeJobCount = jobs.length
  const newCandidatesCount = stats?.pending_reviews || 0

  return (
    <div className="space-y-6 fade-in p-6 max-w-screen-xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary font-heading flex items-center gap-2">
            Hello, {userName} 👋
          </h1>
          <p className="text-text-secondary mt-1">
            {newCandidatesCount > 0
              ? `You have ${newCandidatesCount} new high-match candidates waiting for review.`
              : 'Upload resumes and create jobs to get started with AI-powered matching.'}
          </p>
        </div>
      </div>

      {/* Alert Banner - Only show if there's actual data */}
      {stats && stats.total_resumes > 0 && (
        <div className="w-full bg-status-warning/10 border border-status-warning/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-status-warning shrink-0 mt-0.5" />
          <p className="text-text-primary text-sm font-medium">
            You have processed {stats.total_resumes} resumes. <Link href="/analytics" className="text-accent hover:underline font-bold">View analytics</Link> to see detailed insights.
          </p>
        </div>
      )}

      {/* "Things to do" Section (Primary Action) */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-text-primary">Start a New Match</h2>
            <p className="text-text-secondary max-w-xl">
              Create a new job profile or upload resumes to get instant AI-powered matching and ranking.
            </p>
          </div>
          <Link href="/upload" className="flex gap-4 w-full md:w-auto">
            <Button className="w-full md:w-auto gap-2 shadow-md">
              <Plus className="w-5 h-5" />
              Upload Resumes
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Active Jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-accent-dark" />
            </div>
            <span className="text-xs font-medium bg-status-success/10 text-accent-dark px-3 py-1 rounded-full">
              {activeJobCount} Active
            </span>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Your Active Roles</h3>
          <div className="space-y-3 mb-6 flex-1">
            {jobs.length > 0 ? (
              jobs.slice(0, 3).map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary-bg hover:bg-secondary-bg/80 transition-colors cursor-pointer group">
                    <span className="text-sm font-medium text-text-primary truncate">{job.title}</span>
                    <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-text-secondary text-sm">No active jobs yet</p>
                <p className="text-text-tertiary text-xs mt-1">Create a job to get started</p>
              </div>
            )}
          </div>
          <Link href="/jobs" className="text-accent font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View All Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 2: Recent Top Matches */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="w-10 h-10 rounded-full dark:bg-purple-900/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent-dark" />
            </div>
            <span className="text-xs font-medium bg-status-success/10 text-accent-dark px-3 py-1 rounded-full">
              {topCandidates.length > 0 ? '90%+ Match' : 'No Matches'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Highest Scored Candidates</h3>
          <div className="space-y-4 mb-6 flex-1">
            {topCandidates.length > 0 ? (
              topCandidates.map((candidate) => (
                <div key={candidate.resume_id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                    {candidate.candidate_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-secondary truncate">{candidate.candidate_name}</p>
                    <p className="text-xs text-text-secondary truncate">{candidate.job_title || 'Candidate'}</p>
                  </div>
                  <span className="text-sm font-bold text-text-secondary">
                    {candidate.rerank_score ? Math.round(candidate.rerank_score * 100) : 0}%
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-text-secondary text-sm">No candidates yet</p>
                <p className="text-text-tertiary text-xs mt-1">Upload resumes to see matches</p>
              </div>
            )}
          </div>
          <Link href="/ranked-resumes" className="text-accent font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            Review Candidates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 3: Analytics */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent-dark" />
            </div>
            <span className="text-xs font-medium bg-status-success/10 text-accent-dark px-3 py-1 rounded-full">
              Insight
            </span>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Time Saved</h3>
          <div className="flex-1 flex flex-col justify-center mb-6">
            <p className="text-3xl font-bold text-text-primary mb-2">
              {timeSaved > 0 ? `${timeSaved} Hours` : 'Get Started'}
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              {timeSaved > 0 ? (
                <>
                  Rankify saved you <span className="font-bold text-text-primary">{timeSaved} hours</span> of manual screening by automating resume parsing and matching.
                </>
              ) : (
                'Upload resumes to start saving time with AI-powered screening.'
              )}
            </p>
          </div>
          <Link href="/analytics" className="text-accent font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            See Analytics <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
