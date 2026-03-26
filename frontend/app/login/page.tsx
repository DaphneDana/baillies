'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'

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
            setError('Invalid username or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Welcome back</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Login to your Baillies account</p>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
                </p>
            </div>
        </main>
    )
}
