'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { STATS_CONTENT } from './constants'
import { cn } from '@/lib/utils'

function CountUp({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) {
    const [count, setCount] = useState(0)
    const countRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        if (countRef.current) {
            observer.observe(countRef.current)
        }

        return () => {
            if (countRef.current) {
                observer.unobserve(countRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (!isVisible) return

        let startTime: number
        let animationFrame: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime

            if (progress < duration) {
                const nextCount = Math.min(Math.floor((progress / duration) * end), end)
                setCount(nextCount)
                animationFrame = requestAnimationFrame(animate)
            } else {
                setCount(end)
            }
        }

        animationFrame = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationFrame)
    }, [end, duration, isVisible])

    return (
        <span ref={countRef}>
            {count.toLocaleString()}{suffix}
        </span>
    )
}

export function Stats() {
    return (
        <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Trusted By Section */}
                <div className="text-center mb-16">
                    <h2 className="text-2xl font-medium text-slate-600 dark:text-slate-400 mb-16">
                        {STATS_CONTENT.title}
                    </h2>

                    {/* Logos Grid */}
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {STATS_CONTENT.companies.map((company, index) => (
                            <div key={index} className="relative h-8 w-32 transition-opacity hover:opacity-100">
                                <Image
                                    src={company.logo}
                                    alt={company.name}
                                    fill
                                    className="object-contain dark:invert"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent max-w-4xl mx-auto mb-16"></div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {STATS_CONTENT.stats.map((stat, index) => (
                        <div key={index} className="p-6 group hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors duration-300">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2 tabular-nums">
                                <CountUp end={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
