# r/AusPropertyInvestors Post

## Title
Built a free investment property cash flow calculator for Australian investors — accounts for negative gearing, vacancy, management fees, stamp duty

## Body

Every cash flow spreadsheet I've seen either uses US assumptions or is a mess to maintain. I built a free calculator that handles the AU-specific stuff properly.

**Example: $650k Sydney property, $550/week rent**

Inputs used:
- Purchase price: $650,000
- Deposit: 20% ($130,000)
- Loan: $520,000 at 6.5% interest
- Weekly rent: $550
- Vacancy: 3%
- Management fee: 7%
- Council rates: $2,000/year
- Insurance: $1,500/year
- Maintenance: $2,000/year

**Results:**
- Gross annual rent: $28,600
- After 3% vacancy: $27,742 effective income
- Annual mortgage (P&I): $40,537
- Total operating expenses (ex-mortgage): $8,443
- **Annual cash flow: -$21,238 (negative gearing)**
- **Weekly out of pocket: $408**

**Tax breakdown (at 37% marginal rate):**
- Deductible expenses (interest + operating): $42,243
- Annual tax saving from negative gearing: ~$15,630
- After-tax actual cost: ~$5,600/year ($108/week)

Gross yield is 4.4%, net yield drops to 2.9% after running costs. The calculator shows you the real cash-on-cash return on your $130k deposit, which in this case is -16.3%.

The whole point of the tool is to show you the gap between "yield looks ok" and "what actually hits your bank account." You can toggle between P&I and interest-only, adjust vacancy rate, management fees, etc.

Also has separate calculators for:
- Capital gains tax (with 50% discount logic)
- Stamp duty by state (including first home buyer concessions)
- Depreciation estimates
- Land tax by state
- Negative gearing standalone

Link: https://au-calculators.vercel.app/calculators/investment-property-cashflow

No sign-up required. Feedback welcome — especially if something is wrong with any state's tax rules.
