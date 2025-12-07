'use client'

import { Button } from '@/components/ui/button'
import { CreditCard, Check, Download, Zap } from 'lucide-react'

export default function BillingPage() {
    const history = [
        {
            date: "Nov 23, 2025",
            amount: "$49.00",
            status: "Paid",
            invoice: "#INV-2025-011"
        },
        {
            date: "Oct 23, 2025",
            amount: "$49.00",
            status: "Paid",
            invoice: "#INV-2025-010"
        },
        {
            date: "Sep 23, 2025",
            amount: "$49.00",
            status: "Paid",
            invoice: "#INV-2025-009"
        }
    ]

    return (
        <div className="space-y-8 max-w-screen-cl mx-auto p-6 min-h-screen">
            <div>
                <h1 className="text-4xl font-bold text-text-primary">Billing & Plans</h1>
                <p className="text-text-secondary mt-1">
                    Manage your subscription and payment history.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Plan */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Zap className="w-32 h-32 text-primary" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-text-primary">Pro Plan</h2>
                                    <p className="text-text-secondary">Perfect for growing teams</p>
                                </div>
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold">
                                    Active
                                </span>
                            </div>

                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-black text-text-primary">$49</span>
                                <span className="text-text-secondary">/month</span>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span>Unlimited Resume Parsing</span>
                                </div>
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span>Advanced AI Matching</span>
                                </div>
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span>Export to PDF & CSV</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button>
                                    Manage Subscription
                                </Button>
                                <Button variant="outline">
                                    Change Plan
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-6">
                        <h3 className="text-lg font-bold text-text-primary mb-4">Payment Method</h3>
                        <div className="flex items-center justify-between p-4 border border-border/30 rounded-xl bg-secondary-bg/50">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white rounded-lg border border-border/30">
                                    <CreditCard className="w-6 h-6 text-text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold text-text-primary">•••• •••• •••• 4242</p>
                                    <p className="text-sm text-text-secondary">Expires 12/28</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                    </div>
                </div>

                {/* Payment History */}
                <div className="lg:col-span-1">
                    <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 p-6 h-full">
                        <h3 className="text-lg font-bold text-text-primary mb-4">Payment History</h3>
                        <div className="space-y-4">
                            {history.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-secondary-bg rounded-xl transition-colors">
                                    <div>
                                        <p className="font-bold text-text-primary">{item.amount}</p>
                                        <p className="text-xs text-text-secondary">{item.date}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-xs font-bold">
                                            {item.status}
                                        </span>
                                        <button className="text-text-tertiary hover:text-primary transition-colors">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 text-sm text-primary font-bold hover:underline">
                            View All Invoices
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
