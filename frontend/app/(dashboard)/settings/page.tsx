'use client'

import { useState } from 'react'
import { User, Lock, Bell, Save, Eye, EyeOff, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button' 

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Form states
  const [fullName, setFullName] = useState('Demo User')
  const [email, setEmail] = useState('demo@example.com')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [matchNotifications, setMatchNotifications] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(false)

  const handleProfileUpdate = () => {
    // TODO: Implement profile update API call
    alert('Profile updated successfully!')
  }

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long!')
      return
    }
    // TODO: Implement password change API call
    alert('Password changed successfully!')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleNotificationUpdate = () => {
    // TODO: Implement notification preferences API call
    alert('Notification preferences updated!')
  }

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion API call
    if (confirm('Are you absolutely sure? This action cannot be undone and will permanently delete your account and all associated data.')) {
      alert('Account deletion initiated. You will be logged out.')
      // Redirect to login or home
    }
    setShowDeleteConfirm(false)
  }

  return (
    <div className="flex h-full max-w-screen-cl mx-auto p-6 min-h-screen gap-8">
      {/* Settings Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <nav className="space-y-2 sticky top-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 ${activeTab === 'profile'
              ? 'bg-accent-light text-white'
              : 'text-text-secondary hover:bg-secondary-bg hover:text-text-primary'
              }`}
          >
            <User className="w-5 h-5" />
            <p className={`text-sm ${activeTab === 'profile' ? 'font-medium' : 'font-medium'}`}>
              Profile
            </p>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 ${activeTab === 'password'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:bg-secondary-bg hover:text-text-primary'
              }`}
          >
            <Lock className="w-5 h-5" />
            <p className={`text-sm ${activeTab === 'password' ? 'font-medium' : 'font-medium'}`}>
              Change Password
            </p>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 ${activeTab === 'notifications'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:bg-secondary-bg hover:text-text-primary'
              }`}
          >
            <Bell className="w-5 h-5" />
            <p className={`text-sm ${activeTab === 'notifications' ? 'font-medium' : 'font-medium'}`}>
              Notifications
            </p>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-text-primary">Profile Settings</h1>
              <p className="text-text-secondary mt-1">
                Manage your personal information and account details
              </p>
            </div>

            <div className="bg-primary-bg rounded-3xl p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-transparent focus:bg-white border focus:border-accent text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-0 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-transparent focus:bg-white border focus:border-accent text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-0 transition-all"
                  />
                  <p className="text-xs text-text-tertiary mt-1">
                    This email will be used for account notifications
                  </p>
                </div>
              </div>

              <Button
                onClick={handleProfileUpdate}
                variant="default"
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>

            {/* Danger Zone - Delete Account */}
            <div className="w-full bg-status-warning/10 border border-status-warning/20 rounded-3xl p-4 flex items-start gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-red-900 dark:text-red-200 mb-2">Danger Zone</h4>
                  <p className="text-sm text-red-700 dark:text-red-300/80 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>

                  {!showDeleteConfirm ? (
                    <Button
                      onClick={() => setShowDeleteConfirm(true)}
                      variant="default"
                      size="sm"
                      className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 transition-colors font-bold shadow-sm"
                    >
                      Delete Account
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-full bg-primary-bg rounded-xl p-4 flex items-start gap-3">
                        <p className="text-sm font-bold text-red-900 dark:text-red-200">
                          ⚠️ Are you absolutely sure?
                        </p>
                        <p className="text-xs text-red-800 dark:text-red-300 mt-1">
                          This will permanently delete your account, all resumes, jobs, and matches. This action cannot be undone.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleDeleteAccount}
                          variant="default"
                          size="sm"
                          className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 transition-colors font-bold shadow-sm"
              
                        >
                          Yes, Delete My Account
                        </Button>
                        <Button
                          onClick={() => setShowDeleteConfirm(false)}
                          variant="default"
                          size="sm"
                          className="flex items-center gap-2 bg-secondary-bg text-text-primary hover:bg-secondary-bg/80 transition-colors font-bold"
                        > 
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-text-primary">Change Password</h1>
              <p className="text-text-secondary mt-1">
                Update your password to keep your account secure
              </p>
            </div>

            <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary-bg border-transparent focus:bg-white border focus:border-accent text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-0 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary-bg border-transparent focus:bg-white border focus:border-accent text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-0 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-text-tertiary mt-1">
                    Must be at least 6 characters long
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary-bg border-transparent focus:bg-white border focus:border-accent text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-0 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePasswordChange}
                variant="default"
                className="flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Update Password
              </Button>
            </div>

            {/* Security Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-6 border border-blue-100 dark:border-blue-800/30">
              <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2">Password Security Tips</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-300/80 space-y-1 list-disc list-inside">
                <li>Use a unique password you don't use anywhere else</li>
                <li>Include a mix of letters, numbers, and symbols</li>
                <li>Avoid common words or personal information</li>
                <li>Consider using a password manager</li>
              </ul>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-text-primary">Notification Preferences</h1>
              <p className="text-text-secondary mt-1">
                Choose how you want to be notified about activity
              </p>
            </div>

            <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border/30">
                  <div>
                    <h4 className="font-bold text-text-primary">Email Notifications</h4>
                    <p className="text-sm text-text-secondary">
                      Receive email updates about your account activity
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary-bg peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border/30">
                  <div>
                    <h4 className="font-bold text-text-primary">Match Notifications</h4>
                    <p className="text-sm text-text-secondary">
                      Get notified when new resume matches are found
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={matchNotifications}
                      onChange={(e) => setMatchNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary-bg peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="font-bold text-text-primary">Weekly Reports</h4>
                    <p className="text-sm text-text-secondary">
                      Receive weekly summary of your screening activity
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={weeklyReports}
                      onChange={(e) => setWeeklyReports(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary-bg peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              <Button
                onClick={handleNotificationUpdate}
                variant="default"
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
