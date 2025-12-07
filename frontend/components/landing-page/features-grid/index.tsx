'use client'

import Image from 'next/image'
import { FEATURES_GRID_CONTENT } from './constants'

export function FeaturesGrid() {
    return (
        <section className="py-24 bg-secondary-bg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Title */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-text-primary tracking-tight leading-tight">
                        {FEATURES_GRID_CONTENT.title}
                    </h2>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {FEATURES_GRID_CONTENT.features.map((feature, index) => (
                        <div
                            key={index}
                            className={`${feature.gridClass} group relative bg-white rounded-[2.5rem] p-8 overflow-hidden`}
                        >
                            {/* Content */}
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="mb-auto">
                                    <h3 className="text-2xl font-medium text-text-primary mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-lg text-text-secondary leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Integrations Display */}
                                {feature.integrations && (
                                    <div className="mt-8">
                                        <div className="flex flex-wrap gap-4">
                                            {feature.integrations.map((integration, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-3 bg-white border border-border rounded-3xl px-4 py-3 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="w-10 h-10 bg-secondary-bg rounded-xl flex items-center justify-center overflow-hidden relative">
                                                        <Image
                                                            src={integration.logo}
                                                            alt={integration.name}
                                                            width={24}
                                                            height={24}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <span className="text-base font-medium text-text-primary">
                                                        {integration.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Feature Image */}
                                {feature.image && !feature.integrations && (
                                    <div className="mt-8 bg-secondary-bg rounded-3xl overflow-hidden relative h-48">
                                        <Image
                                            src={feature.image}
                                            alt={feature.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Decorative Background Pattern */}
                            <div className="absolute bottom-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
                                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill="currentColor"
                                        className="text-accent"
                                        d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.2C64.8,55.2,53.8,66.6,40.3,73.4C26.8,80.2,10.8,82.4,-4.3,79.9C-19.4,77.4,-33.7,70.2,-46.2,61.8C-58.7,53.4,-69.4,43.8,-76.1,31.4C-82.8,19,-85.5,3.8,-83.2,-10.5C-80.9,-24.8,-73.6,-38.2,-63.8,-49.2C-54,-60.2,-41.7,-68.8,-28.2,-76.6C-14.7,-84.4,-0.1,-91.4,13.6,-89.8C27.3,-88.2,30.6,-83.6,44.7,-76.4Z"
                                        transform="translate(100 100)"
                                    />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
