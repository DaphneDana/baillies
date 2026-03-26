'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'

interface Job {
    id: number
    title: string
    description: string
    department: { id: number; name: string }
    closing_date: string
    is_active: boolean
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [departments, setDepartments] = useState<{ id: number; name: string }[]>([])
    const [selectedDept, setSelectedDept] = useState<number | null>(null)
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
        fetchData()
    }, [mounted, user])

    const fetchData = async () => {
        try {
            const [jobsRes, deptsRes] = await Promise.all([
                api.get('/jobs/'),
                api.get('/jobs/departments/')
            ])
            setJobs(jobsRes.data)
            setDepartments(deptsRes.data)
        } finally {
            setLoading(false)
        }
    }

    const filtered = selectedDept
        ? jobs.filter(j => j.department.id === selectedDept)
        : jobs

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-gray-500">Loading jobs...</p>
        </div>
    )

    return (
        <main className="px-4 py-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Job Openings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Browse available positions</p>

            {/* Department filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setSelectedDept(null)}
                    className={`text-sm px-3 py-1 rounded-full border ${!selectedDept ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 dark:text-gray-300 dark:border-gray-600'}`}
                >
                    All
                </button>
                {departments.map(dept => (
                    <button
                        key={dept.id}
                        onClick={() => setSelectedDept(dept.id)}
                        className={`text-sm px-3 py-1 rounded-full border ${selectedDept === dept.id ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 dark:text-gray-300 dark:border-gray-600'}`}
                    >
                        {dept.name}
                    </button>
                ))}
            </div>

            {/* Job list */}
            {filtered.length === 0 ? (
                <p className="text-gray-500 text-sm">No jobs found.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.map(job => (
                        <Link
                            key={job.id}
                            href={`/jobs/${job.id}`}
                            className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-400 transition"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h2 className="font-semibold text-gray-800 dark:text-white">{job.title}</h2>
                                    <p className="text-sm text-blue-600 mt-0.5">{job.department.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{job.description}</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-3">Closes: {job.closing_date}</p>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    )
}
