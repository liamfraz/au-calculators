# Marketing Launch Log

## Reddit Posts

| Subreddit | Date | Status | URL |
|-----------|------|--------|-----|
| r/AusFinance | 2026-04-11 | Pending | — |
| r/AusPropertyInvestors | 2026-04-11 | Pending | — |

*Update this file with URLs once posts are live.*

### Post Content

- r/AusFinance: `marketing/reddit-ausfinance-post.md`
- r/AusPropertyInvestors: `marketing/reddit-auspropertyinvestors-post.md`

### To post (requires Chrome to be closed)

```bash
# Close Chrome first, then:
node marketing/post-to-reddit.mjs

# Or if you want to log in fresh in a browser window:
node marketing/post-to-reddit.mjs --wait-for-login
```

> **Why Chrome must be closed**: The script uses your existing Chrome profile (which has your Reddit session). If Chrome is open, the profile is locked and the script falls back to a fresh browser with no session.

---

## AdSense Status

**Status: NOT SET UP — Revenue blocked**

Root cause: Google AdSense account has not been created yet.

### What's working (code is ready):
- ✅ AdSense script loads conditionally when `NEXT_PUBLIC_ADSENSE_ID` is set
- ✅ `AdUnit` component in `app/components/AdUnit.tsx` renders `above-calculator`, `below-results`, `sidebar` slots
- ✅ 51 calculator pages include ad units
- ✅ No CSP headers blocking ad delivery
- ✅ `public/ads.txt` exists (needs real publisher ID)

### Blockers in order:

1. **Get a custom domain** — Google rarely approves `*.vercel.app` subdomains
   - Buy `aucalculators.com.au` or similar
   - Point DNS to Vercel
   - Update `metadataBase` in `app/layout.tsx` and `baseUrl` in `app/sitemap.ts`

2. **Create Google AdSense account** at https://www.google.com/adsense/
   - Enter your custom domain
   - Accept T&Cs

3. **Set publisher ID in Vercel**
   ```
   vercel env add NEXT_PUBLIC_ADSENSE_ID production
   # Enter: ca-pub-XXXXXXXXXXXXXXXX
   vercel --prod
   ```

4. **Update ads.txt** — replace `pub-XXXXXXXXXXXXXXXX` in `public/ads.txt` with real publisher ID

5. **Wait for Google approval** (1–14 days)

6. **Replace placeholder slot IDs** — after approval, create 3 ad units in AdSense dashboard and replace the slot name strings in every calculator page:
   - `"above-calculator"` → real numeric ID (e.g. `"1234567890"`)
   - `"below-results"` → real numeric ID
   - `"sidebar"` → real numeric ID

---

## Google Search Console Status

**Status: NOT VERIFIED — Set up required**

- Sitemap: ✅ Ready at `/sitemap.xml` (44 URLs)
- GSC Verification: ❌ Not done
- robots.txt: ✅ Correct

**Instructions:** See `marketing/gsc-setup.md`

Quick steps:
1. Go to https://search.google.com/search-console
2. Add `https://au-calculators.vercel.app` as URL prefix property
3. Get the `google-site-verification` meta tag
4. Add to `app/layout.tsx` metadata:
   ```ts
   verification: { google: "YOUR_CODE_HERE" }
   ```
5. `vercel --prod`
6. Submit sitemap in GSC → Sitemaps → `sitemap.xml`
