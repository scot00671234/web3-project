'use client'

import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { executeSwap } from '@/utils/swapUtils'

export default function SwapPage() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  
  const [fromToken, setFromToken] = useState('SOL')
  const [toToken, setToToken] = useState('')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSwap = async () => {
    if (!publicKey) {
      setError('Please connect your wallet first')
      return
    }
    
    if (!fromAmount || !toToken) {
      setError('Please fill in all fields')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const result = await executeSwap(
        connection,
        publicKey,
        sendTransaction,
        fromToken,
        toToken,
        parseFloat(fromAmount)
      )
      
      setSuccess(`Swap successful! Transaction: ${result.signature}`)
      setFromAmount('')
      setToAmount('')
    } catch (err: any) {
      console.error('Swap error:', err)
      setError(err.message || 'Failed to execute swap')
    } finally {
      setLoading(false)
    }
  }

  const PLATFORM_FEE = 0.5 // 0.5% platform fee

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-lg mx-auto px-6 py-8 animate-fade-in">
        <div className="mb-6 animate-slide-up">
          <h1 className="text-3xl font-bold mb-2 text-dark dark:text-white">Swap</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Trade tokens with {PLATFORM_FEE}% platform fee
          </p>
        </div>
        
        <div className="glass rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-soft animate-scale-in">
          {/* From Token */}
          <div className="glass rounded-xl p-5 mb-1 overflow-hidden">
            <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-3">From</label>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1 min-w-0 bg-transparent text-2xl font-semibold outline-none text-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="0.0"
              />
              <select
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
                className="flex-shrink-0 glass border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/50 w-24 text-dark dark:text-white transition-all duration-200"
              >
                <option value="SOL">SOL</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
          </div>
          
          {/* Swap Arrow */}
          <div className="flex justify-center my-1 relative z-10">
            <button className="glass border-2 border-gray-200 dark:border-gray-700 rounded-full p-2 hover:border-primary/50 transition-all duration-200 shadow-sm hover:scale-110">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>
          
          {/* To Token */}
          <div className="glass rounded-xl p-5 mb-5 overflow-hidden">
            <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-3">To</label>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                className="flex-1 min-w-0 bg-transparent text-2xl font-semibold outline-none text-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="0.0"
                readOnly
              />
              <input
                type="text"
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
                className="flex-shrink-0 glass border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/50 w-24 text-dark dark:text-white transition-all duration-200"
                placeholder="Token"
              />
            </div>
          </div>
          
          {/* Fee Info */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2.5 text-sm mb-5">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">Platform Fee</span>
              <span className="font-medium text-dark dark:text-white">{PLATFORM_FEE}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">Network Fee</span>
              <span className="font-medium text-dark dark:text-white">~0.00001 SOL</span>
            </div>
          </div>
          
          {error && (
            <div className="glass bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm mb-4 animate-scale-in">
              {error}
            </div>
          )}
          
          {success && (
            <div className="glass bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-green-700 dark:text-green-400 text-sm mb-4 animate-scale-in">
              {success}
            </div>
          )}
          
          <button
            onClick={handleSwap}
            disabled={loading || !publicKey || !fromAmount}
            className="w-full bg-gradient-to-r from-primary to-secondary text-dark py-3.5 rounded-xl font-semibold hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            {loading ? 'Swapping...' : !publicKey ? 'Connect Wallet' : 'Swap'}
          </button>
        </div>
      </div>
    </main>
  )
}
