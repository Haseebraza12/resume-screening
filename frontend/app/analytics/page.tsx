'use client'

import { Download, Filter } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">Analytics Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View key metrics and performance for your recruitment pipeline.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
          <Download className="w-5 h-5" />
          <span className="font-bold text-sm">Export Data</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
            Date Range
          </label>
          <button className="flex w-full h-10 items-center justify-between gap-x-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 pl-4 pr-2">
            <p className="text-sm font-medium">Last 30 Days</p>
            <Filter className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
            Job Role
          </label>
          <button className="flex w-full h-10 items-center justify-between gap-x-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 pl-4 pr-2">
            <p className="text-sm font-medium">All Roles</p>
            <Filter className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
            Match Threshold
          </label>
          <button className="flex w-full h-10 items-center justify-between gap-x-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 pl-4 pr-2">
            <p className="text-sm font-medium">70%+</p>
            <Filter className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
            Status
          </label>
          <button className="flex w-full h-10 items-center justify-between gap-x-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 pl-4 pr-2">
            <p className="text-sm font-medium">All Status</p>
            <Filter className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Distribution Chart */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Top Skills Distribution</h3>
          <div className="space-y-3">
            {[
              { skill: 'JavaScript/TypeScript', count: 156, percentage: 85 },
              { skill: 'React.js', count: 142, percentage: 78 },
              { skill: 'Python', count: 128, percentage: 70 },
              { skill: 'Node.js', count: 115, percentage: 63 },
              { skill: 'SQL/Databases', count: 98, percentage: 54 },
            ].map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.skill}</span>
                  <span className="text-gray-600 dark:text-gray-400">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Levels */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Experience Levels</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { level: 'Entry Level', count: 45, color: 'bg-blue-500' },
              { level: 'Mid Level', count: 78, color: 'bg-secondary' },
              { level: 'Senior', count: 92, color: 'bg-accent' },
              { level: 'Lead/Principal', count: 33, color: 'bg-purple-500' },
            ].map((item, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className={`w-12 h-12 ${item.color} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold`}>
                  {item.count}
                </div>
                <p className="text-sm font-medium">{item.level}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Match Score Distribution */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Match Score Distribution</h3>
          <div className="space-y-3">
            {[
              { range: '90-100%', count: 24, color: 'bg-green-500' },
              { range: '80-89%', count: 52, color: 'bg-blue-500' },
              { range: '70-79%', count: 68, color: 'bg-yellow-500' },
              { range: '60-69%', count: 45, color: 'bg-orange-500' },
              { range: 'Below 60%', count: 59, color: 'bg-red-500' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-3 h-3 ${item.color} rounded-full`} />
                  <span className="text-sm font-medium">{item.range}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full`}
                      style={{ width: `${(item.count / 248) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-8 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hiring Pipeline */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Hiring Pipeline Status</h3>
          <div className="space-y-4">
            {[
              { stage: 'New Applications', count: 124, color: 'bg-blue-500' },
              { stage: 'Screening', count: 67, color: 'bg-yellow-500' },
              { stage: 'Interview', count: 32, color: 'bg-orange-500' },
              { stage: 'Offer', count: 18, color: 'bg-green-500' },
              { stage: 'Hired', count: 7, color: 'bg-secondary' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-8 ${item.color} rounded-full`} />
                  <span className="font-medium">{item.stage}</span>
                </div>
                <span className="text-lg font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Average Match Score
          </p>
          <p className="text-4xl font-black text-primary">76.4%</p>
          <p className="text-sm text-secondary mt-1">+3.2% from last month</p>
        </div>
        <div className="glass-card rounded-xl p-6 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Time to Shortlist
          </p>
          <p className="text-4xl font-black text-primary">2.3 days</p>
          <p className="text-sm text-secondary mt-1">-18% faster</p>
        </div>
        <div className="glass-card rounded-xl p-6 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Offer Acceptance Rate
          </p>
          <p className="text-4xl font-black text-primary">89%</p>
          <p className="text-sm text-secondary mt-1">+5% improvement</p>
        </div>
      </div>
    </div>
  )
}
