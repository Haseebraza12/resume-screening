'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthModal from '@/components/AuthModal'
import { NAVBAR_LINKS } from './constants'
import { Button } from '@/components/ui/button'

export function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [isNavOpen, setIsNavOpen] = useState(false)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
    const router = useRouter()

    const handleAuthSuccess = () => {
        setIsAuthModalOpen(false)
        router.push('/dashboard')
    }

    const openLogin = () => {
        setAuthMode('login')
        setIsAuthModalOpen(true)
    }

    const openSignup = () => {
        setAuthMode('signup')
        setIsAuthModalOpen(true)
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsNavOpen(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const toggleNav = () => setIsNavOpen(!isNavOpen)

    return (
        <>
            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={handleAuthSuccess}
                initialMode={authMode}
            />

            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'py-2'
                    : 'py-4'
                    }`}
            >
                <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div
                        className={`relative bg-primary-bg/70 flex items-center justify-between rounded-full transition-all duration-300 ${scrolled
                            ? ' backdrop-blur-lg shadow-lg border border-border/20 px-6 py-3'
                            : ' backdrop-blur-md shadow-md border border-border/20 px-6 py-3'
                            }`}
                    >
                        {/* Logo */}
                        <Link href="/" className="flex items-center">
                            <img
                                src="/logo-black.png"
                                alt="ResumeMatch AI Logo"
                                className="h-8 w-auto"
                            />
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center gap-1">
                            {NAVBAR_LINKS.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-secondary-bg rounded-full transition-all duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right side buttons */}
                        <div className="flex items-center gap-3">
                            {/* Mobile menu toggle */}
                            <button
                                onClick={toggleNav}
                                className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
                                aria-label="Toggle menu"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {isNavOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>

                            {/* Sign In button */}
                            <Button onClick={openLogin} variant="ghost" size="sm" className="hidden sm:inline-flex">
                                Sign In
                            </Button>

                            {/* Get Started button */}
                            <Button onClick={openSignup} size="sm">
                                Get Started
                            </Button>  </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    <div
                        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isNavOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="bg-primary-bg/95 backdrop-blur-lg rounded-3xl border border-border/20 shadow-lg p-4">
                            <div className="flex flex-col gap-2">
                                {NAVBAR_LINKS.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setIsNavOpen(false)}
                                        className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-secondary-bg rounded-xl transition-all duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="h-px bg-border/30 my-2"></div>
                                <Link
                                    href="/login"
                                    onClick={() => setIsNavOpen(false)}
                                    className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-secondary-bg rounded-xl transition-all duration-200 sm:hidden"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav >
        </>
    )
}
