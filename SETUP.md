# Setup Guide - Solana Token Platform

## Prerequisites

- Node.js 18+ installed
- Phantom or Solflare wallet
- Basic understanding of Solana

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Open `.env.local` and update:

```env
NEXT_PUBLIC_PLATFORM_WALLET=<YOUR_WALLET_ADDRESS>
```

**To get your wallet address:**
- Open Phantom/Solflare wallet
- Click on wallet name at top
- Copy address

### 3. Update Platform Wallet in Code

Replace the platform wallet address in these files:

1. **utils/tokenUtils.ts** (line 13):
```typescript
const PLATFORM_WALLET = new PublicKey('YOUR_ACTUAL_WALLET_ADDRESS')
```

2. **utils/swapUtils.ts** (line 9):
```typescript
const PLATFORM_WALLET = new PublicKey('YOUR_ACTUAL_WALLET_ADDRESS')
```

### 4. Get Devnet SOL

1. Switch wallet to **Devnet** network
2. Visit: https://faucet.solana.com/
3. Enter your wallet address
4. Request 2 SOL (for testing)

### 5. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## Testing Checklist

- [ ] Connect wallet (on devnet)
- [ ] Create a test token
- [ ] Verify token appears in "Browse Tokens"
- [ ] Test buying the token
- [ ] Verify platform fee goes to your wallet
- [ ] Test selling the token
- [ ] Check swap functionality

## Production Deployment

### Before Going to Mainnet:

1. **Test Everything on Devnet**
   - Create 5+ test tokens
   - Execute 20+ test trades
   - Verify all fees route correctly
   - Test with multiple wallets

2. **Update Network Configuration**

   In `.env.local`:
   ```env
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   ```

   In `components/WalletContextProvider.tsx`:
   ```typescript
   const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), [])
   ```

3. **Set Up Production RPC**
   
   For better performance, use a dedicated RPC:
   - [Helius](https://helius.dev/)
   - [QuickNode](https://quicknode.com/)
   - [Alchemy](https://www.alchemy.com/)

   Update `.env.local`:
   ```env
   NEXT_PUBLIC_SOLANA_RPC_URL=https://your-rpc-url.com
   ```

4. **Security Audit**
   - Review all platform wallet addresses
   - Verify fee calculations
   - Test transaction signing flow
   - Check for wallet permission issues

5. **Deploy**

   **Vercel:**
   ```bash
   vercel deploy --prod
   ```

   **Netlify:**
   ```bash
   netlify deploy --prod
   ```

   Don't forget to add environment variables in your deployment platform!

## Troubleshooting

### "Wallet not connected"
- Ensure wallet extension is installed
- Check wallet is on correct network (devnet/mainnet)
- Refresh page after connecting wallet

### "Transaction failed"
- Check you have enough SOL for fees
- Verify wallet has approved transaction
- Check console for detailed errors

### "Token creation failed"
- Ensure platform wallet address is valid
- Check you're on devnet for testing
- Verify account has SOL for rent

### Wallet adapter errors
- Clear browser cache
- Reinstall wallet extension
- Try different browser

## Next Steps

1. Add real DEX integration (Raydium/Orca)
2. Implement token metadata (Metaplex)
3. Add liquidity pool creation
4. Build advanced charting
5. Add analytics dashboard

## Support

- Solana Docs: https://docs.solana.com/
- SPL Token: https://spl.solana.com/token
- Wallet Adapter: https://github.com/solana-labs/wallet-adapter
