# Solana Token Platform - MVP

A decentralized token creation and trading platform built on Solana. Create tokens with zero upfront costs and trade with automated liquidity pools.

## 🚀 Features

- **Token Creation**: Create SPL tokens with zero upfront costs
- **First Buyer Fee Model**: Creator pays nothing, first buyer covers network + platform fee
- **Instant Trading**: Automated liquidity pools via Raydium/Orca integration
- **Platform Revenue**: 0.5% fee on all trades routed to company wallet
- **Wallet Integration**: Phantom & Solflare wallet support
- **Real-time Charts**: Price and volume tracking
- **Fully On-Chain**: All transactions transparent and verifiable

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Solana Web3.js, SPL Token Program
- **Wallets**: Solana Wallet Adapter (Phantom, Solflare)
- **Charts**: Recharts
- **DEX Integration**: Raydium, Orca (planned)

## 📦 Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your platform wallet address:

```
NEXT_PUBLIC_PLATFORM_WALLET=YourActualWalletAddress
```

5. Run development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 🌐 Nixpacks Deployment

The repo includes a `nixpacks.toml` that defines the build and run phases for deployment to any VPS supporting [Nixpacks](https://nixpacks.com/).

```bash
nixpacks build . -o output
docker load < output/image.tar
docker run -p 3000:3000 <image-id>
```

During deploy Nixpacks installs dependencies, runs `npm run build`, and starts the app with `npm run start`.

## 🧪 Testing

The platform is configured for **Solana Devnet** by default.

### Getting Devnet SOL

1. Install Phantom or Solflare wallet
2. Switch to Devnet in wallet settings
3. Get free devnet SOL: https://faucet.solana.com/

### Testing Flow

1. **Create Token**:
   - Connect wallet (on devnet)
   - Fill token details (name, symbol, supply)
   - Click "Create Token" (free for creator)

2. **First Buy** (tests first buyer fee):
   - Navigate to created token
   - Enter buy amount
   - Confirm transaction (pays network + 0.5% platform fee)

3. **Trading**:
   - Buy/sell tokens
   - Each trade incurs 0.5% platform fee
   - Fee automatically routes to company wallet

## 🏗️ Architecture

### Smart Contracts
- **SPL Token Program**: Token creation (audited)
- **Raydium/Orca**: Swap & liquidity (audited)
- **No custom contracts**: Zero smart contract risk

### Fee Structure
- **Token Creation**: FREE for creator
- **First Purchase**: Network fee (~0.01 SOL) + 0.5% platform fee
- **All Trades**: 0.5% platform fee on every transaction

### Revenue Flow
```
Trade → Platform Fee (0.5%) → Company Wallet
```

## 🚀 Deployment

### Mainnet Deployment

1. Update `.env.local`:
```
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

2. Test thoroughly on devnet first!

3. Build for production:
```bash
npm run build
npm run start
```

4. Deploy to Vercel/Netlify:
```bash
vercel deploy
# or
netlify deploy
```

## 🔒 Security Notes

- Uses battle-tested SPL Token program
- No custom smart contracts
- All transactions fully on-chain
- Platform wallet receives fees automatically
- Test on devnet before mainnet deployment

## 📝 Configuration

### Platform Wallet
Update in both:
1. `.env.local`: `NEXT_PUBLIC_PLATFORM_WALLET`
2. `utils/tokenUtils.ts`: `PLATFORM_WALLET`
3. `utils/swapUtils.ts`: `PLATFORM_WALLET`

### Platform Fee
Update in:
1. `.env.local`: `NEXT_PUBLIC_PLATFORM_FEE_PERCENT`
2. `utils/swapUtils.ts`: `PLATFORM_FEE_PERCENT`

## 🔮 Future Enhancements

- [ ] Jupiter aggregator integration (best swap rates)
- [ ] Raydium pool creation for new tokens
- [ ] Token metadata (via Metaplex)
- [ ] NFT badges for early adopters
- [ ] Shareable token links
- [ ] Advanced charting (TradingView)
- [ ] Token verification system
- [ ] Liquidity mining rewards

## 📄 License

MIT

## ⚠️ Disclaimer

This is MVP code. Conduct thorough testing before mainnet deployment. Trading cryptocurrencies involves risk. Use at your own discretion.
