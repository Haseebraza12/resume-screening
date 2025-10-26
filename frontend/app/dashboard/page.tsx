'use client'

import Link from 'next/link'
import { StatsCard } from '@/components/StatsCard'
import { FileText, Briefcase, CheckCircle, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8 fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's an overview of your recruitment activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Resumes"
          value="248"
          change="+12% from last month"
          icon={<FileText className="w-5 h-5 sm:w-6 sm:h-6" />}
          trend="up"
        />
        <StatsCard
          title="Active Jobs"
          value="12"
          change="+3 new this week"
          icon={<Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />}
          trend="up"
        />
        <StatsCard
          title="Matches Today"
          value="34"
          change="8 shortlisted"
          icon={<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
          trend="neutral"
        />
        <StatsCard
          title="Success Rate"
          value="87%"
          change="+5% improvement"
          icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
          trend="up"
        />
      </div>

      {/* Recent Activity */}
      <div className="glassmorphism-card rounded-xl p-4 sm:p-6 transition-all duration-300">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3 sm:space-y-4">
          {[
            { name: 'Sarah Johnson', role: 'Senior Product Designer', score: 94, time: '2 hours ago' },
            { name: 'Michael Chen', role: 'Full Stack Developer', score: 89, time: '5 hours ago' },
            { name: 'Emily Rodriguez', role: 'Data Scientist', score: 92, time: '1 day ago' },
            { name: 'David Kim', role: 'UX Researcher', score: 88, time: '1 day ago' },
          ].map((candidate, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer hover:scale-[1.01] gap-3 sm:gap-0"
            >
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-xs sm:text-sm">
                    {candidate.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base truncate">{candidate.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{candidate.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Match Score</p>
                  <p className="font-bold text-base sm:text-lg text-secondary">{candidate.score}%</p>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">{candidate.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="glassmorphism-card rounded-xl p-4 sm:p-6 transition-all duration-300">
          <h3 className="text-base sm:text-lg font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/upload"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              Upload New Resumes
            </Link>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
              Create Job Posting
            </button>
          </div>
        </div>

        <div className="glassmorphism-card rounded-xl p-4 sm:p-6 transition-all duration-300">
          <h3 className="text-base sm:text-lg font-bold mb-4">Top Skills in Demand</h3>
          <div className="space-y-2.5 sm:space-y-3">
            {[
              { skill: 'React.js', count: 45 },
              { skill: 'Python', count: 38 },
              { skill: 'UI/UX Design', count: 32 },
              { skill: 'Data Analysis', count: 28 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded transition-colors duration-200">
                <span className="text-xs sm:text-sm font-medium">{item.skill}</span>
                <span className="text-xs sm:text-sm font-semibold text-primary">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
