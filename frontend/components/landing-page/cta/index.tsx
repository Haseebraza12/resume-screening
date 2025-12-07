'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { CTA_CONTENT } from './constants'
import { Button } from '@/components/ui/button'

export function CTA() {
    return (
        <section className="py-24 bg-white dark:bg-slate-900">
            <div className="container mx-auto flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-screen-xl grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Card - Hiring */}
                    <div className="relative h-[500px] lg:h-[600px] bg-[#F3F4F6] dark:bg-slate-800 rounded-[2.5rem] p-10 flex flex-col justify-between overflow-hidden group">
                        <div>
                            <span className="text-slate-600 dark:text-slate-400 font-medium mb-4 block">
                                {CTA_CONTENT.leftCard.label}
                            </span>
                            <h2 className="text-5xl sm:text-6xl font-medium text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                                {CTA_CONTENT.leftCard.title}
                            </h2>
                        </div>

                        <div className="flex items-center justify-between relative z-10">
                            <Button
                                asChild variant="default">
                                <Link href={CTA_CONTENT.leftCard.link} className="flex items-center gap-2">
                                    {CTA_CONTENT.leftCard.cta}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </Button>
                        </div>

                        {/* Decorative Logo Mark */}
                        <div className="absolute bottom-0 right-0 p-10 opacity-100 transition-transform duration-500 group-hover:scale-110 origin-bottom-right">
                            <Image
                                src="/cta/biglogo.png"
                                alt="Decorative Logo"
                                width={180}
                                height={180}
                                className="dark:invert"
                            />
                        </div>
                    </div>

                    {/* Right Card - Partnership */}
                    <div className="relative h-[500px] lg:h-[600px] rounded-[2.5rem] p-10 flex flex-col justify-between overflow-hidden group">
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={CTA_CONTENT.rightCard.backgroundImage}
                                alt="Collaboration"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
                        </div>

                        <div className="relative z-10">
                            <span className="text-white/80 font-medium mb-4 block">
                                {CTA_CONTENT.rightCard.label}
                            </span>
                            <h2 className="text-5xl sm:text-6xl font-medium text-white tracking-tight leading-[1.1]">
                                {CTA_CONTENT.rightCard.title}
                            </h2>
                        </div>

                        <div className="relative z-10">
                            <Button
                                asChild
                                variant="outline"
                                
                            >
                                <Link href={CTA_CONTENT.rightCard.link} className="flex items-center gap-2">
                                    {CTA_CONTENT.rightCard.cta}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
