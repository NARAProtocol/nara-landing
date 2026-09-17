# NARA Protocol — Official Landing & Sewer Meme Terminal

Welcome to the official landing page and Sewer Meme Terminal for **$NARA** on **Base** (Chain ID: 8453).

- **Token Contract:** `0x91FB78A9F46B67f54BbD4489941d19666b2fAe0f`
- **Network:** Base Mainnet (8453)
- **Official Swap:** `/` (Uniswap v4 Direct Hook Swap + 1-Click MetaMask Import)
- **Sewer Meme Terminal:** `/meme.html` (Interactive Viral Flushing, Operator Ranks, 12 Collectible Sticker NFTs & 1-Click X/Farcaster Posting)

---

## ?? Cloudflare Pages Deployment

This repository is configured for immediate, one-click deployment on **Cloudflare Pages**:

| Configuration | Value |
|---|---|
| **Framework preset** | `Vite` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` |
| **Node.js Version** | `20+` |

### Cloudflare Redirects (`public/_redirects`)
- `/meme` ? `/meme.html` (302)
- `/*` ? `/index.html` (200 SPA fallback)

---

## ??? Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# TypeScript check
npm run typecheck

# Production build
npm run build

# Preview build locally
npm run preview
```

---

## ?? License & Telemetry
© 2026 NARA Protocol. All rights reserved. Base Mainnet.
