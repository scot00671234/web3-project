'use client'

import { ReactNode, useState, useEffect } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import WalletContextProvider from '@/components/WalletContextProvider'
import Navbar from '@/components/Navbar'

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" />
  }

  return (
    <ThemeProvider>
      <WalletContextProvider>
        <Navbar />
        <div className="pt-24">
          {children}
        </div>
      </WalletContextProvider>
    </ThemeProvider>
  )
}

