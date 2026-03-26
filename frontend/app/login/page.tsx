'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'
import { MdPersonOutline, MdLockOutline, MdArrowForward } from 'react-icons/md'

export default function LoginPage() {
    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { setAuth, user } = useAuthStore()
    const router = useRouter()

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (!mounted) return
        if (user) router.push('/jobs')
    }, [mounted, user])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const tokenRes = await api.post('/auth/login/', form)
            const token = tokenRes.data.token

            const userRes = await api.get('/auth/me/', {
                headers: { Authorization: `Token ${token}` }
            })

            setAuth(userRes.data, token)
            router.push('/jobs')
        } catch {
            setError('Invalid username or password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex-1 flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-4">
                        <MdLockOutline size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
                        Welcome back
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sign in to your Baillies account
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8">

                    {error && (
                        <div className="mb-5 flex items-start gap-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 rounded-xl">
                            <span className="mt-0.5">⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Username
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <MdPersonOutline size={20} />
                                </span>
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your username"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <MdLockOutline size={20} />
                                </span>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your password"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Signing in...' : (
                                <>Sign In <MdArrowForward size={18} /></>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        <span className="text-xs text-gray-400">or</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </div>

                    <Link
                        href="/register"
                        className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl text-sm font-semibold hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                        Create a new account
                    </Link>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">
                    Protected by Baillies secure authentication.
                </p>
            </div>
        </main>
    )
}
