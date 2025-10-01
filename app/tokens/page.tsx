'use client'

import { useState, useEffect } from 'react'
import { useConnection } from '@solana/wallet-adapter-react'
import Link from 'next/link'

interface Token {
  mint: string
  name: string
  symbol: string
  supply: number
  price: number
  volume24h: number
  priceChange24h: number
  marketCap: number
  image?: string
  holders: number
}

type SortBy = 'marketCap' | 'volume' | 'priceChange' | 'name'
type FilterBy = 'all' | 'gainers' | 'losers' | 'new' | 'trending'

export default function TokensPage() {
  const { connection } = useConnection()
  const [tokens, setTokens] = useState<Token[]>([])
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('marketCap')
  const [filterBy, setFilterBy] = useState<FilterBy>('all')

  useEffect(() => {
    loadTokens()
  }, [])

  useEffect(() => {
    let result = [...tokens]
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      result = result.filter(token => 
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query) ||
        token.mint.toLowerCase().includes(query)
      )
    }
    
    // Apply category filter
    switch (filterBy) {
      case 'gainers':
        result = result.filter(token => token.priceChange24h > 0)
        break
      case 'losers':
        result = result.filter(token => token.priceChange24h < 0)
        break
      case 'new':
        // In production, filter by creation date
        break
      case 'trending':
        // In production, filter by trending metrics
        break
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'marketCap':
        result.sort((a, b) => b.marketCap - a.marketCap)
        break
      case 'volume':
        result.sort((a, b) => b.volume24h - a.volume24h)
        break
      case 'priceChange':
        result.sort((a, b) => b.priceChange24h - a.priceChange24h)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }
    
    setFilteredTokens(result)
  }, [searchQuery, tokens, sortBy, filterBy])

  const loadTokens = async () => {
    try {
      // Fetch tokens from your API/indexer
      // const response = await fetch('/api/tokens')
      // const data = await response.json()
      // setTokens(data)
      // setFilteredTokens(data)
      
      // For now, set empty array - tokens will be populated from blockchain
      setTokens([])
      setFilteredTokens([])
    } catch (error) {
      console.error('Error loading tokens:', error)
      setTokens([])
      setFilteredTokens([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-6 py-8 animate-fade-in">
        {/* Header */}
        <div className="mb-6 animate-slide-up">
          <h1 className="text-3xl font-arial mb-2 text-dark dark:text-white">Discover Tokens</h1>
          <p className="text-gray-600 dark:text-gray-400">Browse and trade the latest tokens on Solana</p>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl animate-scale-in">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tokens by name, symbol, or address..."
              className="w-full glass border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 pl-12 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm shadow-soft text-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
            />
            <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Filters and Sorting */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Category Filters */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'gainers', 'losers', 'new', 'trending'] as FilterBy[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterBy(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    filterBy === filter
                      ? 'bg-gradient-to-r from-primary to-secondary text-dark shadow-glow'
                      : 'glass text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {filter === 'all' ? 'All' : 
                   filter === 'gainers' ? 'Gainers' :
                   filter === 'losers' ? 'Losers' :
                   filter === 'new' ? 'New' : 'Trending'}
                </button>
              ))}
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="glass border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-dark dark:text-white transition-all duration-200"
              >
                <option value="marketCap">Market Cap</option>
                <option value="volume">Volume</option>
                <option value="priceChange">Price Change</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-dark border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Token Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {filteredTokens.map((token, index) => (
                <Link 
                  key={token.mint} 
                  href={`/token/${token.mint}`}
                  className="glass rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-glow transition-all duration-300 cursor-pointer group hover:scale-105 animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Token Image */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                    {token.image ? (
                      <img src={token.image} alt={token.name} className="w-12 h-12 rounded-xl" />
                    ) : (
                      <span className="text-2xl font-bold text-dark dark:text-white">{token.symbol.charAt(0)}</span>
                    )}
                  </div>
                  
                  {/* Token Info */}
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-dark dark:text-white mb-1 truncate">{token.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{token.symbol}</p>
                  </div>
                  
                  {/* Price */}
                  <div className="text-center mb-3">
                    <div className="text-xl font-bold text-dark dark:text-white">${token.price.toFixed(4)}</div>
                    <div className={`text-sm font-medium ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Market Cap</span>
                      <span className="font-medium text-dark dark:text-white">${(token.marketCap / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Volume 24h</span>
                      <span className="font-medium text-dark dark:text-white">${(token.volume24h / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Holders</span>
                      <span className="font-medium text-dark dark:text-white">{token.holders}</span>
                    </div>
                  </div>
                  
                  {/* Trade Button */}
                  <button className="w-full mt-4 bg-gradient-to-r from-primary to-secondary text-dark py-2 rounded-xl text-sm font-semibold hover:shadow-glow transition-all duration-300 group-hover:scale-105">
                    Trade
                  </button>
                </Link>
              ))}
            </div>
            
            {filteredTokens.length === 0 && (
              <div className="text-center py-20">
                <div className="text-gray-400 mb-2">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">
                  {searchQuery ? 'No tokens found matching your search' : 'No tokens available'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
