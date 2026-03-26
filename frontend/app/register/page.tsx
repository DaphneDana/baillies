'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'
import { MdPersonOutline, MdMailOutline, MdLockOutline, MdArrowForward } from 'react-icons/md'

export default function RegisterPage() {
    const [form, setForm] = useState({ username: '', email: '', password: '' })
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMismatch, setPasswordMismatch] = useState(false)
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
        const updated = { ...form, [e.target.name]: e.target.value }
        setForm(updated)
        if (e.target.name === 'password') {
            setPasswordMismatch(confirmPassword !== '' && confirmPassword !== e.target.value)
        }
    }

    const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value)
        setPasswordMismatch(e.target.value !== form.password)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (form.password !== confirmPassword) {
            setPasswordMismatch(true)
            return
        }
        setLoading(true)
        setError('')

        try {
            await api.post('/auth/register/', form)

            const tokenRes = await api.post('/auth/login/', {
                username: form.username,
                password: form.password,
            })
            const token = tokenRes.data.token

            const userRes = await api.get('/auth/me/', {
                headers: { Authorization: `Token ${token}` }
            })

            setAuth(userRes.data, token)
            router.push('/jobs')
        } catch (err: unknown) {
            const error = err as { response?: { data?: Record<string, string[]> } }
            const data = error.response?.data
            if (data) {
                const firstError = Object.values(data)[0]
                setError(Array.isArray(firstError) ? firstError[0] : 'Registration failed')
            } else {
                setError('Registration failed. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
    const inputBorder = "border-gray-300 dark:border-gray-600"
    const inputError = "border-red-400 dark:border-red-500"

    return (
        <main className="flex-1 flex items-start justify-center px-4 pt-10 pb-6 bg-gray-50 dark:bg-gray-950">
            <div className="w-full max-w-lg">

                {/* Header */}
                <div className="text-center mb-5">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
                        Create your account
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Join Baillies and find your next role
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

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

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
                                    placeholder="e.g. john_doe"
                                    className={`${inputClass} ${inputBorder}`}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Email address
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <MdMailOutline size={20} />
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                    className={`${inputClass} ${inputBorder}`}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Password
                                </label>
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
                                        placeholder="Min. 8 characters"
                                        className={`${inputClass} ${passwordMismatch ? inputError : inputBorder}`}
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <MdLockOutline size={20} />
                                    </span>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={handleConfirmChange}
                                        required
                                        placeholder="Repeat your password"
                                        className={`${inputClass} ${passwordMismatch ? inputError : inputBorder}`}
                                    />
                                </div>
                                {passwordMismatch && (
                                    <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                                )}
                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={loading || passwordMismatch}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors mt-1"
                        >
                            {loading ? 'Creating account...' : (
                                <>Create Account <MdArrowForward size={18} /></>
                            )}
                        </button>
                    </form>

                    <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">
                    By registering, you agree to the Baillies terms of service.
                </p>
            </div>
        </main>
    )
}
