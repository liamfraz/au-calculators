# Distribution Post Drafts — AU Communities

Base URL: https://au-calculators.vercel.app

---

## Post 1 — r/AusFinance

**Title:** Free stamp duty calculator I built for each state — thought it might help first home buyers

**Body:**

Been helping a mate figure out stamp duty for buying in QLD and realised how annoying it is to find up-to-date rates. Every state has different thresholds, different FHB concessions, and half the calculators online still show 2024 rates.

So I built one that covers all 8 states/territories with 2025-26 rates, FHB exemptions, and foreign buyer surcharges: https://au-calculators.vercel.app/calculators/stamp-duty

A few things that caught me off guard when building it:

- **NSW** FHB exemption goes to $800k (full) and $1M (concession) but the thresholds are different for new vs existing
- **VIC** has the highest rates once you pass $960k. The premium duty bracket is brutal
- **ACT** is actively phasing out stamp duty and replacing it with land tax. Completely different decision framework if you're buying there
- **WA** is genuinely the cheapest for a $500-700k purchase. Sometimes $10k+ less than VIC on the same price

Each state has its own page too if you want a deeper breakdown — [e.g. NSW](https://au-calculators.vercel.app/calculators/stamp-duty/nsw), [VIC](https://au-calculators.vercel.app/calculators/stamp-duty/vic), etc.

Also built a few other calculators while I was at it — [income tax](https://au-calculators.vercel.app/tax-withholding-calculator), [HECS repayments](https://au-calculators.vercel.app/calculators/hecs-help), [mortgage repayments](https://au-calculators.vercel.app/calculators/mortgage-repayment). All free, no sign-up, no ads (yet).

If you spot any rates that look off, let me know. Trying to keep them current.

---

## Post 2 — r/AusFinance

**Title:** Built a HECS repayment calculator with the 2026 thresholds — shows how much indexation actually costs you

**Body:**

The "should I pay off HECS early" question comes up constantly. So I built a calculator that makes the maths visible instead of abstract.

Plug in your balance and salary, and it shows:
- Your mandatory repayment rate and annual amount
- How many years until it's paid off at current income
- How much indexation adds each year at current CPI

https://au-calculators.vercel.app/calculators/hecs-help

The thing that surprises people is how much indexation costs on larger balances. On a $45k debt at 3.5% CPI, that's $1,575 added to your balance every June. Your mandatory repayments at $90k income are $4,500/year. So roughly a third of your repayment just covers the indexation. You're treading water more than you think.

That said, the maths usually still favours investing over voluntary repayments if your time horizon is 5+ years. CPI indexation isn't compounding in the way mortgage interest does. Run your own numbers and see where you land.

Uses the 2025-26 ATO repayment thresholds. If anyone notices the rates have changed, happy to update.

---

## Post 3 — r/AusHENRY

**Title:** Property investment calculators I built — negative gearing, rental yield, cash flow, and depreciation in one place

**Body:**

Got tired of running property investment numbers across five different spreadsheets so I built dedicated calculators for each piece of the puzzle.

**Rental Yield** — gross and net yield from purchase price and weekly rent. Includes expense breakdown (management fees, insurance, rates, maintenance, vacancy):
https://au-calculators.vercel.app/calculators/rental-yield

**Negative Gearing** — estimates your tax benefit from a negatively geared property. Shows how rental losses offset your taxable income at 2025-26 ATO rates:
https://au-calculators.vercel.app/calculators/negative-gearing

**Property Cash Flow** — compares rental income against all expenses including mortgage, rates, insurance, and management. Monthly and annual cash position:
https://au-calculators.vercel.app/calculators/property-cashflow

**Depreciation Estimator** — Division 43 (building allowance) and Division 40 (plant & equipment). Rough estimates to see if a QS report is worth ordering:
https://au-calculators.vercel.app/calculators/depreciation

**Land Tax** — all states, 2025-26 thresholds. Includes trust surcharges and absentee owner rates:
https://au-calculators.vercel.app/calculators/land-tax

The workflow I use: start with rental yield to screen properties, then run the cash flow calc to see weekly out-of-pocket, then check negative gearing to see the tax offset. Depreciation and land tax are the final pieces before making a decision.

All free, no login. Built them because the existing tools online are either paywalled, outdated, or don't handle AU-specific tax properly.

---

## Post 4 — r/australia

**Title:** Made a free Australian income tax calculator with 2025-26 brackets, Medicare levy, and HELP repayments

**Body:**

Tax time is coming and I wanted a quick way to check my take-home pay without signing into anything or giving my email away.

Built this: https://au-calculators.vercel.app/tax-withholding-calculator

Covers:
- 2025-26 ATO tax brackets (including the Stage 3 changes that kicked in last year)
- Medicare levy and Medicare levy surcharge
- HELP/HECS repayments based on current thresholds
- PAYG withholding amounts
- Net take-home pay broken down weekly, fortnightly, monthly, and annually

Useful for checking payslips, planning salary negotiations, or just understanding where your money goes. Also handy for seeing how overtime or a pay rise actually affects your pocket after tax and HECS.

It's part of a set of AU-specific financial calculators I've been building: https://au-calculators.vercel.app

Others include stamp duty (all states), mortgage repayments, super projections, energy bills, car loans, and a few property investment ones. All free, no account needed.

---

## Post 5 — r/AusProperty

**Title:** Land tax across states is wildly different — built a calculator to compare them all

**Body:**

Started looking into land tax for a potential IP and the differences between states are staggering.

The thresholds alone:

- **NSW** — tax-free threshold of $1,075,000 (general). Above that, $100 + 1.6% of value over the threshold
- **VIC** — threshold drops to $50,000 for trusts. If you're holding property in a trust in VIC, you're almost certainly paying land tax
- **QLD** — interstate landholdings now count toward your QLD land tax assessment, which caught a lot of investors off guard
- **WA** — no threshold for companies/trusts. Zero. Every dollar of land value is taxed

Built a calculator that handles all states with current 2025-26 rates, including trust surcharges and absentee owner rates: https://au-calculators.vercel.app/calculators/land-tax

If you're comparing investment properties across states, land tax is one of those costs that changes the numbers significantly. A $600k land value in VIC held in a trust attracts about $8k/year in land tax. Same property held by an individual pays about $1,300. The structure matters.

Also built calculators for [rental yield](https://au-calculators.vercel.app/calculators/rental-yield), [negative gearing](https://au-calculators.vercel.app/calculators/negative-gearing), and [property cash flow](https://au-calculators.vercel.app/calculators/property-cashflow) if you want the full picture.

---

## Post 6 — Whirlpool Forums (Finance Section)

**Title:** Free AU financial calculators — stamp duty, tax, HECS, mortgage, super, property investment

**Body:**

G'day,

Built a set of free financial calculators specifically for Australian conditions. No login, no email capture, no paywall. Just tools.

**The full list:**

- [Stamp Duty](https://au-calculators.vercel.app/calculators/stamp-duty) — all 8 states/territories, FHB concessions, 2025-26 rates
- [Income Tax](https://au-calculators.vercel.app/tax-withholding-calculator) — ATO brackets, Medicare levy, HELP repayments, take-home pay
- [HECS-HELP](https://au-calculators.vercel.app/calculators/hecs-help) — repayment thresholds, indexation impact, years to repay
- [Mortgage Repayment](https://au-calculators.vercel.app/calculators/mortgage-repayment) — amortization schedule, rate comparison
- [Car Loan](https://au-calculators.vercel.app/calculators/car-loan) — with balloon payment option, weekly/fortnightly/monthly
- [Superannuation](https://au-calculators.vercel.app/calculators/super) — retirement projection based on contributions and returns
- [Energy Bill](https://au-calculators.vercel.app/calculators/energy-bill) — quarterly estimate by state, solar savings comparison
- [Compound Interest](https://au-calculators.vercel.app/calculators/compound-interest) — AU bank rate presets, contribution modelling

**Property investment set:**
- [Rental Yield](https://au-calculators.vercel.app/calculators/rental-yield) — gross and net with expense breakdown
- [Negative Gearing](https://au-calculators.vercel.app/calculators/negative-gearing) — tax benefit estimation at 2025-26 rates
- [Property Cash Flow](https://au-calculators.vercel.app/calculators/property-cashflow) — income vs all expenses
- [Land Tax](https://au-calculators.vercel.app/calculators/land-tax) — all states, trust/absentee surcharges
- [Depreciation](https://au-calculators.vercel.app/calculators/depreciation) — Div 43 and Div 40 estimates
- [BMI](https://au-calculators.vercel.app/bmi-calculator) — includes AU health guidelines

Built them because the free calculators out there are mostly US-focused or still using last year's rates. These use 2025-26 ATO brackets, state government rates, and current thresholds.

Happy to take feedback on accuracy or features. Planning to keep them updated as rates change.

---

## Post 7 — OzBargain (Deal Submission)

**Title:** Free Australian Financial Calculator Suite — Stamp Duty, Tax, HECS, Mortgage, Super + 9 More (No Signup)

**Description:**

Free set of 14 Australian financial calculators. No account, no email, no paywall.

Covers stamp duty (all states with FHB concessions), income tax with 2025-26 brackets, HECS repayments, mortgage amortization, car loans with balloon payments, super projections, energy bills by state, compound interest, and a full property investment suite (rental yield, negative gearing, cash flow, land tax, depreciation).

All rates are current for 2025-26. Australian-specific — not a US calculator with a currency toggle.

Link: https://au-calculators.vercel.app

**Tags:** Finance, Calculator, Free, Tax

**Referrer/Coupon:** N/A (genuinely free, no affiliate)

---

## Post 8 — r/AusHENRY / Property Investment Forums

**Title:** The actual numbers behind negative gearing — ran scenarios for different income brackets and property types

**Body:**

Negative gearing gets talked about constantly but the actual dollar benefit varies a lot depending on your marginal tax rate and the size of the rental loss.

Quick example at different income levels, assuming a $600k IP with $500/wk rent, $2,800/mo mortgage, and $8k/year in expenses:

- **$90k income (32.5% marginal rate):** rental loss ~$6,200/year. Tax benefit ~$2,015. Out of pocket after tax: ~$4,185/year
- **$140k income (37% marginal rate):** same loss, tax benefit ~$2,294. Out of pocket: ~$3,906
- **$200k income (45% marginal rate):** same loss, tax benefit ~$2,790. Out of pocket: ~$3,410

The difference between a 32.5% and 45% marginal rate on that loss is only ~$775/year. Negative gearing helps, but it doesn't turn a bad investment into a good one. The property still needs to stack up on yield and growth.

Built a calculator that runs these scenarios with your actual numbers: https://au-calculators.vercel.app/calculators/negative-gearing

Pair it with:
- [Rental yield](https://au-calculators.vercel.app/calculators/rental-yield) to screen whether the property is even worth analysing
- [Cash flow](https://au-calculators.vercel.app/calculators/property-cashflow) to see your weekly out-of-pocket
- [Depreciation](https://au-calculators.vercel.app/calculators/depreciation) to estimate additional deductions (Div 43 + Div 40)

The tax benefit alone shouldn't drive the purchase decision. But knowing the exact numbers helps you budget for the holding cost while you wait for capital growth.

---

## Post 9 — r/AusFinance

**Title:** Energy bills by state are more different than I expected — built a calculator to estimate quarterly costs

**Body:**

Was trying to figure out whether solar was worth it at my place and ended up going down a rabbit hole on state-by-state energy pricing.

Some things that stood out:

- **SA** has the highest electricity rates in the country. A typical 3-bedroom house uses about 18-20 kWh/day and you're looking at $600-700/quarter just for electricity
- **TAS** has the cheapest rates but the highest heating costs because gas isn't common and winters are cold. Electric heating pushes usage up significantly
- **QLD** has no daily supply charge for some retailers on solar plans, which changes the solar payback calculation meaningfully
- **VIC** is the only state where gas is still widely used for heating and hot water. Dual fuel bills add up fast

Built a calculator that estimates your quarterly bill based on state, usage, and tariff: https://au-calculators.vercel.app/calculators/energy-bill

It also estimates solar savings and compares your usage to the state average. Helpful for figuring out whether a 6.6kW system makes financial sense or if you'd be better off just reducing usage.

Not a substitute for getting actual quotes, but useful for a quick sanity check before you commit to a $10k solar install.
