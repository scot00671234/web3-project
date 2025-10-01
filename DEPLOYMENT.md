# 🚀 Deployment Guide

## Pre-Deployment Checklist

### Critical Steps Before Going Live

- [ ] **Test on Devnet** (minimum 20 transactions)
  - Create 5+ test tokens
  - Execute 10+ buy transactions
  - Execute 10+ sell transactions
  - Test with multiple wallets
  - Verify all fees route correctly

- [ ] **Security Audit**
  - Platform wallet address verified in all files
  - Fee calculations tested and accurate
  - No placeholder values remaining
  - All error handling tested

- [ ] **Performance Testing**
  - Test with slow network
  - Test transaction failures
  - Test wallet disconnections
  - Verify UI responsiveness

## Mainnet Configuration

### 1. Update Network Settings

**File: `components/WalletContextProvider.tsx`**

Change line 12:
```typescript
// FROM:
const endpoint = useMemo(() => clusterApiUrl('devnet'), [])

// TO:
const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), [])
```

### 2. Set Up Production RPC (Highly Recommended)

Using a dedicated RPC improves speed and reliability.

**Recommended Providers:**

#### Helius (Recommended)
```typescript
const endpoint = useMemo(() => 
  'https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY', []
)
```
- Sign up: https://helius.dev/
- Free tier: 100k requests/month
- Pricing: $79/month for 1M requests

#### QuickNode
```typescript
const endpoint = useMemo(() => 
  'https://your-endpoint.solana-mainnet.quiknode.pro/YOUR_KEY/', []
)
```
- Sign up: https://quicknode.com/
- Free tier: 10M requests/month
- Pricing: Starting at $9/month

#### Alchemy
```typescript
const endpoint = useMemo(() => 
  'https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY', []
)
```
- Sign up: https://www.alchemy.com/
- Free tier: 3M requests/month

### 3. Environment Variables

Create `.env.production`:

```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_PLATFORM_WALLET=YOUR_PRODUCTION_WALLET
NEXT_PUBLIC_PLATFORM_FEE_PERCENT=0.5
NEXT_PUBLIC_SOLANA_RPC_URL=https://your-rpc-endpoint.com
```

## Deployment Platforms

### Option 1: Vercel (Recommended)

**Why Vercel:**
- Optimized for Next.js
- Automatic deployments
- Free SSL
- Global CDN
- Free hobby tier

**Deploy Steps:**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

4. Set environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.production`

**Custom Domain:**
```bash
vercel domains add yourdomain.com
```

### Option 2: Netlify

**Deploy Steps:**

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod
```

4. Set environment variables:
```bash
netlify env:set NEXT_PUBLIC_SOLANA_NETWORK mainnet-beta
netlify env:set NEXT_PUBLIC_PLATFORM_WALLET YOUR_WALLET
```

### Option 3: Self-Hosted (VPS)

**Requirements:**
- Ubuntu 20.04+ or similar
- Node.js 18+
- Nginx
- PM2 for process management

**Setup:**

1. SSH into server:
```bash
ssh user@your-server-ip
```

2. Install dependencies:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

3. Clone and build:
```bash
git clone your-repo-url
cd your-project
npm install
npm run build
```

4. Start with PM2:
```bash
pm2 start npm --name "solana-platform" -- start
pm2 save
pm2 startup
```

5. Configure Nginx:
```bash
sudo nano /etc/nginx/sites-available/solana-platform
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/solana-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

6. Set up SSL (Let's Encrypt):
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

## Post-Deployment Steps

### 1. Verify Deployment

- [ ] Access deployed URL
- [ ] Connect wallet (mainnet)
- [ ] Create test token with small amounts
- [ ] Execute small test trade
- [ ] Verify platform fee received
- [ ] Check all pages load correctly
- [ ] Test on mobile devices

### 2. Monitor Initial Transactions

```bash
# Monitor logs (Vercel)
vercel logs

# Monitor logs (Netlify)
netlify logs

# Monitor logs (PM2)
pm2 logs solana-platform
```

### 3. Set Up Analytics

**Google Analytics:**

Add to `app/layout.tsx`:
```typescript
import Script from 'next/script'

// In component:
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

// In component:
<Analytics />
```

### 4. Error Monitoring (Optional)

**Sentry:**
```bash
npm install @sentry/nextjs
```

Initialize:
```bash
npx @sentry/wizard -i nextjs
```

## Scaling Considerations

### As Your Platform Grows

**100+ Daily Users:**
- Upgrade to paid RPC tier
- Enable caching for token data
- Add database for token metadata

**1000+ Daily Users:**
- Implement rate limiting
- Add Redis for caching
- Use CDN for static assets
- Scale RPC infrastructure

**10,000+ Daily Users:**
- Microservices architecture
- Load balancing
- Dedicated indexer
- Professional RPC tier

## Maintenance

### Regular Tasks

**Daily:**
- Monitor transaction success rate
- Check platform fee collection
- Review error logs

**Weekly:**
- Update dependencies
- Review analytics
- Backup configuration

**Monthly:**
- Security audit
- Performance optimization
- Cost analysis

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all
npm update

# Update specific package
npm update @solana/web3.js
```

## Rollback Strategy

### If Issues Occur

**Vercel:**
```bash
# Rollback to previous deployment
vercel rollback
```

**Netlify:**
- Go to Deploys tab
- Click "Publish deploy" on previous version

**PM2:**
```bash
# Revert code
git checkout previous-commit

# Rebuild
npm run build

# Restart
pm2 restart solana-platform
```

## Cost Estimates

### Monthly Costs

**Small Scale (0-1000 users/month):**
- Hosting: $0 (Vercel free tier)
- RPC: $0 (Helius free tier)
- Domain: $12/year
- **Total: ~$1/month**

**Medium Scale (1000-10,000 users/month):**
- Hosting: $20 (Vercel Pro)
- RPC: $79 (Helius Business)
- Domain: $12/year
- **Total: ~$100/month**

**Large Scale (10,000+ users/month):**
- Hosting: $200 (Enterprise)
- RPC: $500 (Dedicated)
- Infrastructure: $300
- **Total: ~$1000/month**

**Revenue Potential:**
- 10,000 monthly trades
- Average trade: $100
- Platform fee: 0.5%
- **Monthly revenue: $5,000**

## Security Best Practices

- [ ] Use environment variables for sensitive data
- [ ] Enable rate limiting
- [ ] Implement CORS properly
- [ ] Keep dependencies updated
- [ ] Monitor for suspicious transactions
- [ ] Regular security audits
- [ ] Backup platform wallet private key (OFFLINE)

## Final Pre-Launch Checklist

- [ ] All tests passing on devnet
- [ ] Network changed to mainnet-beta
- [ ] Production RPC configured
- [ ] Platform wallet secured
- [ ] Analytics set up
- [ ] Error monitoring active
- [ ] SSL certificate installed
- [ ] Custom domain configured
- [ ] Mobile tested
- [ ] Small real transaction tested
- [ ] Documentation updated
- [ ] Team trained on platform

## Launch! 🚀

Once all checks pass:

1. Announce on Twitter/Discord
2. Monitor first 24 hours closely
3. Be ready for quick fixes
4. Engage with early users
5. Collect feedback
6. Iterate and improve

**You're ready to change the game on Solana!**
