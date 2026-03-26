'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'

interface Application {
    id: number
    job: {
        id: number
        title: string
        department: { id: number; name: string }
        closing_date: string
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

export default function DashboardPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const { user } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return
        if (!user) { router.push('/login'); return }
        fetchApplications()
    }, [mounted, user])

    const fetchApplications = async () => {
        try {
            const res = await api.get('/jobs/applications/')
            setApplications(res.data)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    return (
        <main className="px-4 py-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">My Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Welcome, {user?.username}. Track your applications below.
            </p>

            {applications.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">You haven't applied for any jobs yet.</p>
                    <Link href="/jobs" className="text-sm text-blue-600 hover:underline">
                        Browse job openings
                    </Link>
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
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusStyles[app.status]}`}>
                                    {app.status}
                                </span>
                            </div>
                            {app.cover_letter && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                                    {app.cover_letter}
                                </p>
                            )}
                            <p className="text-xs text-gray-400">
                                Applied: {new Date(app.applied_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
