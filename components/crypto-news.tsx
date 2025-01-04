"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from 'lucide-react'

interface CryptoNews {
  id: string
  title: string
  url: string
  body: string
  source: string
  publishedAt: string
}

export function CryptoNews() {
  const [news, setNews] = useState<CryptoNews[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch(
          'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest&limit=5'
        )
        const data = await response.json()
        
        if (data.Data) {
          const latestNews = data.Data
            .slice(0, 5)
            .map((item: any) => ({
              id: item.id,
              title: item.title.length > 60 ? 
                item.title.substring(0, 60) + '...' : 
                item.title,
              url: item.url,
              source: item.source_info?.name || item.source,
              publishedAt: new Date(item.published_on * 1000).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
            }))
          setNews(latestNews)
        }
      } catch (error) {
        console.error('Failed to fetch news:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
    const interval = setInterval(fetchNews, 300000) // 5 minutos
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-onest font-bold">Latest News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 mb-4">
                  <div className="w-1 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl shadow-sm border-0">
      <CardHeader className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl md:text-2xl font-onest font-bold">Latest News</CardTitle>
          <a 
            href="https://www.cryptocompare.com/news/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-onest"
          >
            <span className="hidden md:inline">More News</span>
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="space-y-3 md:space-y-4">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 md:gap-4 group"
            >
              <div className="w-1 h-10 md:h-12 bg-indigo-600 rounded-full group-hover:bg-indigo-400 transition-colors" />
              <div className="flex-1 min-w-0">
                <h4 className="font-onest font-medium group-hover:text-indigo-600 transition-colors truncate">{item.title}</h4>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground font-onest">
                  <span className="truncate">{item.source}</span>
                  <span className="text-xs">•</span>
                  <span className="whitespace-nowrap">{item.publishedAt}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
