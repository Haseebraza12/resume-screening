'use client'

import { TESTIMONIALS_CONTENT } from './constants'
import { HoverExpand_001 } from '@/components/ui/skiper-ui/skiper52'

export function Testimonials() {
    // Create array of images for the hover effect
    // src: Collapsed state (Avatar)
    // testimonial: Expanded state (Text Card)
    const testimonialImages = TESTIMONIALS_CONTENT.testimonials.map((t, i) => ({
        src: t.avatar,
        alt: `${t.author} - ${t.role}`,
        code: t.author, // Using author name as the 'code' displayed on hover
        testimonial: {
            quote: t.quote,
            author: t.author,
            role: t.role,
            company: t.company
        }
    }))

    // Add a few more duplicates to make the effect look better if there are few testimonials
    // or just use the existing ones if there are enough. 
    // The user asked for "single image from features/parsing.png as a demo image right now"
    // I'll stick to the testimonials count but maybe duplicate them to fill the row if needed.
    // The original Skiper52 had 9 images. Let's create a few more to make it look good.
    const displayImages = [
        ...testimonialImages,
        ...testimonialImages,
        ...testimonialImages
    ].slice(0, 7) // Limit to 7 items for a good look

    return (
        <section className="py-24 bg-secondary-bg overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        {TESTIMONIALS_CONTENT.title}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        {TESTIMONIALS_CONTENT.subtitle}
                    </p>
                </div>

                <div className="flex justify-center w-full">
                    <HoverExpand_001
                        images={displayImages}
                        className="max-w-6xl"
                    />
                </div>
            </div>
        </section>
    )
}
