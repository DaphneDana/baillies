'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'
import {
    MdAdminPanelSettings,
    MdWork,
    MdBusiness,
    MdPerson,
    MdHourglassEmpty,
    MdVisibility,
    MdCheckCircle,
    MdCancel,
    MdCalendarToday,
    MdInbox,
    MdArrowForward,
} from 'react-icons/md'

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

const statusConfig: Record<Application['status'], { label: string; className: string; icon: React.ReactNode }> = {
    pending:  { label: 'Pending',  className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400', icon: <MdHourglassEmpty size={13} /> },
    reviewed: { label: 'Reviewed', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',         icon: <MdVisibility size={13} /> },
    accepted: { label: 'Accepted', className: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',     icon: <MdCheckCircle size={13} /> },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',             icon: <MdCancel size={13} /> },
}

const statusOptions = ['pending', 'reviewed', 'accepted', 'rejected'] as const

const actionConfig: Record<string, string> = {
    pending:  'bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100',
    reviewed: 'bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100',
    accepted: 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-100',
    rejected: 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100',
}

export default function AdminDashboardPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const [updating, setUpdating] = useState<number | null>(null)
    const [filter, setFilter] = useState<Application['status'] | 'all'>('all')
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
        <div className="flex-1 flex justify-center items-center">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    const counts = {
        all:      applications.length,
        pending:  applications.filter(a => a.status === 'pending').length,
        reviewed: applications.filter(a => a.status === 'reviewed').length,
        accepted: applications.filter(a => a.status === 'accepted').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
    }

    const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter)

    return (
        <main className="flex-1 bg-gray-50 dark:bg-gray-950">

            {/* Header */}
            <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-8">
                <div className="max-w-4xl mx-auto">

                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                <MdAdminPanelSettings size={22} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white leading-tight">
                                    Admin Dashboard
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Welcome, <span className="font-semibold text-blue-600">{user?.username}</span>
                                </p>
                            </div>
                        </div>

                        {/* Quick nav */}
                        <div className="flex gap-2 shrink-0">
                            <Link
                                href="/admin/jobs"
                                className="flex items-center gap-1.5 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-colors"
                            >
                                <MdWork size={16} /> Jobs
                            </Link>
                            <Link
                                href="/admin/departments"
                                className="flex items-center gap-1.5 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-colors"
                            >
                                <MdBusiness size={16} /> Departments
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: 'Total',    value: counts.all,      color: 'text-gray-800 dark:text-white',         bg: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' },
                            { label: 'Pending',  value: counts.pending,  color: 'text-yellow-600 dark:text-yellow-400',  bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
                            { label: 'Accepted', value: counts.accepted, color: 'text-green-600 dark:text-green-400',    bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
                            { label: 'Rejected', value: counts.rejected, color: 'text-red-500 dark:text-red-400',        bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
                        ].map(s => (
                            <div key={s.label} className={`${s.bg} border rounded-xl px-4 py-3 text-center`}>
                                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-5">

                {/* Filter tabs */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Applications</h2>
                    <div className="flex gap-1.5 flex-wrap justify-end">
                        {(['all', ...statusOptions] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize transition-colors ${
                                    filter === s
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400'
                                }`}
                            >
                                {s} {s !== 'all' ? `(${counts[s]})` : `(${counts.all})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Applications list */}
                {filtered.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl py-16 flex flex-col items-center text-center px-4">
                        <MdInbox size={48} className="text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No applications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {filter === 'all' ? 'No applications have been submitted yet.' : `No ${filter} applications.`}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filtered.map(app => {
                            const status = statusConfig[app.status]
                            return (
                                <div key={app.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">

                                    {/* Top row */}
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                                <MdPerson size={18} className="text-blue-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-800 dark:text-white truncate">{app.applicant}</p>
                                                <p className="text-sm text-blue-600 font-medium truncate">{app.job.title}</p>
                                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                                    <MdBusiness size={12} /> {app.job.department.name}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 ${status.className}`}>
                                            {status.icon} {status.label}
                                        </span>
                                    </div>

                                    {/* Cover letter */}
                                    {app.cover_letter && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 border-l-2 border-gray-100 dark:border-gray-800 pl-3">
                                            {app.cover_letter}
                                        </p>
                                    )}

                                    {/* Footer row */}
                                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <MdCalendarToday size={13} />
                                            {new Date(app.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>

                                        {/* Status actions */}
                                        <div className="flex gap-1.5 flex-wrap justify-end">
                                            {statusOptions.filter(s => s !== app.status).map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => updateStatus(app.id, s)}
                                                    disabled={updating === app.id}
                                                    className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border capitalize disabled:opacity-50 transition-colors ${actionConfig[s]}`}
                                                >
                                                    {updating === app.id ? '...' : (
                                                        <>{statusConfig[s].icon} {s}</>
                                                    )}
                                                </button>
                                            ))}
                                            <Link
                                                href={`/jobs/${app.job.id}`}
                                                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 transition-colors"
                                            >
                                                View job <MdArrowForward size={12} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}
