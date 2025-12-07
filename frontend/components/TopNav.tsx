'use client'

import { Search, HelpCircle, FileText, Briefcase } from 'lucide-react'
import { ProfileDropdown } from '@/components/ProfileDropdown'
import { NotificationPanel } from '@/components/NotificationPanel'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { searchGlobal, SearchResult } from '@/lib/searchService'
import { useRouter } from 'next/navigation'

export function TopNav() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [wrapperRef])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true)
        const res = await searchGlobal(query)
        setResults(res)
        setLoading(false)
        setIsOpen(true)
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false)
    setQuery('')
    router.push(result.link)
  }

  return (
    <header className="flex items-center justify-end gap-6 h-16 px-8 border-b border-border/20 bg-secondary-bg flex-shrink-0 z-40 relative">
      {/* Left: Search */}
      <div ref={wrapperRef} className="relative">
        <div className="flex items-center h-10 w-72 bg-secondary-fg px-4 py-2 rounded-full gap-3 cursor-text group border border-transparent focus-within:border-primary/20 transition-all">
          <Search className="w-5 h-5 text-text-tertiary group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search candidates & jobs..."
            className="bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-secondary w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setIsOpen(true) }}
          />
        </div>

        {/* Results Dropdown */}
        {isOpen && (
          <div className="absolute top-12 left-0 w-80 bg-white dark:bg-[#1a1f2e] rounded-xl shadow-xl border border-border/20 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
            {loading ? (
              <div className="p-4 text-center text-sm text-text-secondary">Searching...</div>
            ) : results.length > 0 ? (
              <div className="flex flex-col max-h-[60vh] overflow-y-auto custom-scrollbar">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelect(result)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 text-left transition-colors border-l-2 border-transparent hover:border-primary"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                      {result.type === 'resume' ? <FileText size={16} /> : <Briefcase size={16} />}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium text-text-primary truncate">{result.title}</span>
                      {result.subtitle && <span className="text-xs text-text-tertiary truncate">{result.subtitle}</span>}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-text-secondary">No results found</div>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        <Link href="/help" className="text-text-tertiary hover:text-text-primary transition-colors">
          <HelpCircle className="w-6 h-6 stroke-[1.5]" />
        </Link>

        <NotificationPanel />

        <div className="h-6 w-px bg-border/50 mx-2"></div>

        <ProfileDropdown />
      </div>
    </header>
  )
}
