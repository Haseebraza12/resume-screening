'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle2, XCircle, ArrowRightLeft, User, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'

interface Resume {
    id: number
    file_name: string
    candidate_name?: string
}

interface CandidateData {
    id: number
    name: string
    experience: string
    education: string
    skills: string[]
    match_score: number | null
    file_name: string
}

interface ComparisonData {
    common_skills: string[]
    unique_skills_1: string[]
    unique_skills_2: string[]
    skill_overlap_percentage: number
    match_score_diff: number | null
    cosine_similarity: number | null  // NEW: Text similarity percentage
    recommendation: string
}

export default function QuickComparePage() {
    const [resumes, setResumes] = useState<Resume[]>([])
    const [selectedResume1, setSelectedResume1] = useState<number | null>(null)
    const [selectedResume2, setSelectedResume2] = useState<number | null>(null)
    const [candidate1, setCandidate1] = useState<CandidateData | null>(null)
    const [candidate2, setCandidate2] = useState<CandidateData | null>(null)
    const [comparison, setComparison] = useState<ComparisonData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Fetch available resumes
    useEffect(() => {
        fetchResumes()
    }, [])

    const fetchResumes = async () => {
        try {
            const response = await api.get('/resumes/')
            setResumes(response.data)
        } catch (err) {
            console.error('Error fetching resumes:', err)
        }
    }

    // Compare when both candidates selected
    useEffect(() => {
        if (selectedResume1 && selectedResume2) {
            compareResumes()
        }
    }, [selectedResume1, selectedResume2])

    const compareResumes = async () => {
        if (!selectedResume1 || !selectedResume2) return

        setLoading(true)
        setError('')

        try {
            const response = await api.post('/resumes/compare', {
                resume_id_1: selectedResume1,
                resume_id_2: selectedResume2
            })

            setCandidate1(response.data.candidate_1)
            setCandidate2(response.data.candidate_2)
            setComparison(response.data.comparison)
        } catch (err: any) {
            console.error('Comparison error:', err)
            setError(err.response?.data?.detail || 'Failed to compare resumes')
        } finally {
            setLoading(false)
        }
    }

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <div className="space-y-8 max-w-screen-cl mx-auto p-6 min-h-screen">
            <div>
                <h1 className="text-4xl font-bold text-text-primary">Quick Compare</h1>
                <p className="text-text-secondary mt-1">
                    Compare candidates side-by-side to make better hiring decisions.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Candidate A Selection */}
                <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-6 flex flex-col items-center text-center">
                    {candidate1 ? (
                        <>
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl font-bold text-primary">{getInitials(candidate1.name)}</span>
                            </div>
                            <h3 className="text-xl font-bold text-text-primary">{candidate1.name}</h3>
                            <p className="text-text-secondary text-sm mb-6">{candidate1.file_name}</p>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-secondary-bg rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-border">
                                <User className="w-8 h-8 text-text-tertiary" />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary">Select Candidate</h3>
                            <p className="text-text-secondary text-sm mb-6">Choose first candidate</p>
                        </>
                    )}
                    <Select
                        value={selectedResume1?.toString() || ""}
                        onValueChange={(value) => setSelectedResume1(Number(value))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Candidate" />
                        </SelectTrigger>
                        <SelectContent>
                            {resumes.filter(r => r.id !== selectedResume2).map(resume => (
                                <SelectItem key={resume.id} value={resume.id.toString()}>
                                    {resume.candidate_name || resume.file_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* VS Badge */}
                <div className="flex items-center justify-center">
                    <div className="w-16 h-16 bg-secondary-bg rounded-full flex items-center justify-center border-4 border-primary-bg shadow-sm z-10">
                        {loading ? (
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        ) : (
                            <ArrowRightLeft className="w-6 h-6 text-text-tertiary" />
                        )}
                    </div>
                </div>

                {/* Candidate B Selection */}
                <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-6 flex flex-col items-center text-center">
                    {candidate2 ? (
                        <>
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl font-bold text-primary">{getInitials(candidate2.name)}</span>
                            </div>
                            <h3 className="text-xl font-bold text-text-primary">{candidate2.name}</h3>
                            <p className="text-text-secondary text-sm mb-6">{candidate2.file_name}</p>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-secondary-bg rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-border">
                                <User className="w-8 h-8 text-text-tertiary" />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary">Select Candidate</h3>
                            <p className="text-text-secondary text-sm mb-6">Choose second candidate</p>
                        </>
                    )}
                    <Select
                        value={selectedResume2?.toString() || ""}
                        onValueChange={(value) => setSelectedResume2(Number(value))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Candidate" />
                        </SelectTrigger>
                        <SelectContent>
                            {resumes.filter(r => r.id !== selectedResume1).map(resume => (
                                <SelectItem key={resume.id} value={resume.id.toString()}>
                                    {resume.candidate_name || resume.file_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Comparison Table */}
            {candidate1 && candidate2 && comparison && (
                <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 overflow-hidden">
                    <div className="p-6 border-b border-border/30">
                        <h3 className="text-lg font-bold text-text-primary">Comparison Analysis</h3>
                        {comparison.recommendation && (
                            <p className="text-sm text-text-secondary mt-2">{comparison.recommendation}</p>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <tbody className="divide-y divide-border/30">
                                {/* Experience */}
                                <tr className="hover:bg-secondary-bg/50 transition-colors">
                                    <td className="py-4 px-6 text-sm font-bold text-text-secondary">Experience</td>
                                    <td className="py-4 px-6 font-medium text-text-primary">{candidate1.experience}</td>
                                    <td className="py-4 px-6 font-medium text-text-primary">{candidate2.experience}</td>
                                </tr>

                                {/* Education */}
                                <tr className="hover:bg-secondary-bg/50 transition-colors">
                                    <td className="py-4 px-6 text-sm font-bold text-text-secondary">Education</td>
                                    <td className="py-4 px-6 font-medium text-text-primary">{candidate1.education}</td>
                                    <td className="py-4 px-6 font-medium text-text-primary">{candidate2.education}</td>
                                </tr>

                                {/* Skills */}
                                <tr className="hover:bg-secondary-bg/50 transition-colors">
                                    <td className="py-4 px-6 text-sm font-bold text-text-secondary">Skills</td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-wrap gap-2">
                                            {candidate1.skills.slice(0, 5).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-2 py-1 text-xs rounded-md font-bold ${comparison.common_skills.includes(skill)
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-primary/10 text-primary'
                                                        }`}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {candidate1.skills.length > 5 && (
                                                <span className="text-xs text-text-tertiary">+{candidate1.skills.length - 5} more</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-wrap gap-2">
                                            {candidate2.skills.slice(0, 5).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-2 py-1 text-xs rounded-md font-bold ${comparison.common_skills.includes(skill)
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-primary/10 text-primary'
                                                        }`}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {candidate2.skills.length > 5 && (
                                                <span className="text-xs text-text-tertiary">+{candidate2.skills.length - 5} more</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>

                                {/* Skill Overlap */}
                                <tr className="hover:bg-secondary-bg/50 transition-colors">
                                    <td className="py-4 px-6 text-sm font-bold text-text-secondary">Skill Overlap</td>
                                    <td colSpan={2} className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-4">
                                            <span className="font-bold text-text-primary">{comparison.skill_overlap_percentage}%</span>
                                            <span className="text-sm text-text-secondary">
                                                ({comparison.common_skills.length} common skills)
                                            </span>
                                        </div>
                                    </td>
                                </tr>

                                {/* Cosine Similarity */}
                                {comparison.cosine_similarity !== null && (
                                    <tr className="hover:bg-secondary-bg/50 transition-colors">
                                        <td className="py-4 px-6 text-sm font-bold text-text-secondary">Text Similarity</td>
                                        <td colSpan={2} className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center gap-4">
                                                <div className="flex-1 max-w-md h-2 bg-secondary-bg rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500"
                                                        style={{ width: `${comparison.cosine_similarity}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-bold text-blue-600">{comparison.cosine_similarity}%</span>
                                            </div>
                                            <p className="text-xs text-text-tertiary mt-1">Based on cosine similarity of resume content</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!candidate1 && !candidate2 && resumes.length === 0 && (
                <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-12 text-center">
                    <User className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-text-primary mb-2">No Resumes Available</h3>
                    <p className="text-text-secondary">Upload some resumes first to start comparing candidates.</p>
                </div>
            )}
        </div>
    )
}
