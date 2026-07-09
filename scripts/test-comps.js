// ============================================================
// scripts/test-comps.js
//
// Quick test of the Etsy comps data — no OAuth needed, just the
// API key. Run from the project root:
//
//   node scripts/test-comps.js "handmade ceramic mug"
//
// Prints how many listings matched, price statistics, and a
// sample of listings so you can judge comp quality.
// ============================================================

const fs = require('fs')
const path = require('path')

// --- Load ETSY_API_KEY from .env.local (no dotenv dependency) ---
function loadEnvKey(name) {
  if (process.env[name]) return process.env[name]
  try {
    const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8')
    for (const line of envFile.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && m[1] === name) return m[2].replace(/^["']|["']$/g, '')
    }
  } catch { /* no .env.local */ }
  return null
}

const API_KEY = loadEnvKey('ETSY_API_KEY')
const SHARED_SECRET = loadEnvKey('ETSY_SHARED_SECRET')

if (!API_KEY) {
  console.error('Could not find ETSY_API_KEY in environment or .env.local')
  process.exit(1)
}
if (!SHARED_SECRET) {
  console.error('Could not find ETSY_SHARED_SECRET in environment or .env.local')
  console.error('As of Feb 2026, Etsy requires x-api-key as "keystring:shared_secret" — get the shared secret from your app in the Etsy developer dashboard.')
  process.exit(1)
}

// Feb 2026 Etsy policy change: x-api-key must be "keystring:shared_secret"
const AUTH_HEADER = `${API_KEY}:${SHARED_SECRET}`

const keywords = process.argv[2]
if (!keywords) {
  console.error('Usage: node scripts/test-comps.js "handmade ceramic mug"')
  process.exit(1)
}

function toPrice(p) {
  // Etsy returns money as { amount, divisor, currency_code }
  return p && p.divisor ? p.amount / p.divisor : null
}

function stats(prices) {
  const s = [...prices].sort((a, b) => a - b)
  const q = (f) => s[Math.min(s.length - 1, Math.floor(f * (s.length - 1)))]
  return {
    count: s.length,
    min: s[0],
    p25: q(0.25),
    median: q(0.5),
    p75: q(0.75),
    max: s[s.length - 1],
    mean: s.reduce((a, b) => a + b, 0) / s.length,
  }
}

const money = (n) => '$' + n.toFixed(2)

async function main() {
  const params = new URLSearchParams({
    keywords,
    limit: '100',           // max per page
    sort_on: 'score',       // relevancy — what a shopper would see
  })

  const url = `https://openapi.etsy.com/v3/application/listings/active?${params}`
  console.log(`\nSearching Etsy for: "${keywords}"\n`)

  const res = await fetch(url, { headers: { 'x-api-key': AUTH_HEADER } })

  if (!res.ok) {
    const body = await res.text()
    console.error(`Etsy API error ${res.status}: ${body}`)
    if (res.status === 403) {
      console.error('\n403 usually means the key is not yet activated for commercial access, or the app is still in a pending state in the Etsy developer dashboard.')
    }
    process.exit(1)
  }

  const data = await res.json()
  const listings = data.results || []
  const usd = listings.filter((l) => l.price?.currency_code === 'USD')
  const prices = usd.map((l) => toPrice(l.price)).filter((p) => p !== null)

  console.log(`Total matches on Etsy : ${data.count?.toLocaleString?.() ?? data.count}`)
  console.log(`Fetched this page     : ${listings.length} (${usd.length} in USD)\n`)

  if (prices.length === 0) {
    console.log('No USD-priced listings in this page — try different keywords.')
    return
  }

  const st = stats(prices)
  console.log('--- Price statistics (USD, this page) ---')
  console.log(`min     ${money(st.min)}`)
  console.log(`25th    ${money(st.p25)}`)
  console.log(`median  ${money(st.median)}   <-- the headline comp number`)
  console.log(`75th    ${money(st.p75)}`)
  console.log(`max     ${money(st.max)}`)
  console.log(`mean    ${money(st.mean)}\n`)

  console.log('--- Sample listings (top 10 by relevancy) ---')
  for (const l of usd.slice(0, 10)) {
    const p = toPrice(l.price)
    console.log(`${money(p).padStart(9)}  ${l.title.slice(0, 70)}`)
  }

  console.log('\n--- Raw shape of one listing (for schema mapping) ---')
  const sample = usd[0]
  console.log(JSON.stringify({
    listing_id: sample.listing_id,
    title: sample.title,
    price: sample.price,
    quantity: sample.quantity,
    num_favorers: sample.num_favorers,
    taxonomy_id: sample.taxonomy_id,
    tags: sample.tags?.slice(0, 5),
    url: sample.url,
  }, null, 2))
}

main().catch((err) => {
  console.error('Request failed:', err.message)
  process.exit(1)
})
