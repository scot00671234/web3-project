'use client'

import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { createToken } from '@/utils/tokenUtils'

export default function CreateToken() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    supply: '',
    description: '',
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setImageFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    setError('')
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!publicKey) {
      setError('Please connect your wallet first')
      return
    }

    if (!imageFile) {
      setError('Please upload a token image')
      return
    }

    // Validate minimum supply
    const supplyAmount = parseFloat(formData.supply)
    if (supplyAmount < 1000) {
      setError('Minimum supply is 1,000 tokens')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // In production, upload image to IPFS/Arweave/Cloud Storage first
      // For now, we'll proceed with token creation
      // const imageUrl = await uploadToIPFS(imageFile)
      
      const result = await createToken(
        connection,
        publicKey,
        sendTransaction,
        formData.name,
        formData.symbol,
        9, // Fixed decimals value
        supplyAmount
      )
      
      setSuccess(`Token created successfully! Mint: ${result.mint.toString()}`)
      
      // Reset form
      setFormData({
        name: '',
        symbol: '',
        supply: '',
        description: '',
      })
      setImageFile(null)
      setImagePreview('')
    } catch (err: any) {
      console.error('Token creation error:', err)
      setError(err.message || 'Failed to create token')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
        <div className="mb-6 animate-slide-up">
          <h1 className="text-2xl font-bold mb-2 text-dark dark:text- ">Create Token</h1>
        </div>
        
        <div className="glass rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-soft animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Token Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full glass border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                placeholder="My Token"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Symbol</label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                className="w-full glass border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                placeholder="TKN"
                maxLength={10}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Initial Supply</label>
              <input
                type="number"
                value={formData.supply}
                onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
                className="w-full glass border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                placeholder="Minimum 1,000"
                min="1000"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Minimum supply: 1,000 tokens</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full glass border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                rows={3}
                placeholder="Describe your token..."
              />
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Token Image *</label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-primary/50 transition-all duration-200">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-3 transition-transform hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-300 mb-1">Click to upload token image</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 5MB</span>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="glass border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4">
                    <img 
                      src={imagePreview} 
                      alt="Token preview" 
                      className="w-20 h-20 rounded-xl object-cover shadow-medium"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-dark dark:text-white">{imageFile?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{(imageFile!.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {error && (
              <div className="glass bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm animate-scale-in">
                {error}
              </div>
            )}
            
            {success && (
              <div className="glass bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-green-700 dark:text-green-400 text-sm animate-scale-in">
                {success}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !publicKey}
              className="w-full bg-gradient-to-r from-primary to-secondary text-dark py-4 rounded-xl font-semibold text-lg hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              {loading ? 'Creating...' : !publicKey ? 'Connect Wallet' : 'Create Token'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
