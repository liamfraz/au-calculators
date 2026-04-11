/**
 * Reddit Auto-Poster for au-calculators
 *
 * HOW TO USE:
 * 1. Close all Chrome windows (so the profile isn't locked)
 * 2. Run: node marketing/post-to-reddit.mjs
 * 3. Log in to Reddit when the browser opens
 * 4. The script will auto-submit both posts
 *
 * Or if you want to log in first and then run:
 * 1. Run the script with --wait-for-login flag:
 *    node marketing/post-to-reddit.mjs --wait-for-login
 */

import { chromium } from 'playwright';
import path from 'path';
import os from 'os';


const WAIT_FOR_LOGIN = process.argv.includes('--wait-for-login');
const CHROME_USER_DATA = path.join(os.homedir(), 'Library/Application Support/Google/Chrome');

const POSTS = [
  {
    subreddit: 'AusFinance',
    title: "I built free Australian finance calculators — mortgage, investment property cash flow, capital gains tax, stamp duty, income tax [no sign-up]",
    body: `Been using US-based calculators for years that don't account for Australian tax brackets, CGT discount rules, stamp duty schedules by state, or HECS repayment thresholds. Got frustrated and built my own.

**Some examples of what it actually calculates:**

**Mortgage ($750k, 6.2%, 30 years):**
- Monthly repayment: $4,505
- Total interest over loan life: $872,775
- Side-by-side comparison for different rates (so you can see what a 0.5% rate drop actually saves you)

**Capital Gains Tax (property bought $500k, sold $800k, held 2 years, income $120k):**
- Capital gain: $300,000
- After 50% CGT discount (held >12 months): taxable gain = $150,000
- CGT payable: ~$58,000
- After-tax profit: $242,000
- The 50% discount alone saved $75k — most people don't realise how significant that is

**Investment Property Cash Flow ($650k property, $550/week rent, 80% LVR, 6.5% rate):**
- Gross yield: 4.4%
- Net yield after expenses: 2.9%
- Annual cash flow: -$21,238 (negative gearing)
- At 37% marginal rate, tax saving from negative gearing: ~$15,630/year
- Actual out-of-pocket after tax benefit: ~$5,600/year

Full list of calculators:
- Income tax (updated for 2024-25 Stage 3 cuts)
- Mortgage repayment + offset
- Capital gains tax (individuals, companies, trusts)
- Stamp duty (all 8 states/territories)
- First home buyer concession by state
- Investment property cash flow / negative gearing / rental yield
- HECS/HELP repayment
- Superannuation (including salary sacrifice)
- Centrelink / age pension / child care subsidy
- Land tax / depreciation / compound interest

Site: https://au-calculators.vercel.app

No sign-up, no email, no ads. Just calculators. Happy to take feedback on what's missing or what's wrong.`
  },
  {
    subreddit: 'AusPropertyInvestors',
    title: "Built a free investment property cash flow calculator for Australian investors — accounts for negative gearing, vacancy, management fees, stamp duty",
    body: `Every cash flow spreadsheet I've seen either uses US assumptions or is a mess to maintain. I built a free calculator that handles the AU-specific stuff properly.

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
- After-tax actual cost: ~$5,600/year (~$108/week)

Gross yield is 4.4%, net yield drops to 2.9% after running costs. The calculator shows you the real cash-on-cash return on your $130k deposit, which in this case is -16.3%.

The whole point of the tool is to show you the gap between "yield looks ok" and "what actually hits your bank account." You can toggle between P&I and interest-only, adjust vacancy rate, management fees, etc.

Also has separate calculators for:
- Capital gains tax (with 50% discount logic)
- Stamp duty by state (including first home buyer concessions)
- Depreciation estimates
- Land tax by state
- Negative gearing standalone

Link: https://au-calculators.vercel.app/calculators/investment-property-cashflow

No sign-up required. Feedback welcome — especially if something is wrong with any state's tax rules.`
  }
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function postToSubreddit(page, post) {
  console.log(`\n📝 Posting to r/${post.subreddit}...`);

  await page.goto(`https://www.reddit.com/r/${post.subreddit}/submit`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  await sleep(3000);

  // Check if logged in
  const url = page.url();
  if (url.includes('/login')) {
    console.log('❌ Not logged in to Reddit. Please log in manually.');
    return { success: false, error: 'Not logged in' };
  }

  // Reddit new UI - look for the post type tabs
  // Try to click "Text" tab if available
  try {
    const textTab = await page.$('[data-testid="post-type-text"], button:has-text("Text"), [role="tab"]:has-text("Text")');
    if (textTab) {
      await textTab.click();
      await sleep(1000);
    }
  } catch {}

  // Find title input
  const titleSelectors = [
    'textarea[placeholder*="title" i]',
    'input[placeholder*="title" i]',
    '[name="title"]',
    '[data-testid="post-title"]',
    'textarea[id*="title" i]'
  ];

  let titleInput = null;
  for (const sel of titleSelectors) {
    titleInput = await page.$(sel);
    if (titleInput) break;
  }

  if (!titleInput) {
    console.log('⚠️  Could not find title input. Taking screenshot...');
    await page.screenshot({ path: `/tmp/reddit-${post.subreddit}-form.png` });
    console.log(`Screenshot at /tmp/reddit-${post.subreddit}-form.png`);
    return { success: false, error: 'Title input not found' };
  }

  // Enter title
  await titleInput.click();
  await page.keyboard.type(post.title, { delay: 20 });
  await sleep(1000);

  // Find body/text area
  const bodySelectors = [
    'div[contenteditable="true"]',
    'textarea[placeholder*="text" i]',
    '.DraftEditor-editorContainer',
    '[data-testid="post-content"]',
    '.public-DraftEditor-content'
  ];

  let bodyInput = null;
  for (const sel of bodySelectors) {
    bodyInput = await page.$(sel);
    if (bodyInput) break;
  }

  if (bodyInput) {
    await bodyInput.click();
    await sleep(500);
    await page.keyboard.type(post.body, { delay: 10 });
    await sleep(1000);
  } else {
    console.log('⚠️  Could not find body input.');
  }

  // Take screenshot before submitting
  await page.screenshot({ path: `/tmp/reddit-${post.subreddit}-ready.png` });
  console.log(`Ready to submit screenshot: /tmp/reddit-${post.subreddit}-ready.png`);

  // Find and click submit button
  const submitSelectors = [
    'button[type="submit"]:has-text("Post")',
    'button:has-text("Post")',
    '[data-testid="submit-button"]',
    'button.submit'
  ];

  let submitBtn = null;
  for (const sel of submitSelectors) {
    submitBtn = await page.$(sel);
    if (submitBtn) break;
  }

  if (submitBtn) {
    console.log('Clicking submit...');
    await submitBtn.click();
    await sleep(5000);

    const finalUrl = page.url();
    console.log(`✅ Posted! URL: ${finalUrl}`);
    await page.screenshot({ path: `/tmp/reddit-${post.subreddit}-done.png` });
    return { success: true, url: finalUrl };
  } else {
    console.log('⚠️  Could not find submit button.');
    return { success: false, error: 'Submit button not found' };
  }
}

async function main() {
  const results = [];
  let contextOptions = {
    headless: false,
    slowMo: 200,
    args: ['--no-first-run']
  };

  // Try to use Chrome user data if Chrome is NOT running
  let browser;
  let context;

  try {
    context = await chromium.launchPersistentContext(CHROME_USER_DATA, {
      ...contextOptions,
      channel: 'chrome',
    });
    console.log('✅ Using existing Chrome profile (session preserved)');
  } catch {
    console.log('⚠️  Chrome profile locked (Chrome is running). Using fresh browser instead.');
    browser = await chromium.launch({ headless: false, slowMo: 200 });
    context = await browser.newContext();

    if (WAIT_FOR_LOGIN) {
      const loginPage = await context.newPage();
      await loginPage.goto('https://www.reddit.com/login');
      console.log('\n🔐 Please log in to Reddit in the browser window...');
      console.log('Waiting up to 120 seconds...');

      // Wait for redirect away from login page
      await loginPage.waitForURL(url => !url.toString().includes('/login'), { timeout: 120000 });
      console.log('✅ Logged in!');
      await loginPage.close();
    }
  }

  const page = await context.newPage();

  for (const post of POSTS) {
    const result = await postToSubreddit(page, post);
    results.push({ subreddit: post.subreddit, ...result });

    if (results.length < POSTS.length) {
      console.log('\nWaiting 10 seconds before next post...');
      await sleep(10000);
    }
  }

  await context.close();
  if (browser) await browser.close();

  console.log('\n📊 Results:');
  results.forEach(r => {
    console.log(`r/${r.subreddit}: ${r.success ? '✅ ' + r.url : '❌ ' + r.error}`);
  });

  return results;
}

main().catch(console.error);
