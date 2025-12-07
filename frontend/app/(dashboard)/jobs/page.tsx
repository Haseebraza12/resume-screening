'use client'

import { useEffect, useState } from 'react'
import { jobApi, Job } from '@/lib/api'
import { Briefcase, Search, Loader2, Trash2, Edit, Users, Calendar, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await jobApi.getJobs()
      setJobs(response.data)
    } catch (err: any) {
      console.error('Error fetching jobs:', err)
      setError(err.response?.data?.detail || 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return

    try {
      await jobApi.deleteJob(jobId)
      setJobs(jobs.filter(job => job.id !== jobId))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete job')
    }
  }

  const handleMatchAllResumes = async (jobId: number) => {
    try {
      await jobApi.matchAllResumes(jobId)
      alert('Successfully matched all resumes to this job!')
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to match resumes')
    }
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading jobs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto p-6 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-text-primary">Job Postings</h1>
        <p className="text-text-secondary mt-2 text-base">
          View and manage your job openings
        </p>
      </div>

      {/* Search Bar */}
        <div className="flex items-center h-12 px-4 rounded-full bg-secondary-fg border border-border/30 gap-3 group focus-within:border-primary/50 transition-colors">
          <Search className="w-5 h-5 text-text-secondary group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-text-primary placeholder-text-tertiary w-full text-sm font-medium"
          />
        </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-12 text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-accent" />
          <h3 className="text-xl font-bold mb-2 text-text-primary">No job postings yet</h3>
          <p className="text-text-secondary mb-6">
            Jobs must be created manually via database
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-primary-bg rounded-3xl shadow-sm hover:border border-border/30 p-6 transition-all duration-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-text-primary">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        📍 {job.location}
                      </span>
                    )}
                    {job.job_type && (
                      <span className="capitalize">{job.job_type}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {job.status === 'active' ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm font-medium">
                      <XCircle className="w-4 h-4" />
                      {job.status}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-text-secondary mb-4 line-clamp-3">
                {job.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <div className="flex items-center gap-2 text-sm text-text-tertiary">
                  <Calendar className="w-4 h-4" />
                  {new Date(job.created_at).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMatchAllResumes(job.id)}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
                    title="Match all resumes"
                  >
                    <Users className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                  </button>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="p-2 hover:bg-secondary-bg rounded-lg transition-colors group"
                    title="View details"
                  >
                    <Edit className="w-5 h-5 text-text-secondary group-hover:text-text-primary group-hover:scale-110 transition-all" />
                  </Link>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors group"
                    title="Delete job"
                  >
                    <Trash2 className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
