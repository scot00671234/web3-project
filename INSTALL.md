# 📦 Installation Instructions

## System Requirements

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **OS**: Windows, macOS, or Linux
- **Browser**: Chrome, Firefox, or Brave (with wallet extension)
- **Wallet**: Phantom or Solflare

## Step-by-Step Installation

### 1. Verify Node.js Installation

```bash
node --version
# Should show v18.x.x or higher

npm --version
# Should show 9.x.x or higher
```

If not installed, download from: https://nodejs.org/

### 2. Navigate to Project Directory

```bash
cd "C:\Users\scott\Desktop\Web dev\web 3 - third attempt"
```

### 3. Install Dependencies

```bash
npm install
```

This installs:
- Next.js 14
- React 18
- Solana Web3.js
- SPL Token libraries
- Wallet adapters
- Tailwind CSS
- TypeScript
- Recharts

**Installation time**: ~2-3 minutes

### 4. Configure Platform Wallet

You need your Solana wallet address to receive platform fees.

#### Get Your Wallet Address:

1. Open Phantom wallet (or install from https://phantom.app/)
2. Click on wallet name at top
3. Click "Copy Address"

#### Update Configuration (3 files):

**Option A: Find & Replace (Recommended)**

1. Open project in VS Code/Cursor
2. Press `Ctrl+Shift+F` (or `Cmd+Shift+F` on Mac)
3. Search: `YourPlatformWalletAddressHere111111111111111`
4. Replace All: `[YOUR_WALLET_ADDRESS]`
5. Save all files

**Option B: Manual Edit**

Edit these 3 files:

1. **utils/tokenUtils.ts** (line 13):
```typescript
const PLATFORM_WALLET = new PublicKey('YOUR_WALLET_ADDRESS')
```

2. **utils/swapUtils.ts** (line 9):
```typescript
const PLATFORM_WALLET = new PublicKey('YOUR_WALLET_ADDRESS')
```

3. Create **.env.local** file:
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PLATFORM_WALLET=YOUR_WALLET_ADDRESS
NEXT_PUBLIC_PLATFORM_FEE_PERCENT=0.5
```

### 5. Get Devnet SOL (for testing)

1. Open Phantom wallet
2. Go to **Settings** → **Developer Settings**
3. Enable **Testnet Mode**
4. Switch network to **Devnet**
5. Visit: https://faucet.solana.com/
6. Enter your wallet address
7. Request 2 SOL

**Alternative faucets:**
- https://solfaucet.com/
- https://www.quicknode.com/faucet/solana

### 6. Run Development Server

```bash
npm run dev
```

Server starts at: **http://localhost:3000**

### 7. Verify Installation

✅ **Check these:**

1. **Browser**: Open http://localhost:3000
2. **Homepage**: Should see "Create & Trade Tokens on Solana"
3. **Wallet**: Click "Select Wallet" in top-right
4. **Connection**: Connect Phantom/Solflare
5. **Network**: Verify you're on Devnet

### 8. Test Token Creation

1. Click **"Create Token"**
2. Fill form:
   - Name: `Test Token`
   - Symbol: `TEST`
   - Decimals: `9`
   - Supply: `1000000`
3. Click **"Create Token"**
4. Approve transaction in wallet
5. Wait for confirmation

✅ Success: You'll see token mint address

### 9. Test Trading

1. Go to **"Browse Tokens"**
2. Find your created token
3. Click **"Trade"**
4. Enter buy amount (e.g., `0.1` SOL)
5. Click **"Buy"**
6. Approve transaction
7. Check your wallet for platform fee deduction

## Troubleshooting

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install
```

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Rebuild dependencies
npm run build
```

### Issue: Wallet not connecting

**Solutions:**
- Refresh page
- Clear browser cache
- Reinstall wallet extension
- Try different browser
- Check wallet is on correct network (devnet)

### Issue: Transaction failing

**Solutions:**
- Ensure you have enough devnet SOL
- Check wallet approved the transaction
- Verify platform wallet address is valid Solana address
- Look at console for detailed error

### Issue: Platform wallet not receiving fees

**Solutions:**
- Verify wallet address in all 3 files matches
- Check you're using same address as in wallet
- Ensure no extra spaces or characters
- Test with Solana Explorer: https://explorer.solana.com/

### Issue: Port 3000 already in use

**Solution:**
```bash
# Use different port
npm run dev -- -p 3001

# Or kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

### Issue: TypeScript errors

**Solution:**
```bash
# Update TypeScript
npm install typescript@latest

# Check tsconfig
cat tsconfig.json
```

## Verify Installation Checklist

- [ ] Node.js 18+ installed
- [ ] npm dependencies installed successfully
- [ ] Platform wallet configured (3 files)
- [ ] Devnet SOL in wallet (min 1 SOL)
- [ ] Dev server running on localhost:3000
- [ ] Wallet connects successfully
- [ ] Can access all pages (home, create, tokens, swap)
- [ ] Can create test token
- [ ] Can execute test trade
- [ ] Platform fees received in wallet

## Next Steps

Once installation is verified:

1. Read **QUICKSTART.md** for quick start guide
2. Read **SETUP.md** for detailed setup
3. Read **README.md** for full documentation
4. Test all features on devnet
5. Only then consider mainnet deployment

## Production Installation

For mainnet deployment:

```bash
# Build production version
npm run build

# Start production server
npm start

# Or deploy to Vercel
npm install -g vercel
vercel deploy --prod
```

Remember to update network to `mainnet-beta` before production deployment!

## Getting Help

If you encounter issues:

1. Check console for errors (`F12` in browser)
2. Check terminal for build errors
3. Review troubleshooting section above
4. Consult Solana docs: https://docs.solana.com/
5. Check wallet adapter docs: https://github.com/solana-labs/wallet-adapter

## Installation Complete! 🎉

Your Solana token platform is installed and ready to use.

Next: Follow **QUICKSTART.md** to start creating and trading tokens!
