'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'

interface Job {
    id: number
    title: string
    description: string
    requirements: string
    department: { id: number; name: string }
    closing_date: string
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [job, setJob] = useState<Job | null>(null)
    const [loading, setLoading] = useState(true)
    const [applying, setApplying] = useState(false)
    const [coverLetter, setCoverLetter] = useState('')
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [hasApplied, setHasApplied] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { user } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return
        if (!user) { router.push('/login'); return }
        fetchJob()
        checkApplication()
    }, [mounted, user])

    const fetchJob = async () => {
        try {
            const res = await api.get(`/jobs/${id}/`)
            setJob(res.data)
        } finally {
            setLoading(false)
        }
    }

    const checkApplication = async () => {
        const res = await api.get('/jobs/applications/')
        const applied = res.data.some((app: { job: { id: number } }) => app.job.id === Number(id))
        setHasApplied(applied)
    }

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault()
        setApplying(true)
        setMessage(null)
        try {
            await api.post(`/jobs/${id}/apply/`, { cover_letter: coverLetter })
            setHasApplied(true)
            setMessage({ type: 'success', text: 'Application submitted successfully!' })
        } catch {
            setMessage({ type: 'error', text: 'Failed to apply. You may have already applied.' })
        } finally {
            setApplying(false)
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    if (!job) return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-gray-500">Job not found.</p>
        </div>
    )

    return (
        <main className="px-4 py-6 max-w-2xl mx-auto">
            <button onClick={() => router.back()} className="text-sm text-blue-600 mb-4 hover:underline">
                ← Back to jobs
            </button>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-6">
                <p className="text-sm text-blue-600 mb-1">{job.department.name}</p>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{job.title}</h1>
                <p className="text-xs text-gray-400 mb-4">Closes: {job.closing_date}</p>

                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{job.description}</p>

                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Requirements</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{job.requirements}</p>
            </div>

            {hasApplied ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 text-sm text-green-700 dark:text-green-400">
                    ✓ You have already applied for this job.
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                    <h2 className="font-semibold text-gray-800 dark:text-white mb-4">Apply for this role</h2>

                    {message && (
                        <div className={`mb-4 text-sm px-4 py-2 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleApply} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Cover Letter <span className="text-gray-400">(optional)</span>
                            </label>
                            <textarea
                                value={coverLetter}
                                onChange={e => setCoverLetter(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Tell us why you're a great fit..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={applying}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {applying ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </form>
                </div>
            )}
        </main>
    )
}
