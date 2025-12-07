'use client'

import { Button } from '@/components/ui/button'
import { Link2, CheckCircle2, ExternalLink } from 'lucide-react'

export default function IntegrationsPage() {
    const integrations = [
        {
            name: "HubSpot",
            description: "Sync candidates and deals directly to your CRM pipeline.",
            status: "Connected",
            icon: "🟧"
        },
        {
            name: "Slack",
            description: "Get real-time notifications for new matches and team updates.",
            status: "Connect",
            icon: "🟣"
        },
        {
            name: "Greenhouse",
            description: "Export qualified candidates to your ATS automatically.",
            status: "Connect",
            icon: "green" // Using a placeholder color/emoji for simplicity
        }
    ]

    return (
        <div className="space-y-8 max-w-screen-cl mx-auto p-6 min-h-screen">
            <div>
                <h1 className="text-4xl font-bold text-text-primary">Integrations</h1>
                <p className="text-text-secondary mt-1">
                    Connect your favorite tools to streamline your workflow.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* HubSpot */}
                <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-[#FF7A59]/10 rounded-xl flex items-center justify-center text-2xl">
                            🟧
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Connected
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">HubSpot</h3>
                    <p className="text-text-secondary text-sm mb-6 flex-1">
                        Sync candidates and deals directly to your CRM pipeline. Automatically create contacts from resumes.
                    </p>
                    <Button variant="ghost" className="w-full">
                        Manage Settings
                    </Button>
                </div>

                {/* Slack */}
                <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-[#4A154B]/10 rounded-xl flex items-center justify-center text-2xl">
                            🟣
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">Slack</h3>
                    <p className="text-text-secondary text-sm mb-6 flex-1">
                        Get real-time notifications for new matches, team updates, and daily summaries in your channels.
                    </p>
                    <Button 
                    variant="default"
                    className="w-full">
                        Connect Slack
                    </Button>
                </div>

                {/* Greenhouse */}
                <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-[#00B24F]/10 rounded-xl flex items-center justify-center text-2xl">
                            🍃
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">Greenhouse</h3>
                    <p className="text-text-secondary text-sm mb-6 flex-1">
                        Export qualified candidates to your ATS automatically. Sync interview stages and feedback.
                    </p>
                    <Button 
                    variant="default"
                    className="w-full">
                        Connect Greenhouse
                    </Button>
                </div>
            </div>

            <div className="mt-12 p-8 bg-secondary-bg rounded-3xl text-center">
                <h3 className="text-xl font-bold text-text-primary mb-2">Missing an integration?</h3>
                <p className="text-text-secondary mb-6">
                    We're constantly adding new tools. Let us know what you need.
                </p>
                <Button variant="link" className="gap-2">
                    Request Integration
                    <ExternalLink className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
