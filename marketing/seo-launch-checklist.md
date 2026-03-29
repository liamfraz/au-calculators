# SEO Launch Checklist

## Domain & Verification

Base URL: `https://au-calculators.vercel.app`
Sitemap URL: `https://au-calculators.vercel.app/sitemap.xml`

### Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **Add Property** > choose **URL prefix** > enter `https://au-calculators.vercel.app`
3. Verify ownership using one of:
   - **HTML tag** (recommended for Vercel): Add the meta tag to `app/layout.tsx` inside `metadata.verification`
   - **DNS TXT record**: Add via your domain registrar if using a custom domain later
   - **HTML file**: Download the verification file, place in `public/`, deploy
4. After verification, go to **Sitemaps** in the left sidebar
5. Enter `sitemap.xml` and click **Submit**
6. Confirm status shows "Success" (may take a few minutes)

### Manual Indexing Requests

After sitemap submission, request indexing for priority pages via **URL Inspection** tool in Search Console:

| Priority | URL | Notes |
|----------|-----|-------|
| 1 | `/calculators/stamp-duty` | Highest search volume target |
| 2 | `/calculators/mortgage-repayment` | Evergreen high-intent keyword |
| 3 | `/calculators/hecs-help` | Seasonal spikes around tax time & graduation |
| 4 | `/calculators/car-loan` | Consistent search demand |
| 5 | `/calculators/energy-bill` | Topical with rising energy costs |
| 6 | `/calculators/super` | Pairs well with EOFY content |
| 7 | `/` | Homepage — links to all calculators |

For each: paste the full URL into URL Inspection > click **Request Indexing**.

### Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Import from Google Search Console (fastest) or add site manually
3. Submit the same sitemap URL

### Post-Launch Monitoring

- [ ] Check Search Console **Coverage** report after 48 hours — fix any errors
- [ ] Monitor **Performance** report weekly for first month
- [ ] Set up email alerts for coverage issues
- [ ] Check Core Web Vitals report (Vercel + Next.js should score well)
- [ ] After stamp duty state pages are built, update sitemap and re-submit
