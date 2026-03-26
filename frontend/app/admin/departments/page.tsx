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
            setMessage({ type: 'success', text: 'Department added!' })
            setName('')
        } catch {
            setMessage({ type: 'error', text: 'Failed to add department.' })
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    return (
        <main className="px-4 py-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Departments</h1>
                <Link href="/admin" className="text-sm text-blue-600 hover:underline">← Back to applications</Link>
            </div>

            {message && (
                <div className={`mb-4 text-sm px-4 py-2 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-6">
                <h2 className="font-semibold text-gray-800 dark:text-white mb-4">Add Department</h2>
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="Department name"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {submitting ? '...' : 'Add'}
                    </button>
                </form>
            </div>

            <div className="flex flex-col gap-3">
                {departments.map(dept => (
                    <div key={dept.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
                        <p className="font-medium text-gray-800 dark:text-white">{dept.name}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}
