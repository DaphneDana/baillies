'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'
import {
    MdPerson,
    MdWork,
    MdCheckCircle,
    MdCancel,
    MdHourglassEmpty,
    MdVisibility,
    MdArrowForward,
    MdCalendarToday,
    MdInbox,
} from 'react-icons/md'

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

const statusConfig: Record<Application['status'], { label: string; className: string; icon: React.ReactNode }> = {
    pending: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
        icon: <MdHourglassEmpty size={14} />,
    },
    reviewed: {
        label: 'Reviewed',
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
        icon: <MdVisibility size={14} />,
    },
    accepted: {
        label: 'Accepted',
        className: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
        icon: <MdCheckCircle size={14} />,
    },
    rejected: {
        label: 'Rejected',
        className: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
        icon: <MdCancel size={14} />,
    },
}

export default function DashboardPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const { user } = useAuthStore()
    const router = useRouter()

    useEffect(() => { setMounted(true) }, [])

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
        <div className="flex-1 flex justify-center items-center">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    const counts = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        reviewed: applications.filter(a => a.status === 'reviewed').length,
        accepted: applications.filter(a => a.status === 'accepted').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
    }

    return (
        <main className="flex-1 bg-gray-50 dark:bg-gray-950">

            {/* Header */}
            <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                            <MdPerson size={22} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white leading-tight">
                                My Dashboard
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Welcome back, <span className="font-semibold text-blue-600">{user?.username}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Total Applied', value: counts.total, color: 'text-gray-800 dark:text-white', bg: 'bg-white dark:bg-gray-900' },
                        { label: 'Pending', value: counts.pending, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                        { label: 'Accepted', value: counts.accepted, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
                        { label: 'Rejected', value: counts.rejected, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
                    ].map(stat => (
                        <div key={stat.label} className={`${stat.bg} border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-4 text-center`}>
                            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Applications list */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">My Applications</h2>
                        <Link href="/jobs" className="flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium">
                            Browse more jobs <MdArrowForward size={16} />
                        </Link>
                    </div>

                    {applications.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl py-16 flex flex-col items-center text-center px-4">
                            <MdInbox size={48} className="text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No applications yet</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                You haven&apos;t applied for any jobs yet. Start exploring opportunities.
                            </p>
                            <Link
                                href="/jobs"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                            >
                                <MdWork size={16} /> Browse Job Openings
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {applications.map(app => {
                                const status = statusConfig[app.status]
                                return (
                                    <div
                                        key={app.id}
                                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            {/* Left: icon + info */}
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
                                                    <MdWork size={20} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <Link
                                                        href={`/jobs/${app.job.id}`}
                                                        className="font-bold text-gray-800 dark:text-white hover:text-blue-600 transition-colors"
                                                    >
                                                        {app.job.title}
                                                    </Link>
                                                    <p className="text-sm text-blue-600 mt-0.5">{app.job.department.name}</p>
                                                </div>
                                            </div>

                                            {/* Status badge */}
                                            <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 ${status.className}`}>
                                                {status.icon} {status.label}
                                            </span>
                                        </div>

                                        {app.cover_letter && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 border-l-2 border-gray-100 dark:border-gray-800 pl-3">
                                                {app.cover_letter}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                <MdCalendarToday size={13} />
                                                <span>Applied {new Date(app.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                            <Link
                                                href={`/jobs/${app.job.id}`}
                                                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:gap-2 transition-all"
                                            >
                                                View job <MdArrowForward size={13} />
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
