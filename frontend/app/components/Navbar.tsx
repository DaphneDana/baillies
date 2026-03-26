'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useAuthStore from '@/store/authStore'
import useThemeStore from '@/store/themeStore'
import { MdLightMode, MdDarkMode } from 'react-icons/md'

export default function Navbar() {
    const { user, logout } = useAuthStore()
    const { theme, toggleTheme } = useThemeStore()
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
            {/* Top bar */}
            <div className="flex items-center justify-between">
                <Link href="/" className="text-4xl font-bold text-blue-600">
                    Baillies.
                </Link>

                <div className="flex items-center gap-2">
                    {/* Theme toggle — mobile only */}
                    <button
                        onClick={toggleTheme}
                        className="md:hidden text-lg px-3 py-3 rounded border border-gray-300 dark:border-gray-600 dark:text-white"
                    >
                        {theme === 'light' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
                    </button>

                    {/* Hamburger — mobile only */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-gray-600 dark:text-gray-300 p-1"
                    >
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Theme toggle — desktop */}
                    <button
                        onClick={toggleTheme}
                        className="text-lg w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-400 transition-colors dark:text-white"
                    >
                        {theme === 'light' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
                    </button>
                    {user ? (
                        <>
                            <Link href="/jobs" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600">
                                Jobs
                            </Link>
                            <Link href="/dashboard" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600">
                                Dashboard
                            </Link>
                            {user.is_admin && (
                                <Link href="/admin/jobs" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600">
                                    Admin
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-base text-gray-600 dark:text-gray-300 hover:text-blue-600">
                                Login
                            </Link>
                            <Link href="/register" className="text-base bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden mt-3 flex flex-col gap-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                    {user ? (
                        <>
                            <Link href="/jobs" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 dark:text-gray-300">
                                Jobs
                            </Link>
                            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 dark:text-gray-300">
                                Dashboard
                            </Link>
                            {user.is_admin && (
                                <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 dark:text-gray-300">
                                    Admin
                                </Link>
                            )}
                            <button onClick={handleLogout} className="text-sm text-left text-red-500">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" onClick={() => setMenuOpen(false)} className="text-lg text-gray-600 dark:text-gray-300">
                                Login
                            </Link>
                            <Link href="/register" onClick={() => setMenuOpen(false)} className="text-sm text-blue-600 font-medium">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    )
}
