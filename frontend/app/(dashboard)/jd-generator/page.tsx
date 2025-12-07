'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Wand2, Copy, Briefcase, Layers, Loader2, CheckCircle2 } from 'lucide-react'
import { api } from '@/lib/api'

export default function JDGeneratorPage() {
    const [formData, setFormData] = useState({
        jobTitle: '',
        department: '',
        keySkills: '',
        experienceLevel: 'Senior',
        employmentType: 'Full-time'
    })

    const [generatedJD, setGeneratedJD] = useState('')
    const [keywords, setKeywords] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)

    const handleGenerate = async () => {
        // Validation
        if (!formData.jobTitle.trim()) {
            setError('Please enter a job title')
            return
        }
        if (!formData.keySkills.trim()) {
            setError('Please enter at least one key skill')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await api.post('/jd-generator/generate', {
                job_title: formData.jobTitle,
                department: formData.department,
                key_skills: formData.keySkills,
                experience_level: formData.experienceLevel,
                employment_type: formData.employmentType
            })

            setGeneratedJD(response.data.job_description)
            setKeywords(response.data.extracted_keywords)
        } catch (err: any) {
            console.error('Generation error:', err)
            setError(err.response?.data?.detail || 'Failed to generate job description. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = () => {
        // Strip HTML tags for clean text copy
        const cleanText = generatedJD.replace(/<[^>]*>/g, '')
        navigator.clipboard.writeText(cleanText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-8 max-w-screen-cl mx-auto p-6 min-h-screen">
            <div>
                <h1 className="text-4xl font-bold text-text-primary">AI Job Description Generator</h1>
                <p className="text-text-secondary mt-1">
                    Create professional job descriptions in seconds using AI.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-6 space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-4">Job Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-text-primary mb-2">
                                    Job Title
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Senior Product Designer"
                                        value={formData.jobTitle}
                                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary-bg border-transparent focus:bg-white border focus:border-accent text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-0 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-primary mb-2">
                                    Department / Team
                                </label>
                                <div className="relative">
                                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Design Team"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary-bg border-transparent focus:bg-white border focus:border-accent text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-0 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-primary mb-2">
                                    Key Skills (Comma separated)
                                </label>
                                <textarea
                                    placeholder="e.g. Figma, Prototyping, User Research, Design Systems"
                                    rows={4}
                                    value={formData.keySkills}
                                    onChange={(e) => setFormData({ ...formData, keySkills: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-transparent focus:bg-white border focus:border-accent text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-0 transition-all resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-2">
                                        Experience Level
                                    </label>
                                    <select
                                        value={formData.experienceLevel}
                                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-transparent focus:bg-white border focus:border-accent text-text-primary focus:outline-none focus:ring-0 transition-all"
                                    >
                                        <option>Entry Level</option>
                                        <option>Mid Level</option>
                                        <option>Senior</option>
                                        <option>Lead / Manager</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-2">
                                        Employment Type
                                    </label>
                                    <select
                                        value={formData.employmentType}
                                        onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-secondary-bg border-transparent focus:bg-white border focus:border-accent text-text-primary focus:outline-none focus:ring-0 transition-all"
                                    >
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Remote</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                        </div>
                    )}

                    <Button
                        variant="default"
                        className="w-full"
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5 mr-2" />
                                Generate Description
                            </>
                        )}
                    </Button>
                </div>

                {/* Preview Area */}
                <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-8 flex flex-col h-full min-h-[600px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-text-primary">Generated Result</h3>
                        {generatedJD && (
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleCopy}
                                    className="text-text-secondary hover:text-primary transition-colors"
                                    title="Copy to clipboard"
                                >
                                    {copied ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <Copy className="w-5 h-5" />
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    {!generatedJD ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border/30 rounded-2xl bg-secondary-bg/30">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Wand2 className="w-8 h-8 text-primary" />
                            </div>
                            <h4 className="text-lg font-bold text-text-primary mb-2">Ready to Create</h4>
                            <p className="text-text-secondary max-w-xs">
                                Fill in the details on the left and let our AI craft the perfect job description for you.
                            </p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto">
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <div
                                    className="whitespace-pre-wrap text-text-primary"
                                    dangerouslySetInnerHTML={{
                                        __html: generatedJD
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/(About the Role|Key Responsibilities|Required Qualifications|What We Offer)/g, '<br/><br/><strong>$1</strong>')
                                            .replace(/<\/strong><br\/><br\/>/g, '</strong>') // Fix double breaks if any
                                    }}
                                />
                            </div>

                            {keywords.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-border/30">
                                    <p className="text-sm font-bold text-text-secondary mb-3">Extracted Keywords:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {keywords.map((keyword, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
