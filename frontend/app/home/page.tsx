import { Navbar } from '@/components/landing-page/navbar'
import { Hero } from '@/components/landing-page/hero'
import { FeaturesGrid } from '@/components/landing-page/features-grid'
import { Stats } from '@/components/landing-page/stats'
import { Testimonials } from '@/components/landing-page/testimonials'
import { CTA } from '@/components/landing-page/cta'
import { Footer } from '@/components/landing-page/footer'

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-900">
            <Navbar />
            <Hero />
            <FeaturesGrid />         
            <Stats />
            <Testimonials />
            <CTA />
            <Footer />
        </main>
    )
}
