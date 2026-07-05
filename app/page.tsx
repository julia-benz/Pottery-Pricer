'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', shop: '' })
  const [status, setStatus] = useState<{type: string, text: string} | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('waitlist')
      .insert([{
        name: formData.name.trim(),
        email: formData.email.trim(),
        shop: formData.shop.trim() || null
      }])

    setSubmitting(false)

    if (error) {
      if (error.code === '23505') {
        setStatus({ type: 'success', text: "You're already on the list — we'll be in touch." })
      } else {
        setStatus({ type: 'error', text: 'Something went wrong. Please try again in a moment.' })
      }
    } else {
      setStatus({ type: 'success', text: "You're on the list — we'll be in touch as early access opens." })
      setFormData({ name: '', email: '', shop: '' })
    }
  }

  return (
    <>
      <nav>
        <div className="wrap">
          <div className="logo">
            <svg className="logo-mark" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="12" stroke="#2B2420" strokeWidth="1.4"/>
              <circle cx="13" cy="13" r="7.5" stroke="#B5562D" strokeWidth="1.4"/>
              <circle cx="13" cy="13" r="3" fill="#3D6B5C"/>
            </svg>
            Pottery Pricer
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'24px'}}>
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/pricing-guide" className="nav-link">How to Price Pottery</Link>
            <a className="nav-cta" href="#waitlist">Join waitlist</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">For ceramic artists selling on Etsy</span>
            <h1>Get what you deserve: Price your Pottery like a <em>Pro</em></h1>
            <p className="sub">Clay, kiln share, labor, and glaze — rolled into a real number. Benchmarked against what's actually selling on Etsy right now. Listed in your voice, automatically.</p>
            <div className="hero-ctas">
              <a className="btn-primary" href="#waitlist">Join the waitlist</a>
            </div>
            <p className="hero-note">Built by a potter, for potters. Currently in early access testing.</p>
            <div className="ring-wrap">
              <svg viewBox="-70 -40 460 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Target diagram">
                <circle cx="160" cy="160" r="148" fill="none" stroke="#8C7E6A" strokeWidth="1" strokeDasharray="2 4" opacity="0.5"/>
                <circle cx="160" cy="160" r="130" fill="none" stroke="#2B2420" strokeWidth="14"/>
                <circle cx="160" cy="160" r="106" fill="none" stroke="#8C7E6A" strokeWidth="14"/>
                <circle cx="160" cy="160" r="82" fill="none" stroke="#B5562D" strokeWidth="14"/>
                <circle cx="160" cy="160" r="58" fill="none" stroke="#3D6B5C" strokeWidth="14"/>
                <circle cx="160" cy="160" r="34" fill="#EDE3D3" stroke="#2B2420" strokeWidth="1.4"/>
                <text x="160" y="156" textAnchor="middle" className="ring-label" fill="#2B2420" fontWeight="500">your</text>
                <text x="160" y="170" textAnchor="middle" className="ring-label" fill="#2B2420" fontWeight="500">price</text>
                <line x1="160" y1="23" x2="160" y2="0" stroke="#2B2420" strokeWidth="1"/>
                <text x="160" y="-8" textAnchor="middle" className="ring-label" fill="#2B2420">Market Prices</text>
                <line x1="273" y1="160" x2="305" y2="160" stroke="#8C7E6A" strokeWidth="1"/>
                <text x="310" y="164" textAnchor="start" className="ring-label" fill="#8C7E6A">Time</text>
                <line x1="160" y1="249" x2="160" y2="320" stroke="#B5562D" strokeWidth="1"/>
                <text x="160" y="335" textAnchor="middle" className="ring-label" fill="#8C3F1F">Materials</text>
                <line x1="95" y1="160" x2="15" y2="160" stroke="#3D6B5C" strokeWidth="1"/>
                <text x="10" y="164" textAnchor="end" className="ring-label" fill="#3D6B5C">Overhead</text>
              </svg>
            </div>
          </div>
        </div>
      </header>

      <section id="how-it-works">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>From greenware to a listing that sells</h2>
          </div>
          <div className="steps">
            <div className="step">
              <span className="step-num">01</span>
              <h3>Log the piece</h3>
              <p>Clay body, dimensions, glaze, firing cone, and time at the wheel. Takes about as long as wedging a ball of clay.</p>
            </div>
            <div className="step">
              <span className="step-num">02</span>
              <h3>See the real cost</h3>
              <p>Materials, your kiln's per-piece share, and labor roll into one number — checked against live comps from similar pieces selling on Etsy.</p>
            </div>
            <div className="step">
              <span className="step-num">03</span>
              <h3>Generate the listing</h3>
              <p>Title, tags, and description written from your piece details and photos — ready to paste into Etsy, in a voice that sounds like you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">What's inside</span>
            <h2>Built for ceramics — not crafts in general</h2>
            <p style={{marginTop:'14px',fontSize:'15.5px'}}>Most pricing tools treat a mug the same as a knitted scarf. This one knows the difference between a bisque firing and a glaze firing.</p>
          </div>
          <div className="features-list">
            <div className="feature">
              <h4>Ceramics-specific cost model</h4>
              <p>Clay body, kiln share, firing cone, and your labor rate — the inputs that actually drive cost for thrown and handbuilt work.</p>
            </div>
            <div className="feature">
              <h4>Live Etsy market comps</h4>
              <p>See what similar pieces are actually priced and selling at, pulled straight from Etsy — not a guess or a flat percentage markup.</p>
            </div>
            <div className="feature">
              <h4>AI-generated listing copy</h4>
              <p>Titles, tags, and descriptions drafted from your piece data and photos, so you spend less time writing and more time at the wheel.</p>
            </div>
            <div className="feature">
              <h4>A record of every piece</h4>
              <p>Track each piece from greenware through firing to sold, so you know what's actually working over a season, not just per piece.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="form-section" id="waitlist">
        <div className="wrap">
          <div className="form-grid">
            <div className="form-copy">
              <span className="eyebrow">Early access</span>
              <h2 style={{marginTop:'10px'}}>Get early access</h2>
              <p>We're testing with a small group of working potters before opening up. Join the list and we'll reach out as spots open.</p>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" required autoComplete="name"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}/>
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" required autoComplete="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}/>
                </div>
                <div className="field">
                  <label htmlFor="shop">What do you sell on Etsy? (optional)</label>
                  <input type="text" id="shop" placeholder="e.g. wheel-thrown mugs and bowls"
                    value={formData.shop}
                    onChange={e => setFormData({...formData, shop: e.target.value})}/>
                </div>
                <div className="submit-row">
                  <button className="btn-primary" type="submit" disabled={submitting}>
                    {submitting ? 'Joining...' : 'Get early access'}
                  </button>
                  <span className="form-foot">No spam. One email when we open up.</span>
                </div>
                {status && (
                  <div className={status.type === 'error' ? 'form-msg form-msg-error' : 'form-msg form-msg-success'}>
                    {status.text}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap" style={{flexDirection:'column',alignItems:'flex-start',gap:'10px'}}>
          <div style={{display:'flex',justifyContent:'space-between',width:'100%',flexWrap:'wrap',gap:'12px'}}>
            <span>Pottery Pricer — built by a working potter</span>
            <span>&copy; 2026</span>
          </div>
          <p style={{fontSize:'11.5px',color:'var(--grog)',maxWidth:'60ch',lineHeight:'1.5'}}>The term &quot;Etsy&quot; is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.</p>
        </div>
      </footer>
    </>
  )
}