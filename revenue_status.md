# Revenue Status Report
Generated: 2026-04-12

---

## CRITICAL BLOCKER: AdSense ID Not Set in Production

**`NEXT_PUBLIC_ADSENSE_ID` is not configured as a Vercel environment variable.**

Confirmed via `vercel env ls` — zero environment variables set for this project.

### Impact
- `app/layout.tsx:47` — `<meta name="google-adsense-account">` tag is **not rendered** in production
- `app/layout.tsx:51` — AdSense script (`pagead2.googlesyndication.com`) is **not loaded** in production
- `app/components/AdUnit.tsx:28` — All 62 AdUnit placements show a placeholder div: `"Ad Space — Configure NEXT_PUBLIC_ADSENSE_ID"` — **no real ads served anywhere**

Without the publisher ID meta tag in the `<head>`, Google cannot verify site ownership, which is required for AdSense approval and ad serving.

### Fix Required
Add the environment variable in the Vercel dashboard:
1. Go to vercel.com → au-calculators project → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_ADSENSE_ID` = `ca-pub-XXXXXXXXXXXXXXXX` (your publisher ID)
3. Set for: Production, Preview, Development
4. Redeploy

---

## AdSense Approval Status

**Status: Cannot verify automatically** — requires browser login to adsense.google.com.

Estimated earnings to date: **Unknown** (ads not serving in production regardless of approval status)

Manual check needed:
- [ ] Log into adsense.google.com
- [ ] Confirm site `au-calculators.vercel.app` is added and approved
- [ ] Check for any policy violations flagged

---

## Google Search Console — Indexing Status

**Status: Cannot verify automatically** — requires browser login to search.google.com/search-console.

### Pages to Submit for Indexing (5 most recent calculators)
Submit these via the URL Inspection tool → "Request Indexing":

1. `https://au-calculators.vercel.app/calculators/hecs-help`
2. `https://au-calculators.vercel.app/calculators/negative-gearing`
3. `https://au-calculators.vercel.app/calculators/income-tax`
4. `https://au-calculators.vercel.app/calculators/car-loan`
5. `https://au-calculators.vercel.app/calculators/crypto-capital-gains-tax`

Manual check needed:
- [ ] Log into Google Search Console for au-calculators.vercel.app
- [ ] Check Coverage report → total indexed pages
- [ ] Request indexing for the 5 URLs above
- [ ] Check for crawl errors

---

## Total Pages in Sitemap

| Route Group | Count |
|---|---|
| Static calculator pages (non-dynamic) | ~55 |
| Stamp duty suburbs (`/stamp-duty-calculator/[suburb]`) | 51 |
| Stamp duty state pages (`/calculators/stamp-duty/[state]`) | 8 |
| Car loan suburbs (`/calculators/car-loan/[suburb]`) | 21 |
| Energy bill suburbs (`/calculators/energy-bill/[suburb]`) | 21 |
| Mortgage offset suburbs (`/calculators/mortgage-offset/[suburb]`) | 31 |
| Rental yield suburbs (`/calculators/rental-yield/[suburb]`) | 21 |
| Suburb hub pages (`/suburbs/[suburb]`) | 21 |
| Mortgage rate suburbs (`/mortgage-rates/[suburb]`) | 51 |
| **Total** | **~280 pages** |

Sitemap is served at: `https://au-calculators.vercel.app/sitemap.xml` (via `app/sitemap.ts`)

AdUnit placements exist in **62 pages** — all showing placeholder content until `NEXT_PUBLIC_ADSENSE_ID` is set.

---

## Action Items (Priority Order)

1. **[URGENT]** Add `NEXT_PUBLIC_ADSENSE_ID` to Vercel environment variables and redeploy
2. **[URGENT]** Verify AdSense account at adsense.google.com — confirm site approved, no policy violations
3. Submit 5 most recent calculator URLs for indexing in Google Search Console
4. Check GSC Coverage report for total indexed page count and any crawl errors
5. Once ID is set + site approved: verify ads render on live site (check a calculator page)
