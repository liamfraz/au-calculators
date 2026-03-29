# Google AdSense Approval Checklist

## Pre-Application Requirements

### Content Requirements
- [x] Unique, high-quality content (mortgage calculator with FAQs)
- [x] Multiple pages of content (Home, Mortgage Calculator, About, Contact, Privacy, Terms)
- [x] No prohibited content (gambling, adult, etc.)
- [x] Content is useful and provides value to visitors

### Required Pages (All Created)
- [x] **Privacy Policy** (`/privacy`) — includes AdSense/cookies disclosure
- [x] **Terms of Use** (`/terms`) — includes financial disclaimer
- [x] **About Page** (`/about`) — explains site purpose and team
- [x] **Contact Page** (`/contact`) — provides email contact method

### Technical Setup
- [x] AdSense script tag added to root layout (loads conditionally via `NEXT_PUBLIC_ADSENSE_ID`)
- [x] Responsive ad units created (above calculator, below results, sidebar)
- [x] Cookie consent banner implemented (required for AU/GDPR compliance)
- [x] Site is mobile-responsive
- [x] Site loads quickly (static generation, minimal JS)
- [x] robots.txt exists in `/public`
- [x] Sitemap exists at `/sitemap.ts`

### Navigation
- [x] Clear site navigation with links to all key pages
- [x] Footer links to Privacy Policy, Terms, About, Contact
- [x] Header links to Home, Mortgage, About, Contact

---

## Steps to Apply for AdSense

### 1. Set Up Your Domain
- [ ] Use a custom domain (not `vercel.app`) — AdSense typically rejects free subdomains
- [ ] Point your domain's DNS to Vercel
- [ ] Update `metadataBase` in `app/layout.tsx` to your custom domain
- [ ] Update URLs in `app/sitemap.ts` to use custom domain

### 2. Create a Google AdSense Account
- [ ] Go to https://www.google.com/adsense/
- [ ] Sign in with your Google account
- [ ] Enter your website URL (custom domain)
- [ ] Select country: Australia
- [ ] Accept the AdSense Terms of Service

### 3. Add Your AdSense Publisher ID
- [ ] Copy your publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)
- [ ] Add to Vercel environment variables: `NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX`
- [ ] Redeploy the site

### 4. Verify Site Ownership
- [ ] AdSense will provide a verification code/meta tag
- [ ] Add it to your site's `<head>` if required (the Script tag in layout handles the main AdSense JS)
- [ ] Verify ownership in the AdSense dashboard

### 5. Wait for Review
- [ ] Google typically reviews sites within 1-14 days
- [ ] Ensure the site stays live and accessible during review
- [ ] Do NOT click your own ads after approval

### 6. After Approval — Replace Ad Slots
- [ ] Create ad units in AdSense dashboard (Display ads, responsive)
- [ ] Replace placeholder slot IDs in code:
  - `app/calculators/mortgage-repayment/page.tsx` — slots: `above-calculator`, `below-results`, `sidebar`
- [ ] Each ad unit gets a unique numeric slot ID from AdSense (e.g., `1234567890`)

---

## Tips for Faster Approval

1. **Custom domain is essential** — Google rarely approves `*.vercel.app` subdomains
2. **More content helps** — Add 2-3 more calculators before applying if possible
3. **Organic traffic** — Some traffic before applying improves chances
4. **No broken links** — Ensure all pages load correctly
5. **Mobile-friendly** — Google checks mobile rendering
6. **HTTPS** — Required (Vercel provides this by default)

## Estimated Timeline
1. Get custom domain → 1 day
2. Add more calculators → ongoing
3. Apply for AdSense → once domain is live with content
4. Review period → 1-14 days
5. Start earning → immediately after approval
