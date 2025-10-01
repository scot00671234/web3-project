'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import TradingViewChart from '@/components/TradingViewChart'

interface TokenData {
  mint: string
  name: string
  symbol: string
  price: number
  volume24h: number
  priceChange24h: number
  supply: number
  holders: number
}

export default function TokenPage() {
  const params = useParams()
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [loading, setLoading] = useState(true)
  const [buyAmount, setBuyAmount] = useState('')
  const [sellAmount, setSellAmount] = useState('')
  const [slippage, setSlippage] = useState(1) // 1% default slippage
  const [showSlippage, setShowSlippage] = useState(false)

  useEffect(() => {
    loadTokenData()
  }, [params.mint])

  const loadTokenData = async () => {
    try {
      // Fetch token data from your API/blockchain
      // const response = await fetch(`/api/tokens/${params.mint}`)
      // const data = await response.json()
      // setTokenData(data)
      
      // For now, fetch directly from blockchain using the mint address
      // You'll need to implement the actual token data fetching logic here
      // This is just a placeholder structure
      const tokenData: TokenData = {
        mint: params.mint as string,
        name: 'Loading...',
        symbol: 'N/A',
        price: 0,
        volume24h: 0,
        priceChange24h: 0,
        supply: 0,
        holders: 0
      }
      
      setTokenData(tokenData)
    } catch (error) {
      console.error('Error loading token data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </main>
    )
  }

  if (!tokenData) return null

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Token Info & Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Token Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-dark">{tokenData.name}</h1>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">{tokenData.symbol}</span>
                    <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">{tokenData.mint.slice(0, 8)}...</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-dark">${tokenData.price.toFixed(4)}</div>
                  <div className={`text-sm font-medium mt-1 ${tokenData.priceChange24h >= 0 ? 'text-primary' : 'text-red-500'}`}>
                    {tokenData.priceChange24h >= 0 ? '+' : ''}{tokenData.priceChange24h.toFixed(2)}% (24h)
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">24h Volume</div>
                  <div className="text-lg font-semibold text-dark">${tokenData.volume24h.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Supply</div>
                  <div className="text-lg font-semibold text-dark">{tokenData.supply.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Holders</div>
                  <div className="text-lg font-semibold text-dark">{tokenData.holders}</div>
                </div>
              </div>
            </div>
            
            {/* Chart */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-soft">
              <h2 className="text-xl font-semibold mb-6 text-dark">Price Chart</h2>
              <TradingViewChart tokenSymbol={tokenData.symbol} />
            </div>
          </div>
          
          {/* Right Column - Trading */}
          <div className="space-y-4">
            {/* Settings */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Slippage Tolerance</span>
                <button 
                  onClick={() => setShowSlippage(!showSlippage)}
                  className="text-xs text-dark hover:text-gray-600 font-medium"
                >
                  {showSlippage ? 'Hide' : 'Edit'}
                </button>
              </div>
              {showSlippage && (
                <div className="flex gap-2">
                  {[0.5, 1, 2, 5].map(val => (
                    <button
                      key={val}
                      onClick={() => setSlippage(val)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                        slippage === val 
                          ? 'bg-dark text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                  <input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(parseFloat(e.target.value) || 0)}
                    className="w-20 bg-gray-100 border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-gray-300"
                    placeholder="Custom"
                  />
                </div>
              )}
            </div>

            {/* Buy */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
              <h3 className="text-lg font-semibold mb-4 text-dark">Buy {tokenData.symbol}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2 uppercase tracking-wider font-medium">Pay (SOL)</label>
                  <input
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-gray-300"
                    placeholder="0.0"
                  />
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">You receive</span>
                    <span className="font-semibold text-dark">~{buyAmount ? (parseFloat(buyAmount) / tokenData.price * 0.995).toFixed(2) : '0'} {tokenData.symbol}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Platform fee (0.5%)</span>
                    <span className="text-gray-600">{buyAmount ? (parseFloat(buyAmount) * 0.005).toFixed(4) : '0'} SOL</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Slippage</span>
                    <span className="text-gray-600">{slippage}%</span>
                  </div>
                </div>
                
                <button
                  disabled={!publicKey || !buyAmount}
                  className="w-full bg-dark text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!publicKey ? 'Connect Wallet' : 'Buy'}
                </button>
              </div>
            </div>
            
            {/* Sell */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
              <h3 className="text-lg font-semibold mb-4 text-dark">Sell {tokenData.symbol}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2 uppercase tracking-wider font-medium">Sell ({tokenData.symbol})</label>
                  <input
                    type="number"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-gray-300"
                    placeholder="0.0"
                  />
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">You receive</span>
                    <span className="font-semibold text-dark">~{sellAmount ? (parseFloat(sellAmount) * tokenData.price * 0.995).toFixed(4) : '0'} SOL</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Platform fee (0.5%)</span>
                    <span className="text-gray-600">{sellAmount ? (parseFloat(sellAmount) * tokenData.price * 0.005).toFixed(4) : '0'} SOL</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Slippage</span>
                    <span className="text-gray-600">{slippage}%</span>
                  </div>
                </div>
                
                <button
                  disabled={!publicKey || !sellAmount}
                  className="w-full bg-red-500 text-white py-3.5 rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!publicKey ? 'Connect Wallet' : 'Sell'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
