// Configuration file for the Solana Token Platform
// Copy this to create your actual config

export const config = {
  // Solana Network Configuration
  network: 'devnet', // 'devnet' or 'mainnet-beta'
  
  // Platform Wallet - REPLACE WITH YOUR ACTUAL WALLET ADDRESS
  platformWallet: 'YourPlatformWalletAddressHere111111111111111',
  
  // Fee Configuration
  platformFeePercent: 0.005, // 0.5% = 0.005
  
  // RPC Endpoint (optional - uses public endpoint if not set)
  rpcUrl: '', // e.g., 'https://api.mainnet-beta.solana.com'
  
  // DEX Integration (for future use)
  dex: {
    raydium: {
      enabled: false,
      apiUrl: '',
    },
    orca: {
      enabled: false,
      apiUrl: '',
    },
    jupiter: {
      enabled: false,
      apiUrl: '',
    },
  },
}
