'use client'

import { useState, useEffect } from 'react'
import { Star, FileText, Trash2, Loader2 } from 'lucide-react'
import { favoritesApi } from '@/lib/api'

interface FavoriteResume {
  favorite_id: number
  resume_id: number
  candidate_name: string
  file_name: string
  skills: string[]
  match_score: number | null
  created_at: string
  resume_created_at: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteResume[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<number | null>(null)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const response = await favoritesApi.getFavorites()
      setFavorites(response.data.favorites || [])
    } catch (error) {
      console.error('Failed to load favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (resumeId: number) => {
    setRemovingId(resumeId)
    try {
      await favoritesApi.removeFavorite(resumeId)
      setFavorites(favorites.filter(f => f.resume_id !== resumeId))
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      alert('Failed to remove favorite. Please try again.')
    } finally {
      setRemovingId(null)
    }
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-text-secondary bg-secondary-bg'
    if (score >= 70) return 'text-green-700 bg-green-100 dark:bg-green-900/30'
    if (score >= 50) return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30'
    return 'text-red-700 bg-red-100 dark:bg-red-900/30'
  }

  return (
    <div className="space-y-6 max-w-screen-cl mx-auto p-6 min-h-screen">
      <div>
        <h1 className="text-4xl font-bold text-text-primary">
          Favorites
        </h1>
        <p className="text-text-secondary mt-2 text-base">
          Your starred resumes
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-text-secondary">Loading favorites...</p>
          </div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-primary-bg rounded-3xl shadow-md p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <Star className="w-16 h-16 mx-auto text-accent" />
            <h2 className="text-xl font-bold text-text-primary">
              No Favorites Yet
            </h2>
            <p className="text-text-secondary">
              Star your favorite resumes to access them quickly from this page.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {favorites.map((favorite) => (
            <div
              key={favorite.favorite_id}
              className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* File Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                {/* Candidate Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">
                        {favorite.candidate_name}
                      </h3>
                      <p className="text-sm text-text-secondary mt-1">
                        {favorite.file_name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Match Score */}
                      {favorite.match_score !== null && (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(favorite.match_score)}`}
                        >
                          {favorite.match_score}%
                        </span>
                      )}

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFavorite(favorite.resume_id)}
                        disabled={removingId === favorite.resume_id}
                        className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
                        title="Remove from favorites"
                      >
                        {removingId === favorite.resume_id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Skills */}
                  {favorite.skills && favorite.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {favorite.skills.slice(0, 8).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-secondary-bg text-text-primary border border-border/30 text-xs font-medium rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                      {favorite.skills.length > 8 && (
                        <span className="px-2 py-1 text-text-secondary text-xs font-medium">
                          +{favorite.skills.length - 8} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-text-tertiary">
                    <span>Favorited: {new Date(favorite.created_at).toLocaleDateString()}</span>
                    {favorite.resume_created_at && (
                      <span>Uploaded: {new Date(favorite.resume_created_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
