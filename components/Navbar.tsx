'use client'

import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useTheme } from '@/contexts/ThemeContext'
import { useState, useEffect, useMemo, useRef } from 'react'

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [walletMenuOpen, setWalletMenuOpen] = useState(false)
  const walletButtonRef = useRef<HTMLButtonElement | null>(null)
  
  const { theme, toggleTheme } = useTheme()
  const { publicKey, disconnect, connecting } = useWallet()
  const { setVisible } = useWalletModal()

  const formattedAddress = useMemo(() => {
    if (!publicKey) return 'Select Wallet'
    const base58 = publicKey.toBase58()
    return `${base58.slice(0, 4)}..${base58.slice(-4)}`
  }, [publicKey])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!walletMenuOpen) return
      if (walletButtonRef.current && !walletButtonRef.current.contains(event.target as Node)) {
        setWalletMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [walletMenuOpen])

  if (!mounted) {
    return (
      <nav className="fixed top-3 left-0 right-0 z-50 px-3 bg-transparent">
        <div className="max-w-[1180px] mx-auto">
          <div className="flex items-center justify-between rounded-full border border-white/50 dark:border-white/10 bg-white/60 dark:bg-gray-900/50 backdrop-blur-3xl shadow-lg px-5 py-3">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="Lynxier" className="w-10 h-10 drop-shadow" />
              <span className="text-lg font-semibold text-dark dark:text-white tracking-tight">Lynxier</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 dark:text-gray-600">Loading...</span>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  const handleWalletClick = () => {
    if (!publicKey) {
      setVisible(true)
      return
    }
    setWalletMenuOpen((prev) => !prev)
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } finally {
      setWalletMenuOpen(false)
    }
  }

  return (
    <nav className="fixed top-3 left-0 right-0 z-50 px-3 bg-transparent">
      <div className="max-w-[1180px] mx-auto">
        <div className="flex items-center justify-between rounded-full border border-white/50 dark:border-white/10 bg-white/60 dark:bg-gray-900/55 backdrop-blur-3xl shadow-xl px-5 py-3">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.svg"
              alt="Lynxier"
              className="w-11 h-11 transition-transform duration-200 group-hover:scale-105 drop-shadow"
            />
            <span className="text-xl font-semibold text-dark dark:text-white tracking-tight">Lynxier</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/tokens"
              className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-full transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/60 hover:text-primary"
            >
              Browse
            </Link>
            <Link
              href="/create"
              className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-full transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/60 hover:text-primary"
            >
              Create
            </Link>
            <Link
              href="/swap"
              className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-full transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/60 hover:text-primary"
            >
              Swap
            </Link>

            <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-700 to-transparent mx-3" />

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-white/60 dark:border-white/10 bg-white/85 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

          <div className="relative">
            <button
              ref={walletButtonRef}
              onClick={handleWalletClick}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FBE08A] to-[#F5C55C] text-[#2D1B00] rounded-full text-xs font-semibold border border-[#F3D066] shadow-[0_4px_12px_rgba(243,208,102,0.35)] hover:shadow-[0_6px_16px_rgba(243,208,102,0.45)] hover:-translate-y-0.5 transition-all duration-200"
              disabled={connecting}
            >
              {connecting ? 'Connecting...' : formattedAddress}
            </button>

            {publicKey && walletMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    setWalletMenuOpen(false)
                    setVisible(true)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Change Wallet
                </button>
                <button
                  onClick={handleDisconnect}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </nav>
  )
}