'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthModal from '@/components/AuthModal'
import { HERO_CONTENT } from './constants'
import { Button } from '@/components/ui/button'

export function Hero() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')
    const router = useRouter()

    const handleAuthSuccess = () => {
        setIsAuthModalOpen(false)
        router.push('/dashboard')
    }

    const openSignup = () => {
        setAuthMode('signup')
        setIsAuthModalOpen(true)
    }

    return (
        <>
            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={handleAuthSuccess}
                initialMode={authMode}
            />

            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Video Background */}
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/hero.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Black Tint Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Content */}
                <div className="relative z-10 px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl py-32">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-sm font-normal tracking-widest uppercase">
                            <span className="text-transparent bg-clip-text bg-primary-bg">
                                {HERO_CONTENT.tagline}
                            </span>
                        </p>
                        <h1 className="mt-8 text-4xl font-normal text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                            {HERO_CONTENT.title}
                        </h1>

                        <div className="flex flex-col items-center justify-center px-8 mt-12 space-y-5 sm:space-y-0 sm:px-0 sm:space-x-5 sm:flex-row">
                            <Button onClick={openSignup} className="w-full sm:w-auto">
                                {HERO_CONTENT.ctaPrimary}
                            </Button>

                            <Button onClick={openSignup} variant="outline" className="w-full sm:w-auto">
                                {HERO_CONTENT.ctaSecondary}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
