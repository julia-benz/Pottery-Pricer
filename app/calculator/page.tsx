'use client'

import { useState } from 'react'
import Link from 'next/link'

// Etsy fee structure (US sellers)
const ETSY_LISTING_FEE = 0.20
const ETSY_TRANSACTION_PCT = 0.065
const ETSY_PROCESSING_PCT = 0.03
const ETSY_PROCESSING_FLAT = 0.25

function money(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export default function Calculator() {
  const [materials, setMaterials] = useState('4.50')
  const [otherMaterials, setOtherMaterials] = useState('')
  const [hours, setHours] = useState('1.5')
  const [rate, setRate] = useState('25')
  const [overhead, setOverhead] = useState('2.00')
  const [lossRate, setLossRate] = useState('10')
  const [markup, setMarkup] = useState('2')

  const num = (s: string) => {
    const n = parseFloat(s)
    return isNaN(n) || n < 0 ? 0 : n
  }

  const m = num(materials)
  const other = num(otherMaterials)
  const laborCost = num(hours) * num(rate)
  const oh = num(overhead)
  const loss = Math.min(num(lossRate), 90) / 100
  const mk = num(markup)

  const subtotal = m + other + laborCost + oh
  // Spread the cost of failed pieces across the ones that survive
  const baseCost = loss > 0 ? subtotal / (1 - loss) : subtotal
  const lossAllowance = baseCost - subtotal

  const suggested = baseCost * mk
  const rangeLow = baseCost * 2
  const rangeHigh = baseCost * 3

  const etsyFees =
    suggested > 0
      ? ETSY_LISTING_FEE +
        suggested * ETSY_TRANSACTION_PCT +
        suggested * ETSY_PROCESSING_PCT +
        ETSY_PROCESSING_FLAT
      : 0
  const youKeep = suggested - etsyFees
  const profit = youKeep - baseCost
  const underwater = suggested > 0 && profit < 0

  const hasInput = subtotal > 0

  return (
    <>
      <nav>
        <div className="wrap">
          <Link href="/" className="logo">
            <svg className="logo-mark" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="12" stroke="#2B2420" strokeWidth="1.4"/>
              <circle cx="13" cy="13" r="7.5" stroke="#B5562D" strokeWidth="1.4"/>
              <circle cx="13" cy="13" r="3" fill="#3D6B5C"/>
            </svg>
            Pottery Pricer
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link hide-sm">Home</Link>
            <Link href="/pricing-guide" className="nav-link hide-sm">How to Price Pottery</Link>
            <Link href="/login" className="nav-link">Log in</Link>
            <a className="nav-cta" href="/#waitlist">Join waitlist</a>
          </div>
        </div>
      </nav>

      <header className="calc-hero">
        <div className="wrap">
          <span className="eyebrow">Pottery Pricing Calculator</span>
          <h1>What should this <em>piece</em> sell for?</h1>
          <p className="sub">Enter what one piece actually costs you — materials, time, overhead, and kiln losses — and get a suggested Etsy price that pays you fairly after fees.</p>
        </div>
      </header>

      <main className="calc-section">
        <div className="wrap">
          <div className="calc-grid">

            <div className="calc-form">
              <div className="calc-group">
                <div className="calc-group-title">Materials <span className="hint">per piece</span></div>
                <div className="calc-fields">
                  <div>
                    <label htmlFor="materials">Clay &amp; glaze</label>
                    <div className="input-wrap">
                      <span className="prefix">$</span>
                      <input id="materials" className="has-prefix" type="number" min="0" step="0.25" inputMode="decimal"
                        value={materials} onChange={e => setMaterials(e.target.value)} />
                    </div>
                    <div className="field-hint">Divide your clay bag price by pieces per bag, plus glaze used.</div>
                  </div>
                  <div>
                    <label htmlFor="otherMaterials">Other materials <span style={{color:'var(--grog)',fontWeight:400}}>(optional)</span></label>
                    <div className="input-wrap">
                      <span className="prefix">$</span>
                      <input id="otherMaterials" className="has-prefix" type="number" min="0" step="0.25" inputMode="decimal"
                        placeholder="0.00" value={otherMaterials} onChange={e => setOtherMaterials(e.target.value)} />
                    </div>
                    <div className="field-hint">Cork lids, handles, decals, packaging — anything extra.</div>
                  </div>
                </div>
              </div>

              <div className="calc-group">
                <div className="calc-group-title">Your time</div>
                <div className="calc-fields">
                  <div>
                    <label htmlFor="hours">Hours on this piece</label>
                    <div className="input-wrap">
                      <input id="hours" className="has-suffix" type="number" min="0" step="0.25" inputMode="decimal"
                        value={hours} onChange={e => setHours(e.target.value)} />
                      <span className="suffix">hrs</span>
                    </div>
                    <div className="field-hint">Throwing, trimming, glazing, loading — all of it.</div>
                  </div>
                  <div>
                    <label htmlFor="rate">Your hourly rate</label>
                    <div className="input-wrap">
                      <span className="prefix">$</span>
                      <input id="rate" className="has-prefix has-suffix" type="number" min="0" step="1" inputMode="decimal"
                        value={rate} onChange={e => setRate(e.target.value)} />
                      <span className="suffix">/hr</span>
                    </div>
                    <div className="field-hint">Most potters start at $20–30/hr. Experienced makers charge more — never minimum wage.</div>
                  </div>
                </div>
              </div>

              <div className="calc-group">
                <div className="calc-group-title">Overhead &amp; losses</div>
                <div className="calc-fields">
                  <div>
                    <label htmlFor="overhead">Overhead per piece</label>
                    <div className="input-wrap">
                      <span className="prefix">$</span>
                      <input id="overhead" className="has-prefix" type="number" min="0" step="0.25" inputMode="decimal"
                        value={overhead} onChange={e => setOverhead(e.target.value)} />
                    </div>
                    <div className="field-hint">Kiln electricity or firing fees, studio rent, tools — prorated.</div>
                  </div>
                  <div>
                    <label htmlFor="loss">Loss &amp; breakage rate</label>
                    <div className="input-wrap">
                      <input id="loss" className="has-suffix" type="number" min="0" max="90" step="1" inputMode="decimal"
                        value={lossRate} onChange={e => setLossRate(e.target.value)} />
                      <span className="suffix">%</span>
                    </div>
                    <div className="field-hint">Pieces that crack, warp, or fail. 10% is typical.</div>
                  </div>
                </div>
              </div>

              <div className="calc-group">
                <div className="calc-group-title">Markup</div>
                <div className="markup-row">
                  <input type="range" min="1.5" max="3.5" step="0.1" value={markup}
                    onChange={e => setMarkup(e.target.value)}
                    aria-label="Markup multiplier" />
                  <span className="markup-value">{Number(markup).toFixed(1)}×</span>
                </div>
                <div className="field-hint" style={{marginTop:'10px'}}>Just starting out? 2× is a safe floor. Established work with a following supports 2.5–3×. Below 2×, fees and mishaps eat your margin fast.</div>
              </div>
            </div>

            <aside className="result-panel" aria-live="polite">
              <div className="result-label">Suggested price</div>
              <div className="result-price">{hasInput ? money(suggested) : '$—'}</div>
              {hasInput && (
                <div className="result-range">Fair range: {money(rangeLow)} – {money(rangeHigh)}</div>
              )}

              <hr className="result-divider" />

              <div className="breakdown">
                <div className="breakdown-row"><span>Clay &amp; glaze</span><span className="val">{money(m)}</span></div>
                {other > 0 && (
                  <div className="breakdown-row"><span>Other materials</span><span className="val">{money(other)}</span></div>
                )}
                <div className="breakdown-row"><span>Labor ({num(hours) || 0} hrs × {money(num(rate))})</span><span className="val">{money(laborCost)}</span></div>
                <div className="breakdown-row"><span>Overhead</span><span className="val">{money(oh)}</span></div>
                <div className="breakdown-row"><span>Loss allowance ({Math.round(loss * 100)}%)</span><span className="val">{money(lossAllowance)}</span></div>
                <div className="breakdown-row total"><span>True cost per piece</span><span className="val">{money(baseCost)}</span></div>
              </div>

              {hasInput && (
                <>
                  <hr className="result-divider" />
                  <div className="breakdown">
                    <div className="breakdown-row"><span>Etsy fees at this price</span><span className="val">−{money(etsyFees)}</span></div>
                    <div className="breakdown-row"><span>You keep</span><span className="val">{money(youKeep)}</span></div>
                    <div className="breakdown-row profit"><span>Profit after costs &amp; fees</span><span className="val">{money(profit)}</span></div>
                  </div>
                </>
              )}

              {underwater && (
                <div className="result-warning">
                  At this markup, Etsy fees eat your margin — you&apos;d earn less than your costs. Raise the markup or revisit your inputs.
                </div>
              )}

              <a href="#upgrade" className="locked-row">
                <span className="locked-badge">Pro</span>
                <span>What do pieces like yours <em>actually</em> sell for on Etsy? See real market comps →</span>
              </a>

              <div className="result-foot">
                Fees estimated for US Etsy sellers: $0.20 listing + 6.5% transaction + 3% + $0.25 payment processing. Shipping charges also incur fees — price accordingly if you offer free shipping.
              </div>
            </aside>

          </div>

          <section id="upgrade" className="upsell">
            <span className="eyebrow">Don&apos;t lose this math</span>
            <h2>Price it once. Track it forever.</h2>
            <div className="plan-grid">
              <div className="plan-card">
                <div className="plan-name">Free account</div>
                <ul className="plan-list">
                  <li>Save every calculation — build a price list for your whole line</li>
                  <li>Update prices as clay and firing costs change</li>
                </ul>
                <Link href="/login" className="btn-primary plan-cta">Create free account</Link>
              </div>
              <div className="plan-card plan-card-pro">
                <div className="plan-name">Pro <span className="plan-soon">coming soon</span></div>
                <ul className="plan-list">
                  <li><strong>Real Etsy market comps</strong> — the median and range for pieces like yours, refreshed daily</li>
                  <li><strong>Sales tracking</strong> — see what sold, for how much, and which pieces actually earn</li>
                  <li><strong>Your studio, saved</strong> — preset your clays, glazes, monthly studio cost, and firing fees so every calculation starts filled in</li>
                  <li><strong>AI listing copy</strong> — titles, tags, and descriptions written from your piece details</li>
                </ul>
                <a href="/#waitlist" className="btn-primary plan-cta plan-cta-pro">Join the waitlist</a>
              </div>
            </div>
          </section>

        </div>
      </main>

      <footer>
        <div className="wrap">
          <span>Pottery Pricer — built by a working potter</span>
          <span>&copy; 2026</span>
        </div>
      </footer>
    </>
  )
}
