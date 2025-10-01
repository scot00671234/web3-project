# 🚀 Quick Start Guide

Get your Solana token platform running in 5 minutes!

## 1. Install Dependencies (1 min)

```bash
npm install
```

## 2. Configure Platform Wallet (1 min)

You need to set your wallet address in 3 places:

### Option A: Using Find & Replace (Recommended)

1. Open VS Code/Cursor
2. Press `Ctrl+Shift+F` (or `Cmd+Shift+F` on Mac)
3. Search for: `YourPlatformWalletAddressHere111111111111111`
4. Replace all with: `YOUR_ACTUAL_WALLET_ADDRESS`

### Option B: Manual Update

Update these 3 files:

1. **.env.local** (line 5)
2. **utils/tokenUtils.ts** (line 13)
3. **utils/swapUtils.ts** (line 9)

## 3. Get Devnet SOL (2 min)

1. Install [Phantom Wallet](https://phantom.app/)
2. Switch to **Devnet** (Settings → Developer Settings → Testnet Mode)
3. Get free SOL: https://faucet.solana.com/

## 4. Run the App (1 min)

```bash
npm run dev
```

Open: **http://localhost:3000**

## 5. Test It Out!

### Create Your First Token:
1. Click "Connect Wallet"
2. Go to "Create Token"
3. Fill in token details:
   - Name: `My Test Token`
   - Symbol: `TEST`
   - Supply: `1000000`
4. Click "Create Token" ✨

### Trade Your Token:
1. Go to "Browse Tokens"
2. Click "Trade" on your token
3. Buy some tokens with devnet SOL
4. Watch the platform fee go to your wallet!

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] Platform wallet configured (3 places)
- [ ] Devnet SOL in wallet (min 1 SOL)
- [ ] App running on localhost:3000
- [ ] Token created successfully
- [ ] Platform fees received

## 🎯 What's Working

✅ Token creation (FREE for creator)
✅ First buyer pays network + platform fee
✅ Swap/trading with 0.5% platform fee
✅ Fee routing to company wallet
✅ Wallet integration (Phantom, Solflare)
✅ Basic price charts
✅ Token listing & discovery

## 📊 Platform Fee Flow

```
User Creates Token → FREE
   ↓
First Buyer Purchases → 0.5% fee → YOUR WALLET
   ↓
All Future Trades → 0.5% fee → YOUR WALLET
```

## 🔧 Common Issues

**"Wallet not connected"**
- Make sure Phantom is installed
- Switch to Devnet in wallet settings
- Refresh page

**"Transaction failed"**
- Get more devnet SOL from faucet
- Check wallet approval popup

**"Can't find platform wallet"**
- Did you update all 3 files?
- Use Find & Replace for accuracy

## 🚀 Going to Mainnet

**⚠️ CRITICAL: Test everything on devnet first!**

When ready for mainnet:

1. Change network in `.env.local`:
   ```
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   ```

2. Update `components/WalletContextProvider.tsx`:
   ```typescript
   const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), [])
   ```

3. Get production RPC (recommended):
   - Helius: https://helius.dev/
   - QuickNode: https://quicknode.com/

4. Test with small amounts first!

## 📝 Next Steps

- [ ] Customize UI colors/branding
- [ ] Add token metadata (images, descriptions)
- [ ] Integrate real DEX (Raydium/Jupiter)
- [ ] Add liquidity pool creation
- [ ] Build analytics dashboard
- [ ] Deploy to production

## 🎉 You're All Set!

Your Solana token platform is ready. Start creating and trading tokens!

Need help? Check:
- `SETUP.md` - Detailed setup guide
- `README.md` - Full documentation
- Solana Docs: https://docs.solana.com/
