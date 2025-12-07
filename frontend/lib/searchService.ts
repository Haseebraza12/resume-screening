import { api } from './api'

export interface SearchResult {
    id: number
    type: 'resume' | 'job'
    title: string
    subtitle?: string
    link: string
}

export const searchGlobal = async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 2) return []

    try {
        const response = await api.get<{ results: SearchResult[] }>(`/search/?q=${encodeURIComponent(query)}`)
        return response.data.results
    } catch (error) {
        console.error('Search failed:', error)
        return []
    }
}
