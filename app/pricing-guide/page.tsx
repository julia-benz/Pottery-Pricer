import Link from 'next/link'

export const metadata = {
  title: 'How to Price Handmade Pottery | Pricing Guide for Ceramicists',
  description: 'A practical guide to pricing handmade pottery — materials, time, kiln costs, and markup — based on real conversations with working ceramicists.',
}

export default function PricingGuide() {
  return (
    <>
      <nav>
        <div className="wrap">
          <Link className="logo" href="/">
            <svg className="logo-mark" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="12" stroke="#2B2420" strokeWidth="1.4"/>
              <circle cx="13" cy="13" r="7.5" stroke="#B5562D" strokeWidth="1.4"/>
              <circle cx="13" cy="13" r="3" fill="#3D6B5C"/>
            </svg>
            Pottery Pricer
          </Link>
          <div style={{display:'flex',alignItems:'center',gap:'24px'}}>
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/calculator" className="nav-link">Calculator</Link>
            <Link href="/#waitlist" className="nav-cta">Join waitlist</Link>
          </div>
        </div>
      </nav>

      <header className="article-hero">
        <div className="wrap">
          <span className="eyebrow">Pricing Guide for Ceramicists</span>
          <h1>How to Price <em>Handmade Pottery</em></h1>
          <p className="sub">A practical guide to pricing handmade pottery — materials, time, kiln costs, and markup — based on real conversations with working ceramicists.</p>
        </div>
      </header>

      <main className="article-body">
        <div className="wrap">

          <h2>How Should I Price My <em>Handmade Pottery</em>?</h2>
          <p>Most experienced ceramicists price their work using a simple formula:</p>

          <div className="formula-block">
            <div className="label">The core formula</div>
            <div className="line">(Materials <span className="op">+</span> Labor <span className="op">+</span> Overhead) <span className="op">×</span> Markup <span className="op">=</span> Price</div>
          </div>

          <p>Many ceramicists told us they started by guessing, copying competitor prices, or simply charging &quot;what felt right&quot; — and only built a real formula after realizing they were undercharging for months or years.</p>

          <p>Here&apos;s the catch: even when ceramicists do try to calculate it properly, it&apos;s easy to leave something out. Materials and time are easy to remember — but overhead, breakage, and fees quietly eat into margins that look fine on paper. It often takes months or even years of trial and error (and a few underpriced seasons) for ceramicists to find their real sweet spot.</p>

          <p className="callout">Instead of learning this over time and letting your unique work sit on a shelf or in someone&apos;s cart, Pottery Pricer pulls together current market prices and your cost factors so you can land on a fair, sustainable price in minutes instead of years.</p>

          <h2>The Four Costs Every Ceramicist Should <em>Factor In</em></h2>

          <div className="cost-grid">
            <div className="cost-card">
              <span className="cost-num">01</span>
              <div className="cost-title">Materials</div>
              <div className="cost-body">Clay, glaze, underglaze, kiln shelf wear.</div>
            </div>
            <div className="cost-card">
              <span className="cost-num">02</span>
              <div className="cost-title">Time</div>
              <div className="cost-body">Wedging, throwing/handbuilding, trimming, glazing, loading/unloading the kiln.</div>
            </div>
            <div className="cost-card">
              <span className="cost-num">03</span>
              <div className="cost-title">Kiln &amp; studio overhead</div>
              <div className="cost-body">Electricity, kiln maintenance, studio rent, tools.</div>
            </div>
            <div className="cost-card">
              <span className="cost-num">04</span>
              <div className="cost-title">Loss &amp; breakage</div>
              <div className="cost-body">Pieces that crack, warp, explode in the kiln, or fail glazing — the cost gets spread across the pieces that do sell.</div>
            </div>
            <div className="cost-card">
              <span className="cost-num">05</span>
              <div className="cost-title">Etsy &amp; platform fees</div>
              <div className="cost-body">Listing fees, transaction fees, payment processing — typically 8–10% combined.</div>
            </div>
          </div>

          <h2>What Ceramicists <em>Actually</em> Told Us</h2>
          <p>In conversations with working Etsy ceramicists across a range of shop sizes, a few patterns came up again and again:</p>
          <ul>
            <li>Many said pricing was one of the hardest parts of getting to consistent sales.</li>
            <li>Several admitted they raised prices significantly after realizing they&apos;d been underpricing for a long time.</li>
            <li>A common pricing approach: time × an hourly rate they&apos;d &quot;feel okay charging,&quot; plus materials, then rounding up.</li>
            <li>Few used a consistent formula — most adjusted by feel, competitor pricing, or guesswork.</li>
          </ul>

          <h2>A Simple <em>Starting Formula</em></h2>

          <div className="formula-block">
            <div className="label">Step by step</div>
            <div className="line" style={{fontSize:'17px',lineHeight:'2'}}>
              Materials cost<br/>
              <span className="op">+</span> (Hours worked × your target hourly rate)<br/>
              <span className="op">+</span> Overhead (kiln, studio, tools — prorated per piece)<br/>
              <span className="op">+</span> Loss/breakage (prorated cost of failed pieces, spread across successful ones)<br/>
              <span className="op">=</span> Base cost
            </div>
            <div className="line" style={{marginTop:'18px'}}>Base cost × 2 to 3 <span className="op">=</span> Suggested retail price</div>
            <div className="note">The 2–3x markup accounts for Etsy fees, shipping mishaps, breakage, and actual profit — not just covering costs.</div>
          </div>

          <h2>Common Pricing <em>Mistakes</em></h2>
          <ul>
            <li>Not counting your own time as a real cost.</li>
            <li>Forgetting kiln electricity or firing fees/studio overhead.</li>
            <li>Lowering prices too quickly if things don&apos;t sell.</li>
            <li>Undercutting your prices to &quot;break into the market quickly.&quot;</li>
            <li>Not accounting for pieces that crack, warp, or fail in the kiln.</li>
            <li>Not adjusting prices as material costs rise.</li>
          </ul>

          <div className="guide-cta">
            <h3>Skip the <em>Guesswork</em></h3>
            <p>You don&apos;t need to spend the next year underpricing your work to find the right number. Plug in your materials, time, and a few quick details, and Pottery Pricer does the math — breakage, overhead, and fees included — in minutes.</p>
            <Link href="/" className="btn-primary">Calculate your price in under 2 minutes</Link>
          </div>

          <div className="faq-section">
            <h2>Frequently Asked <em>Questions</em></h2>
            <div className="faq-item">
              <div className="faq-q">How much should I charge for a handmade mug?</div>
              <div className="faq-a">Most handmade mugs sell for $25–$45, depending on materials, complexity, and the ceramicist&apos;s experience level, but the right price depends on your specific time and cost inputs.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">What markup should ceramicists use?</div>
              <div className="faq-a">A common range is 2–3x your base cost (materials + labor + overhead) to account for platform fees, breakage, and profit margin.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">Do Etsy fees affect how I should price pottery?</div>
              <div className="faq-a">Yes — Etsy&apos;s listing, transaction, and payment processing fees typically total 8–10% of the sale price and should be built into your price, not absorbed after the sale.</div>
            </div>
          </div>

        </div>
      </main>

      <footer>
        <div className="wrap" style={{flexDirection:'column',alignItems:'flex-start',gap:'10px'}}>
          <div style={{display:'flex',justifyContent:'space-between',width:'100%',flexWrap:'wrap',gap:'12px'}}>
            <span>Pottery Pricer — built by a working ceramicist</span>
            <span>&copy; 2026</span>
          </div>
          <p style={{fontSize:'11.5px',color:'var(--grog)',maxWidth:'60ch',lineHeight:'1.5'}}>The term &quot;Etsy&quot; is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.</p>
        </div>
      </footer>
    </>
  )
}