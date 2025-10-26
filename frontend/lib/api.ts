import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API functions
export const resumeApi = {
  uploadResumes: async (formData: FormData) => {
    return api.post('/api/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  
  analyzeResumes: async (jobId: string) => {
    return api.get(`/api/resumes/analyze/${jobId}`)
  },
  
  compareResumes: async (resumeIds: string[]) => {
    return api.post('/api/resumes/compare', { resume_ids: resumeIds })
  },
}

export const jobApi = {
  createJob: async (data: any) => {
    return api.post('/api/jobs', data)
  },
  
  getJobs: async () => {
    return api.get('/api/jobs')
  },
  
  getJob: async (id: string) => {
    return api.get(`/api/jobs/${id}`)
  },
}

export const chatApi = {
  sendMessage: async (message: string, jobId?: string) => {
    return api.post('/api/chat', { message, job_id: jobId })
  },
}

export const analyticsApi = {
  getDashboard: async () => {
    return api.get('/api/analytics/dashboard')
  },
}
