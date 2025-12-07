'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { resumeApi, Resume } from '@/lib/api'
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Calendar,
  ArrowLeft,
  Loader2
} from 'lucide-react'

export default function CandidateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const resumeId = parseInt(params.id as string)

  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResumeDetails = async () => {
      try {
        setLoading(true)
        const response = await resumeApi.getResume(resumeId)
        setResume(response.data)
      } catch (err: any) {
        console.error('Error fetching resume:', err)
        setError(err.response?.data?.detail || 'Failed to load candidate details')
      } finally {
        setLoading(false)
      }
    }

    if (resumeId) {
      fetchResumeDetails()
    }
  }, [resumeId])

  const handleContactClick = () => {
    if (resume?.candidate_email) {
      window.location.href = `mailto:${resume.candidate_email}`
    }
  }

  const handleShowResume = async () => {
    try {
      // Fetch the PDF with authentication using axios (which has interceptors for auth)
      const response = await resumeApi.getResume(resumeId)
      
      // Get the authenticated URL by making a fetch request with credentials
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const token = localStorage.getItem('token')
      
      // Fetch the PDF blob with authentication
      const pdfResponse = await fetch(`${baseUrl}/api/v1/resumes/${resumeId}/download`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      
      if (!pdfResponse.ok) {
        throw new Error('Failed to load resume')
      }
      
      // Create a blob URL and open it
      const blob = await pdfResponse.blob()
      const blobUrl = URL.createObjectURL(blob)
      
      // Open in new tab with the blob URL
      const newWindow = window.open(blobUrl, '_blank')
      if (newWindow) {
        newWindow.opener = null
        // Clean up the blob URL after a delay
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
      }
    } catch (err) {
      console.error('Error opening resume:', err)
      alert('Failed to open resume. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-secondary-bg overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !resume) {
    return (
      <div className="flex-1 p-8 bg-secondary-bg overflow-auto">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="bg-white dark:bg-[#1a1f2e] rounded-xl p-8 text-center">
            <p className="text-red-500">{error || 'Candidate not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="flex-1 p-8 bg-secondary-bg overflow-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Header Card */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-xl p-8 shadow-sm border border-border/20">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  {resume.candidate_name || 'Candidate'}
                </h1>
                <div className="flex flex-wrap gap-4 text-text-secondary">
                  {resume.candidate_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{resume.candidate_email}</span>
                    </div>
                  )}
                  {resume.candidate_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{resume.candidate_phone}</span>
                    </div>
                  )}
                  {!resume.candidate_email && !resume.candidate_phone && (
                    <div className="text-sm text-text-tertiary italic">
                      Contact information not available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {resume.candidate_email && (
                <button
                  onClick={handleContactClick}
                  className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">Contact</span>
                </button>
              )}
              <button
                onClick={handleShowResume}
                className="flex items-center gap-2 px-6 py-3 bg-secondary-fg hover:bg-primary-fg text-text-primary rounded-lg transition-all hover:scale-105 active:scale-95 border border-border/20"
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">Show Resume</span>
              </button>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {resume.extracted_skills && resume.extracted_skills.length > 0 && (
          <div className="bg-white dark:bg-[#1a1f2e] rounded-xl p-6 shadow-sm border border-border/20">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {resume.extracted_skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {resume.extracted_experience && (
          <div className="bg-white dark:bg-[#1a1f2e] rounded-xl p-6 shadow-sm border border-border/20">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Experience</h2>
            </div>
            <div className="text-text-secondary">
              {typeof resume.extracted_experience === 'object' ? (
                <div className="space-y-3">
                  {Object.entries(resume.extracted_experience).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="font-medium text-text-primary capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{String(resume.extracted_experience)}</p>
              )}
            </div>
          </div>
        )}

        {/* Education Section */}
        {resume.extracted_education && resume.extracted_education.length > 0 && (
          <div className="bg-white dark:bg-[#1a1f2e] rounded-xl p-6 shadow-sm border border-border/20">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Education</h2>
            </div>
            <div className="space-y-4">
              {resume.extracted_education.map((edu, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <h3 className="font-medium text-text-primary">
                    {edu.degree || 'Degree'}
                  </h3>
                  {edu.institution && (
                    <p className="text-text-secondary text-sm">{edu.institution}</p>
                  )}
                  {edu.year && (
                    <p className="text-text-tertiary text-sm">{edu.year}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Info Section */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-xl p-6 shadow-sm border border-border/20">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-text-primary">Resume Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-text-tertiary text-sm mb-1">File Name</p>
              <p className="text-text-primary font-medium">{resume.file_name}</p>
            </div>
            <div>
              <p className="text-text-tertiary text-sm mb-1">File Size</p>
              <p className="text-text-primary font-medium">{formatFileSize(resume.file_size)}</p>
            </div>
            <div>
              <p className="text-text-tertiary text-sm mb-1">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                resume.status === 'processed' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {resume.status}
              </span>
            </div>
            <div>
              <p className="text-text-tertiary text-sm mb-1">Uploaded</p>
              <div className="flex items-center gap-2 text-text-primary font-medium">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(resume.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
