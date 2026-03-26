'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'
import {
    MdWork,
    MdAdd,
    MdClose,
    MdCheckCircle,
    MdErrorOutline,
    MdCalendarToday,
    MdBusiness,
    MdToggleOn,
    MdToggleOff,
    MdArrowBack,
} from 'react-icons/md'

interface Department {
    id: number
    name: string
}

interface Job {
    id: number
    title: string
    department: { id: number; name: string }
    is_active: boolean
    closing_date: string
}

const inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [departments, setDepartments] = useState<Department[]>([])
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ title: '', description: '', requirements: '', department_id: '', closing_date: '' })
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [togglingId, setTogglingId] = useState<number | null>(null)
    const { user } = useAuthStore()
    const router = useRouter()

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (!mounted) return
        if (!user) { router.push('/login'); return }
        if (!user.is_admin) { router.push('/jobs'); return }
        fetchData()
    }, [mounted, user])

    const fetchData = async () => {
        try {
            const [jobsRes, deptsRes] = await Promise.all([
                api.get('/jobs/admin/jobs/'),
                api.get('/jobs/departments/')
            ])
            setJobs(jobsRes.data)
            setDepartments(deptsRes.data)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setMessage(null)
        try {
            const res = await api.post('/jobs/admin/jobs/', form)
            setJobs(prev => [res.data, ...prev])
            setMessage({ type: 'success', text: 'Job posted successfully!' })
            setForm({ title: '', description: '', requirements: '', department_id: '', closing_date: '' })
            setShowForm(false)
        } catch {
            setMessage({ type: 'error', text: 'Failed to post job. Please try again.' })
        } finally {
            setSubmitting(false)
        }
    }

    const toggleActive = async (job: Job) => {
        setTogglingId(job.id)
        try {
            const res = await api.patch(`/jobs/admin/jobs/${job.id}/`, { is_active: !job.is_active })
            setJobs(prev => prev.map(j => j.id === job.id ? { ...j, is_active: res.data.is_active } : j))
        } finally {
            setTogglingId(null)
        }
    }

    if (loading) return (
        <div className="flex-1 flex justify-center items-center">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    const activeCount = jobs.filter(j => j.is_active).length
    const inactiveCount = jobs.length - activeCount

    return (
        <main className="flex-1 bg-gray-50 dark:bg-gray-950">

            {/* Header */}
            <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4">
                        <MdArrowBack size={16} /> Back to applications
                    </Link>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <MdWork size={22} className="text-blue-600" />
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white leading-tight">
                                    Manage Jobs
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {jobs.length} job{jobs.length !== 1 ? 's' : ''} total
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setShowForm(!showForm); setMessage(null) }}
                            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${
                                showForm
                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {showForm ? <><MdClose size={18} /> Cancel</> : <><MdAdd size={18} /> Post Job</>}
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-center border border-gray-200 dark:border-gray-700">
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{jobs.length}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total Jobs</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-3 text-center border border-green-200 dark:border-green-800">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Active</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 text-center border border-gray-200 dark:border-gray-700">
                            <p className="text-2xl font-bold text-gray-500 dark:text-gray-400">{inactiveCount}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Inactive</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-5">

                {/* Message */}
                {message && (
                    <div className={`flex items-center gap-3 text-sm px-4 py-3 rounded-xl border ${
                        message.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 dark:border-red-800'
                    }`}>
                        {message.type === 'success' ? <MdCheckCircle size={18} /> : <MdErrorOutline size={18} />}
                        {message.text}
                    </div>
                )}

                {/* Post job form */}
                {showForm && (
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-5">Post a New Job</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Job Title</label>
                                <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Senior Software Engineer" className={inputClass} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Department</label>
                                    <select name="department_id" value={form.department_id} onChange={handleChange} required className={inputClass}>
                                        <option value="">Select department</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Closing Date</label>
                                    <input type="date" name="closing_date" value={form.closing_date} onChange={handleChange} required className={inputClass} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                                <textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Describe the role and responsibilities..." className={`${inputClass} resize-none`} />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Requirements</label>
                                <textarea name="requirements" value={form.requirements} onChange={handleChange} required rows={3} placeholder="List the qualifications and skills required..." className={`${inputClass} resize-none`} />
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                                    {submitting ? 'Posting...' : 'Post Job'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3 rounded-xl text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Jobs list */}
                {jobs.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl py-16 flex flex-col items-center text-center px-4">
                        <MdWork size={48} className="text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No jobs posted yet</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Click &quot;Post Job&quot; to add your first listing.</p>
                        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                            <MdAdd size={16} /> Post First Job
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                            <MdWork size={20} className="text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <h2 className="font-bold text-gray-800 dark:text-white truncate">{job.title}</h2>
                                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                                <span className="flex items-center gap-1 text-xs text-blue-600">
                                                    <MdBusiness size={13} /> {job.department.name}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                                    <MdCalendarToday size={13} /> Closes {job.closing_date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Active toggle */}
                                    <button
                                        onClick={() => toggleActive(job)}
                                        disabled={togglingId === job.id}
                                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 transition-colors disabled:opacity-50 ${
                                            job.is_active
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {job.is_active
                                            ? <><MdToggleOn size={16} /> Active</>
                                            : <><MdToggleOff size={16} /> Inactive</>
                                        }
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
