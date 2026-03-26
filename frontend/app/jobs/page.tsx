'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'
import { MdWork, MdCalendarToday, MdArrowForward, MdSearchOff, MdChevronLeft, MdChevronRight } from 'react-icons/md'

interface Job {
    id: number
    title: string
    description: string
    department: { id: number; name: string }
    closing_date: string
    is_active: boolean
}

// Curated Unsplash photos — office, teamwork, professional settings
const jobImages = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop&q=80',
]

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [departments, setDepartments] = useState<{ id: number; name: string }[]>([])
    const [selectedDept, setSelectedDept] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const { user } = useAuthStore()
    const router = useRouter()

    useEffect(() => { setMounted(true) }, [])

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

    const JOBS_PER_PAGE = 5
    const [currentPage, setCurrentPage] = useState(1)

    const filtered = selectedDept
        ? jobs.filter(j => j.department.id === selectedDept)
        : jobs

    const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE)
    const paginated = filtered.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE)

    const handleDeptChange = (deptId: number | null) => {
        setSelectedDept(deptId)
        setCurrentPage(1)
    }

    if (loading) return (
        <div className="flex-1 flex justify-center items-center">
            <p className="text-gray-500">Loading jobs...</p>
        </div>
    )

    return (
        <main className="flex-1 bg-gray-50 dark:bg-gray-950">

            {/* Page header */}
            <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 mb-1">
                        <MdWork size={20} className="text-blue-600" />
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                            Job Openings
                        </h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        {jobs.length} position{jobs.length !== 1 ? 's' : ''} available across {departments.length} department{departments.length !== 1 ? 's' : ''}
                    </p>

                    {/* Department filters */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleDeptChange(null)}
                            className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-colors ${
                                !selectedDept
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600'
                            }`}
                        >
                            All ({jobs.length})
                        </button>
                        {departments.map(dept => {
                            const count = jobs.filter(j => j.department.id === dept.id).length
                            return (
                                <button
                                    key={dept.id}
                                    onClick={() => handleDeptChange(dept.id)}
                                    className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-colors ${
                                        selectedDept === dept.id
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600'
                                    }`}
                                >
                                    {dept.name} ({count})
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Job list */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <MdSearchOff size={48} className="text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No jobs found in this department.</p>
                        <button onClick={() => handleDeptChange(null)} className="mt-3 text-sm text-blue-600 hover:underline">
                            View all openings
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-5">
                            {paginated.map((job, index) => {
                                const imageSrc = jobImages[job.id % jobImages.length]
                                return (
                                    <Link
                                        key={job.id}
                                        href={`/jobs/${job.id}`}
                                        className="group flex flex-col sm:flex-row bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xl hover:shadow-blue-50 dark:hover:shadow-none transition-all duration-300"
                                    >
                                        {/* Image side */}
                                        <div className="relative sm:w-64 h-52 sm:h-auto shrink-0">
                                            <Image
                                                src={imageSrc}
                                                alt={job.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, 256px"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                                                <span className="text-white text-sm font-semibold">{job.department.name}</span>
                                            </div>
                                        </div>

                                        {/* Content side */}
                                        <div className="flex flex-col justify-between flex-1 p-6">
                                            <div>
                                                <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors mb-3">
                                                    {job.title}
                                                </h2>
                                                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 line-clamp-4 leading-relaxed">
                                                    {job.description}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                                                    <MdCalendarToday size={15} />
                                                    <span>Closes {job.closing_date}</span>
                                                </div>
                                                <span className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                                                    View role <MdArrowForward size={16} />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Page {currentPage} of {totalPages} — {filtered.length} jobs
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <MdChevronLeft size={18} /> Prev
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                                                    page === currentPage
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next <MdChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}
