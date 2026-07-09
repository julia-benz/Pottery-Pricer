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
  const [hours, setHours] = useState('1.5')
  const [rate, setRate] = useState('25')
  const [overhead, setOverhead] = useState('2.00')
  const [lossRate, setLossRate] = useState('10')
  const [markup, setMarkup] = useState('2.5')

  const num = (s: string) => {
    const n = parseFloat(s)
    return isNaN(n) || n < 0 ? 0 : n
  }

  const m = num(materials)
  const laborCost = num(hours) * num(rate)
  const oh = num(overhead)
  const loss = Math.min(num(lossRate), 90) / 100
  const mk = num(markup)

  const subtotal = m + laborCost + oh
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
          <div style={{display:'flex',alignItems:'center',gap:'24px'}}>
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/pricing-guide" className="nav-link">How to Price Pottery</Link>
            <Link href="/calculator" className="nav-link">Calculator</Link>
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
                  <div className="full">
                    <label htmlFor="materials">Clay, glaze &amp; supplies</label>
                    <div className="input-wrap">
                      <span className="prefix">$</span>
                      <input id="materials" className="has-prefix" type="number" min="0" step="0.25" inputMode="decimal"
                        value={materials} onChange={e => setMaterials(e.target.value)} />
                    </div>
                    <div className="field-hint">Tip: divide your clay bag price by the number of pieces you get from it, then add glaze and any add-ons like cork lids or handles.</div>
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
                    <div className="field-hint">What your skill is worth — not minimum wage.</div>
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
                <div className="calc-group-title">Markup <span className="hint">2–3x covers fees, mishaps &amp; real profit</span></div>
                <div className="markup-row">
                  <input type="range" min="2" max="3" step="0.1" value={markup}
                    onChange={e => setMarkup(e.target.value)}
                    aria-label="Markup multiplier" />
                  <span className="markup-value">{Number(markup).toFixed(1)}×</span>
                </div>
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
                <div className="breakdown-row"><span>Materials</span><span className="val">{money(m)}</span></div>
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

              <div className="result-foot">
                Fees estimated for US Etsy sellers: $0.20 listing + 6.5% transaction + 3% + $0.25 payment processing. Shipping charges also incur fees — price accordingly if you offer free shipping.
              </div>
            </aside>

          </div>
        </div>
      </main>

      <footer>
        <div className="wrap">
          <span>© 2026 Pottery Pricer</span>
          <span>The term &apos;Etsy&apos; is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.</span>
        </div>
      </footer>
    </>
  )
}
