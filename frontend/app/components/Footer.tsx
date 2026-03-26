import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-8 mt-auto">
            <div className="max-w-3xl mx-auto flex flex-row items-center justify-between gap-3">
                <p className="text-sm font-semibold text-blue-600">Baillies Career Portal</p>

                <div className="flex items-center gap-4">
                    <Link href="/jobs" className="text-xs text-gray-400 hover:text-blue-600">Jobs</Link>
                    <Link href="/register" className="text-xs text-gray-400 hover:text-blue-600">Register</Link>
                    <Link href="/login" className="text-xs text-gray-400 hover:text-blue-600">Login</Link>
                    <span className="text-xs text-gray-300 dark:text-gray-600">|</span>
                    <span className="text-xs text-gray-400">© {new Date().getFullYear()} Baillies</span>
                </div>
            </div>
        </footer>
    )
}
