# Revenue Audit — 2026-04-13

Audit run: 2026-04-13 12:00 AM AEDT
Method: Live browser session (Google Chrome) via AppleScript automation

---

## AdSense

**Total earnings (last 30 days): $0.00**

The AdSense account (pub-5516095417661827) is in onboarding and has NOT yet been approved to serve ads. No reports are accessible — the dashboard redirects to `/onboarding` on every visit.

### Sites in this AdSense account

| Site | Approval Status | Detail | Ads.txt |
|---|---|---|---|
| devtools.page | Needs attention | Low value content | Not found |
| micro-tools-lilac.vercel.app | Requires review | — | Not found |

### Critical gap

**`au-calculators.vercel.app` is not connected to this AdSense account at all.**

The site that this repository deploys to is not registered in AdSense. Before any revenue can flow, `au-calculators.vercel.app` must be added as a site in the AdSense account and the `ads.txt` file must be published at `https://au-calculators.vercel.app/ads.txt`.

### Top 3 earning pages

N/A — $0 total earnings, AdSense not connected to this site.

### Blockers to resolve

1. Add `au-calculators.vercel.app` as a site in AdSense → Sites → + New site
2. Publish `ads.txt` at the root (both the au-calculators domain and any other connected domains)
3. Resolve the "Low value content" flag on `devtools.page` or remove it from the account

---

## Google Search Console

**Total clicks (last 28 days): 0**
**Total impressions (last 28 days): N/A**

### Critical gap

**`au-calculators.vercel.app` is NOT verified in Google Search Console.**

The only GSC property in this account is `micro-tools-lilac.vercel.app`, which has:
- Total clicks: **0**
- Total impressions: **4** (over 3 months)
- Average position: **8.8**
- Average CTR: **0%**

Google has no visibility into the au-calculators site's performance because it was never submitted. This means:
- No impression or click data is available
- Index coverage is unknown
- Sitemaps have not been submitted

### Blockers to resolve

1. Add `https://au-calculators.vercel.app/` as a URL-prefix property in GSC
2. Verify via HTML file or DNS
3. Submit `https://au-calculators.vercel.app/sitemap.xml`
4. Monitor Index Coverage and Core Web Vitals after submission

---

## Next Calculator to Build

**Recommended: Personal Loan Calculator**

Because `au-calculators.vercel.app` is not in GSC, there is no direct impression data to confirm keyword gaps. Recommendation is based on AU search landscape analysis against the existing tool inventory.

### Why

The site already covers:
- Secured debt: mortgage repayment, car loan, mortgage offset
- Investment: rental yield, negative gearing, capital gains tax
- Tax: income tax, HECS, stamp duty, land tax, CGT, BAS, salary sacrifice
- Super: super, SMSF, co-contribution, super-calculator
- Government: age pension, child care subsidy, Centrelink, FHOG, FHBC

**Not covered:** personal loans — a distinct, high-volume AU search category:
- "personal loan calculator australia" — estimated 5,000–15,000 searches/month
- "personal loan repayment calculator" — estimated 2,000–5,000 searches/month

A personal loan calculator with AU lender rate comparison (similar to the car-loan pattern already in place) would be the quickest high-ROI build. The car-loan calculator + suburbs pattern already exists and can be replicated almost entirely.

### Runner-up

**Budget Planner / Monthly Budget Calculator** — high volume, no existing tool, broad audience beyond financially-savvy users.

---

## Immediate Action Items

| Priority | Action | Effort |
|---|---|---|
| 🔴 P0 | Add `au-calculators.vercel.app` to AdSense Sites | 5 min |
| 🔴 P0 | Publish `ads.txt` to the site | 30 min |
| 🔴 P0 | Verify `au-calculators.vercel.app` in GSC | 15 min |
| 🔴 P0 | Submit sitemap to GSC | 5 min |
| 🟡 P1 | Resolve `devtools.page` "Low value content" flag in AdSense | 1–2 hrs |
| 🟡 P1 | Resolve `micro-tools` "Requires review" in AdSense | Pending review |
| 🟢 P2 | Build Personal Loan Calculator | ~1 day |
