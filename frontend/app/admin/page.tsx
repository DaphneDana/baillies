'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'

interface Application {
    id: number
    applicant: string
    job: {
        id: number
        title: string
        department: { id: number; name: string }
    }
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
    cover_letter: string
    applied_at: string
}

const statusStyles: Record<Application['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    reviewed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    accepted: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
}

const statusOptions = ['pending', 'reviewed', 'accepted', 'rejected']

export default function AdminDashboardPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const [updating, setUpdating] = useState<number | null>(null)
    const { user } = useAuthStore()
    const router = useRouter()

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (!mounted) return
        if (!user) { router.push('/login'); return }
        if (!user.is_admin) { router.push('/jobs'); return }
        fetchApplications()
    }, [mounted, user])

    const fetchApplications = async () => {
        try {
            const res = await api.get('/jobs/admin/applications/')
            setApplications(res.data)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (id: number, newStatus: string) => {
        setUpdating(id)
        try {
            const res = await api.patch(`/jobs/admin/applications/${id}/`, { status: newStatus })
            setApplications(prev =>
                prev.map(app => app.id === id ? { ...app, status: res.data.status } : app)
            )
        } finally {
            setUpdating(null)
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    return (
        <main className="px-4 py-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {applications.length} application{applications.length !== 1 ? 's' : ''} total
            </p>

            {applications.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <p className="text-gray-500 text-sm">No applications yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {applications.map(app => (
                        <div
                            key={app.id}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                    <h2 className="font-semibold text-gray-800 dark:text-white">{app.job.title}</h2>
                                    <p className="text-sm text-blue-600">{app.job.department.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                        Applicant: <span className="font-medium">{app.applicant}</span>
                                    </p>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize shrink-0 ${statusStyles[app.status]}`}>
                                    {app.status}
                                </span>
                            </div>

                            {app.cover_letter && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                                    {app.cover_letter}
                                </p>
                            )}

                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-gray-400">
                                    {new Date(app.applied_at).toLocaleDateString()}
                                </span>
                                <div className="flex gap-2 ml-auto flex-wrap">
                                    {statusOptions.filter(s => s !== app.status).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => updateStatus(app.id, s)}
                                            disabled={updating === app.id}
                                            className="text-xs px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400 disabled:opacity-50 capitalize"
                                        >
                                            {updating === app.id ? '...' : `Mark ${s}`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
