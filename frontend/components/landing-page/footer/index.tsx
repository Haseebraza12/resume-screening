'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Linkedin, Twitter, Youtube } from 'lucide-react'
import { FOOTER_CONTENT } from './constants'
import { Button } from '@/components/ui/button'

export function Footer() {
    return (
        <footer className="bg-accent-dark pt-24 pb-12 border-t border-border relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Top Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                    {/* Description */}
                    <div className="max-w-md">
                        <Link href="/" className="block mb-8">
                            <Image
                                src="/logo-white.png"
                                alt="Rankify"
                                width={80}
                                height={80}
                                className="object-contain h-12 w-auto"
                            />
                        </Link>
                        <p className="text-lg text-white leading-relaxed">
                            {FOOTER_CONTENT.description}
                        </p>
                    </div>

                    {/* Links Columns */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {FOOTER_CONTENT.links.map((column, index) => (
                            <div key={index}>
                                <h3 className="font-semibold text-white mb-6">
                                    {column.title}
                                </h3>
                                <ul className="space-y-4">
                                    {column.items.map((item, idx) => (
                                        <li key={idx}>
                                            <Link
                                                href={item.href}
                                                className="text-white hover:text-text-primary transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end mb-32">
                    <div>
                        <h3 className="text-2xl font-bold text-white">
                            {FOOTER_CONTENT.newsletter.heading}
                        </h3>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                        <div className="relative flex-1 w-full">
                            <input
                                type="email"
                                placeholder={FOOTER_CONTENT.newsletter.placeholder}
                                className="w-full bg-white/10 border border-white/10 rounded-full py-4 px-6 pr-32 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/20 outline-none backdrop-blur-sm transition-all"
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-white text-accent-dark px-4 rounded-full text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2 shadow-sm">
                                {FOOTER_CONTENT.newsletter.button}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
                                <Youtube className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 relative z-20 mb-8">
                    <div className="text-white/60 text-sm mb-4 md:mb-0">
                        {FOOTER_CONTENT.copyright}
                    </div>
                    <div className="flex gap-8">
                        {FOOTER_CONTENT.bottomLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="text-white/60 hover:text-white text-sm transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
