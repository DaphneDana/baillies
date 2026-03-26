'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import { MdSearch, MdOutlineArticle, MdBarChart } from 'react-icons/md'

function useCountUp(target: number, duration: number = 1500) {
    const [count, setCount] = useState(0)
    const triggered = useRef(false)
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !triggered.current) {
                    triggered.current = true
                    const steps = 60
                    const increment = target / steps
                    const interval = duration / steps
                    let current = 0
                    const timer = setInterval(() => {
                        current += increment
                        if (current >= target) {
                            setCount(target)
                            clearInterval(timer)
                        } else {
                            setCount(Math.floor(current))
                        }
                    }, interval)
                }
            },
            { threshold: 0.3 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [target, duration])

    return { count, ref }
}

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
    const { count, ref } = useCountUp(value)
    return (
        <div ref={ref} className="text-center">
            <p className="text-xl md:text-3xl font-bold text-blue-600">{count}{suffix}</p>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
        </div>
    )
}

const features = [
    {
        icon: MdSearch,
        title: 'Browse Jobs',
        description: 'Explore openings across all departments filtered to your skills.',
    },
    {
        icon: MdOutlineArticle,
        title: 'Easy Apply',
        description: 'Submit your application and cover letter in just a few clicks.',
    },
    {
        icon: MdBarChart,
        title: 'Track Progress',
        description: 'Monitor every application live from your personal dashboard.',
    },
]

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
        <main className="flex-1 bg-gray-50 dark:bg-gray-950 flex flex-col justify-center">
            <div className="px-4 md:px-6 py-6 md:py-10 max-w-4xl mx-auto w-full flex flex-col gap-6 md:gap-8">

                {/* Hero */}
                <section className="text-center">
                    {/* <div className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs md:text-sm font-medium px-3 py-1 rounded-full mb-3">
                        Now hiring across all departments
                    </div> */}

                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-3">
                        You&apos;re Welcome to <br className="hidden sm:block" />
                        <span className="text-blue-600">Baillies Job Portal</span>
                    </h1>

                    <p className="text-sm md:text-lg text-gray-500 dark:text-gray-400 mb-5 max-w-xl mx-auto leading-relaxed">
                        Browse open positions, submit your application with ease, and track your progress — all in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/register"
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm md:text-base font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
                        >
                            Get Started — It&apos;s Free
                        </Link>
                        <Link
                            href="/login"
                            className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl text-sm md:text-base font-semibold hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors"
                        >
                            I Already Have an Account
                        </Link>
                    </div>
                </section>

                {/* Stats bar */}
                <section>
                    <div className="grid grid-cols-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-4 md:px-6 md:py-5">
                        <StatCard value={50} suffix="+" label="Open Roles" />
                        <div className="border-x border-gray-200 dark:border-gray-700">
                            <StatCard value={10} suffix="+" label="Departments" />
                        </div>
                        <StatCard value={100} suffix="%" label="Free to Apply" />
                    </div>
                </section>

                {/* Feature cards */}
                <section>
                    <h2 className="text-base md:text-2xl font-bold text-gray-800 dark:text-white text-center mb-4">
                        Everything you need to land your next role
                    </h2>

                    <div className="grid grid-cols-3 gap-3 md:gap-6">
                        {features.map((f) => {
                            const Icon = f.icon
                            return (
                                <div
                                    key={f.title}
                                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 md:p-7 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 cursor-default"
                                >
                                    <div className="mb-3">
                                        <Icon size={28} className="text-blue-600" />
                                    </div>
                                    <h3 className="text-sm md:text-lg font-bold text-gray-800 dark:text-white mb-1 md:mb-2">{f.title}</h3>
                                    <p className="text-xs md:text-base text-gray-500 dark:text-gray-400 leading-relaxed hidden sm:block">{f.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* CTA */}
                {/* <section>
                    <div className="bg-blue-600 rounded-2xl px-2 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm md:text-base font-semibold text-white text-center sm:text-left">
                            Ready to take the next step? Join Baillies today.
                        </p>
                        <Link
                            href="/register"
                            className="shrink-0 bg-white text-blue-600 font-bold px-5 py-2 rounded-xl text-sm hover:bg-blue-50 transition-colors"
                        >
                            Create Your Account
                        </Link>
                    </div>
                </section> */}

            </div>
        </main>
    )
}
