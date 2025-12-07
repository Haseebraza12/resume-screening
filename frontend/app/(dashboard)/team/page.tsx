'use client'

import { Button } from '@/components/ui/button'
import { UserPlus, MoreVertical, Mail, Shield, CheckCircle, Clock } from 'lucide-react'

export default function TeamPage() {
    const members = [
        {
            name: "Sarah Wilson",
            email: "sarah@example.com",
            role: "Admin",
            status: "Active",
            avatar: "SW"
        },
        {
            name: "Mike Johnson",
            email: "mike@example.com",
            role: "Recruiter",
            status: "Active",
            avatar: "MJ"
        },
        {
            name: "Emily Davis",
            email: "emily@example.com",
            role: "Viewer",
            status: "Pending",
            avatar: "ED"
        }
    ]

    return (
        <div className="space-y-8 max-w-screen-cl mx-auto p-6 min-h-screen">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-text-primary">Team Management</h1>
                    <p className="text-text-secondary mt-1">
                        Manage your team members and their permissions.
                    </p>
                </div>
                <Button className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                </Button>
            </div>

            <div className="bg-primary-bg rounded-3xl shadow-sm border border-border/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary-bg border-b border-border/30">
                            <tr>
                                <th className="text-left py-4 px-6 text-sm font-bold text-text-secondary">Member</th>
                                <th className="text-left py-4 px-6 text-sm font-bold text-text-secondary">Role</th>
                                <th className="text-left py-4 px-6 text-sm font-bold text-text-secondary">Status</th>
                                <th className="text-right py-4 px-6 text-sm font-bold text-text-secondary">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {members.map((member, index) => (
                                <tr key={index} className="hover:bg-secondary-bg/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {member.avatar}
                                            </div>
                                            <div>
                                                <p className="font-bold text-text-primary">{member.name}</p>
                                                <div className="flex items-center gap-1 text-xs text-text-tertiary">
                                                    <Mail className="w-3 h-3" />
                                                    {member.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                            <Shield className="w-4 h-4 text-primary" />
                                            {member.role}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        {member.status === 'Active' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                <CheckCircle className="w-3 h-3" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                <Clock className="w-3 h-3" />
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-text-tertiary hover:text-text-primary transition-colors">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
