'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'

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

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [departments, setDepartments] = useState<Department[]>([])
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        title: '',
        description: '',
        requirements: '',
        department_id: '',
        closing_date: '',
    })
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
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
            setMessage({ type: 'error', text: 'Failed to post job.' })
        } finally {
            setSubmitting(false)
        }
    }

    const toggleActive = async (job: Job) => {
        try {
            const res = await api.patch(`/jobs/admin/jobs/${job.id}/`, { is_active: !job.is_active })
            setJobs(prev => prev.map(j => j.id === job.id ? { ...j, is_active: res.data.is_active } : j))
        } catch {
            alert('Failed to update job.')
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    return (
        <main className="px-4 py-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Jobs</h1>
                    <Link href="/admin" className="text-sm text-blue-600 hover:underline">← Back to applications</Link>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    {showForm ? 'Cancel' : '+ Post Job'}
                </button>
            </div>

            {message && (
                <div className={`mb-4 text-sm px-4 py-2 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'}`}>
                    {message.text}
                </div>
            )}

            {showForm && (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-6">
                    <h2 className="font-semibold text-gray-800 dark:text-white mb-4">New Job</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            placeholder="Job title"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="Job description"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            name="requirements"
                            value={form.requirements}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="Requirements"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            name="department_id"
                            value={form.department_id}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select department</option>
                            {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            name="closing_date"
                            value={form.closing_date}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting ? 'Posting...' : 'Post Job'}
                        </button>
                    </form>
                </div>
            )}

            <div className="flex flex-col gap-4">
                {jobs.map(job => (
                    <div key={job.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="font-semibold text-gray-800 dark:text-white">{job.title}</h2>
                            <p className="text-sm text-blue-600">{job.department.name}</p>
                            <p className="text-xs text-gray-400 mt-1">Closes: {job.closing_date}</p>
                        </div>
                        <button
                            onClick={() => toggleActive(job)}
                            className={`text-xs px-3 py-1 rounded-full shrink-0 ${job.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/20' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}
                        >
                            {job.is_active ? 'Active' : 'Inactive'}
                        </button>
                    </div>
                ))}
            </div>
        </main>
    )
}
