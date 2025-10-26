'use client'

import { Search, Bell } from 'lucide-react'
import Image from 'next/image'

export function TopNav() {
  return (
    <header className="flex items-center justify-between h-16 px-8 border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex-shrink-0">
      <div className="flex-1 max-w-sm">
        <label className="relative text-gray-400 focus-within:text-gray-600 block">
          <Search className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5" />
          <input
            className="form-input w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-black/5 dark:bg-white/5 h-10 placeholder:text-gray-500 px-4 pl-10 text-sm font-normal"
            placeholder="Search for jobs, candidates..."
          />
        </label>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative flex cursor-pointer items-center justify-center rounded-full h-10 w-10 hover:bg-black/5 dark:hover:bg-white/5 text-text-light dark:text-text-dark">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
          </span>
        </button>
        
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-offset-2 ring-offset-card-light dark:ring-offset-card-dark ring-primary/50 relative overflow-hidden">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwnEeBEd6cCXQq8TWIRzdBHpvw3DkeHEunqiqkHr9JIiJeNOGI2cGEFOZWbLhcJq9tTsgXXFPLKLM7pgFxxOGHpg2lqqHZJLPqbY7W67OGXMwWIAFTAWfw_PtnikSXAEuOWluAl06bCGmI04_EbdEcxcEpaMezt5V_3nL0n0SMOVbwwqSrpRx4k1b5WqfckXKzB0jcz4QNmUSJM7WttjD0XUyusmKoetNJ3PKwhZk51AbJeVVOMoe6nfslX6SFAYo8O5Fb4FshnXZo"
            alt="User avatar"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </header>
  )
}
