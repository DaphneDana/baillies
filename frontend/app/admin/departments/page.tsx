'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'
import {
    MdBusiness,
    MdAdd,
    MdArrowBack,
    MdCheckCircle,
    MdErrorOutline,
    MdDomain,
} from 'react-icons/md'

interface Department {
    id: number
    name: string
}

const colors = [
    'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
    'bg-violet-50 dark:bg-violet-900/20 text-violet-600',
    'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
    'bg-rose-50 dark:bg-rose-900/20 text-rose-600',
    'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600',
    'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600',
    'bg-pink-50 dark:bg-pink-900/20 text-pink-600',
]

export default function AdminDepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([])
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const [name, setName] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const { user } = useAuthStore()
    const router = useRouter()

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (!mounted) return
        if (!user) { router.push('/login'); return }
        if (!user.is_admin) { router.push('/jobs'); return }
        fetchDepartments()
    }, [mounted, user])

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/jobs/admin/departments/')
            setDepartments(res.data)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setMessage(null)
        try {
            const res = await api.post('/jobs/admin/departments/', { name })
            setDepartments(prev => [...prev, res.data])
            setMessage({ type: 'success', text: `"${name}" added successfully!` })
            setName('')
        } catch {
            setMessage({ type: 'error', text: 'Failed to add department. Please try again.' })
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <div className="flex-1 flex justify-center items-center">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    return (
        <main className="flex-1 bg-gray-50 dark:bg-gray-950">

            {/* Header */}
            <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4">
                        <MdArrowBack size={16} /> Back to applications
                    </Link>
                    <div className="flex items-center gap-3">
                        <MdBusiness size={22} className="text-blue-600" />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white leading-tight">
                                Manage Departments
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {departments.length} department{departments.length !== 1 ? 's' : ''} configured
                            </p>
                        </div>
                    </div>

                    {/* Stat */}
                    <div className="mt-6 inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-3">
                        <MdDomain size={20} className="text-blue-600" />
                        <div>
                            <p className="text-xl font-bold text-gray-800 dark:text-white leading-none">{departments.length}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Departments</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">

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

                {/* Add department form */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                    <h2 className="text-base font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <MdAdd size={20} className="text-blue-600" /> Add New Department
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            placeholder="e.g. Engineering, Marketing, Finance..."
                            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0"
                        >
                            <MdAdd size={18} />
                            {submitting ? 'Adding...' : 'Add Department'}
                        </button>
                    </form>
                </div>

                {/* Department list */}
                <div>
                    <h2 className="text-base font-bold text-gray-800 dark:text-white mb-3">
                        All Departments
                    </h2>

                    {departments.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl py-16 flex flex-col items-center text-center px-4">
                            <MdBusiness size={48} className="text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No departments yet</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Add your first department using the form above.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {departments.map((dept, index) => {
                                const colorClass = colors[index % colors.length]
                                const initial = dept.name.charAt(0).toUpperCase()
                                return (
                                    <div
                                        key={dept.id}
                                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex items-center gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-base ${colorClass}`}>
                                            {initial}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-800 dark:text-white truncate">{dept.name}</p>
                                            <p className="text-xs text-gray-400">Department #{dept.id}</p>
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
