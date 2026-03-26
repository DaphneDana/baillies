'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'

export default function HomePage() {
    const [mounted, setMounted] = useState(false)
    const { user } = useAuthStore()
    const router = useRouter()

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (!mounted) return
        if (user) router.push('/jobs')
    }, [mounted, user])

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Hero */}
            <section className="px-4 py-16 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    Find Your Next Role at Baillies
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
                    Browse open positions across all departments, submit your application, and track your progress — all in one place.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/register"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                        Get Started
                    </Link>
                    <Link
                        href="/login"
                        className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg text-sm font-medium hover:border-blue-400"
                    >
                        Login
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="px-4 pb-16 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                        <div className="text-2xl mb-3">🔍</div>
                        <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">Browse Jobs</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Explore openings across all departments filtered to your interest.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                        <div className="text-2xl mb-3">📄</div>
                        <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">Easy Apply</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Submit your application with a cover letter in just a few clicks.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                        <div className="text-2xl mb-3">📊</div>
                        <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">Track Progress</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Monitor the status of all your applications from your dashboard.</p>
                    </div>
                </div>
            </section>
        </main>
    )
}
