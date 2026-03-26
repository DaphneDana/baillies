'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import Image from 'next/image'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'
import {
    MdArrowBack,
    MdBusiness,
    MdCalendarToday,
    MdCheckCircle,
    MdSend,
    MdErrorOutline,
} from 'react-icons/md'

interface Job {
    id: number
    title: string
    description: string
    requirements: string
    department: { id: number; name: string }
    closing_date: string
}

const jobImages = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=500&fit=crop&q=80',
]

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

    useEffect(() => { setMounted(true) }, [])

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
        <div className="flex-1 flex justify-center items-center">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    if (!job) return (
        <div className="flex-1 flex justify-center items-center">
            <p className="text-gray-500">Job not found.</p>
        </div>
    )

    const imageSrc = jobImages[job.id % jobImages.length]

    return (
        <main className="flex-1 bg-gray-50 dark:bg-gray-950">

            {/* Hero image banner */}
            <div className="relative w-full h-56 md:h-80">
                <Image
                    src={imageSrc}
                    alt={job.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 flex items-center gap-1.5 text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <MdArrowBack size={18} /> Back to jobs
                </button>

                {/* Job title overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 py-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                {job.department.name}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                            {job.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Left — job details */}
                    <div className="flex-1 flex flex-col gap-6">

                        {/* Meta info */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <MdBusiness size={18} className="text-blue-600" />
                                <span>{job.department.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <MdCalendarToday size={18} className="text-blue-600" />
                                <span>Closes {job.closing_date}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">About this role</h2>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                {job.description}
                            </p>
                        </div>

                        {/* Requirements */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Requirements</h2>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                {job.requirements}
                            </p>
                        </div>
                    </div>

                    {/* Right — apply card */}
                    <div className="lg:w-96 shrink-0">
                        <div className="sticky top-6">
                            {hasApplied ? (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-6 text-center">
                                    <MdCheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                                    <h3 className="font-bold text-green-700 dark:text-green-400 text-lg mb-1">
                                        Application Submitted
                                    </h3>
                                    <p className="text-sm text-green-600 dark:text-green-500">
                                        You have already applied for this position. Check your dashboard for updates.
                                    </p>
                                    <button
                                        onClick={() => router.push('/dashboard')}
                                        className="mt-4 w-full bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
                                    >
                                        View My Applications
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Apply for this role</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                                        Tell us why you&apos;re a great fit for <span className="font-medium text-gray-700 dark:text-gray-300">{job.title}</span>.
                                    </p>

                                    {message && (
                                        <div className={`mb-4 flex items-start gap-2 text-sm px-4 py-3 rounded-xl border ${
                                            message.type === 'success'
                                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                                                : 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 dark:border-red-800'
                                        }`}>
                                            {message.type === 'success'
                                                ? <MdCheckCircle size={16} className="mt-0.5 shrink-0" />
                                                : <MdErrorOutline size={16} className="mt-0.5 shrink-0" />
                                            }
                                            {message.text}
                                        </div>
                                    )}

                                    <form onSubmit={handleApply} className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                                Cover Letter <span className="text-gray-400 font-normal">(optional)</span>
                                            </label>
                                            <textarea
                                                value={coverLetter}
                                                onChange={e => setCoverLetter(e.target.value)}
                                                rows={6}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                                                placeholder="Describe your experience, motivation, and why you're the right fit..."
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={applying}
                                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                        >
                                            {applying ? 'Submitting...' : <><MdSend size={16} /> Submit Application</>}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}
