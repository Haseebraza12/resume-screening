'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Lock, User, Loader2, Eye, EyeOff, Globe } from 'lucide-react'
import { authApi } from '@/lib/api'
import { Button } from '@/components/ui/button'


interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialMode?: 'login' | 'signup' // Optional prop to control initial mode
}

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    full_name: ''
  })

  // Update isLogin when initialMode changes
  useEffect(() => {
    setIsLogin(initialMode === 'login')
  }, [initialMode])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isLogin) {
        // Login - use email for username field
        console.log('Attempting login with:', formData.email)
        const response = await authApi.login(formData.email, formData.password)
        console.log('Login successful:', response)
        onSuccess()
      } else {
        // Register
        console.log('Attempting registration with:', {
          email: formData.email,
          username: formData.username,
          full_name: formData.full_name
        })
        await authApi.register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          full_name: formData.full_name
        })
        // Auto login after registration
        await authApi.login(formData.email, formData.password)
        onSuccess()
      }
    } catch (err: any) {
      console.error('Auth error details:', err)
      // console.error('Error response:', err.response?.data) // Removed this line

      // More detailed error messages
      let errorMessage = 'Authentication failed. Please try again.'

      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail
      } else if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials.'
      } else if (err.response?.status === 400) { // This block was removed in the instruction, but kept here as per the {{...}}
        errorMessage = err.response?.data?.detail || 'Bad request. Please check your input.'
      } else if (err.message) { // This block was removed in the instruction, but kept here as per the {{...}}
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setError(null)
    setFormData({
      email: '',
      password: '',
      username: '',
      full_name: ''
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-[480px] max-h-[90vh] bg-primary-bg rounded-3xl shadow-2xl animate-scale-in overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary-bg transition-colors text-text-tertiary hover:text-text-primary z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 md:p-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-4">
              <img src="/logo-accent.png" alt="Rankify Logo" className="h-10 w-auto" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {isLogin ? 'Log in' : 'Create your account'}
            </h2>
            <p className="text-text-secondary text-sm">
              Use your work email for a better experience
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-status-error/10 border border-status-error/20 rounded-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-status-error shrink-0" />
                <p className="text-sm text-status-error font-medium">{error}</p>
              </div>
            )}

            {/* Full Name (Register only) */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-transparent focus:bg-white border focus:border-accent text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-0 transition-all"
                  required={!isLogin}
                />
              </div>
            )}

            {/* Username (Register only) */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-transparent focus:bg-white border focus:border-accent text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-0 transition-all"
                  required={!isLogin}
                />
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-primary">
                Work email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-transparent focus:bg-white border focus:border-accent text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-0 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-primary">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-transparent focus:bg-white border focus:border-accent text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-0 transition-all pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-tertiary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Continue with email' : 'Create account'
              )}
            </Button>

            {isLogin && (
              <div className="text-center">
                <button type="button" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                  Forgot password?
                </button>
              </div>
            )}
          </form>



          {/* Footer */}
          <div className="mt-6 text-center space-y-4">
            <p className="text-xs text-text-tertiary leading-relaxed px-4">
              By signing up to the Rankify platform you understand and agree with our{' '}
              <a href="#" className="underline hover:text-text-secondary">Terms of Service</a> and{' '}
              <a href="#" className="underline hover:text-text-secondary">Privacy Policy</a>
            </p>

            <div className="pt-4 border-t border-border/30">
              <p className="text-sm text-text-secondary">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={switchMode} className="text-accent hover:underline font-medium">
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}
