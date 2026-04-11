# Google Search Console Setup

## Status
- Sitemap: **READY** — `https://au-calculators.vercel.app/sitemap.xml` (44 URLs)
- GSC Verification: **NOT DONE** — complete the steps below
- robots.txt: **READY** — already points to sitemap

## Step 1: Add Your Site to GSC

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **Add property**
3. Choose **URL prefix** and enter: `https://au-calculators.vercel.app`
   - (If you have a custom domain, use that instead)
4. Click **Continue**

## Step 2: Verify Ownership

GSC will offer several verification methods. The easiest for this Next.js site:

### Option A: HTML Meta Tag (Recommended)
GSC will give you a meta tag like:
```html
<meta name="google-site-verification" content="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />
```

Add it to `app/layout.tsx` in the `metadata` export:
```typescript
export const metadata: Metadata = {
  // ... existing metadata ...
  verification: {
    google: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  },
};
```

Then redeploy: `vercel --prod`

### Option B: HTML File
GSC will give you a file like `google12345abcde.html`.
Place it in `/public/google12345abcde.html`.
Then redeploy: `vercel --prod`

## Step 3: Submit Sitemap

Once verified:
1. In GSC left sidebar → **Sitemaps**
2. Enter: `sitemap.xml`
3. Click **Submit**

GSC will crawl and index your pages within 1–7 days.

## Step 4: Monitor

Key GSC reports to watch:
- **Coverage** — pages indexed vs not indexed
- **Performance** — clicks, impressions, CTR, position
- **Core Web Vitals** — page experience signals

## Sitemap Contents (44 URLs)

The sitemap at `app/sitemap.ts` includes:
- Home page (priority 1.0)
- 18+ main calculator routes (priority 0.9)
- 4 secondary calculators (priority 0.8)
- Legacy/redirect routes (priority 0.7)
- Static pages: /about, /contact, /privacy, /terms (priority 0.3–0.4)
- Dynamic suburb pages for: mortgage-rates, stamp-duty, car-loan, energy-bill, mortgage-offset, rental-yield

## Notes

- robots.txt is already correct: `Sitemap: https://au-calculators.vercel.app/sitemap.xml`
- All 44 static URLs use HTTPS
- `lastmod` is set to today's date dynamically in `app/sitemap.ts`
