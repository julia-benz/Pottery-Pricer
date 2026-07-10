'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<{type: string, text: string} | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=/dashboard`,
        },
      })

      if (error) {
        console.error('signInWithOtp error:', error)
        setStatus({ type: 'error', text: error.message || 'Something went wrong sending your link. Please try again.' })
      } else {
        setStatus({ type: 'success', text: 'Check your email — we sent you a sign-in link. It expires in an hour.' })
      }
    } catch (err) {
      console.error('signInWithOtp threw:', err)
      setStatus({ type: 'error', text: 'Could not reach the server. Check your connection and try again.' })
    } finally {
      setSubmitting(false)
    }
  }

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
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/calculator" className="nav-link">Calculator</Link>
          </div>
        </div>
      </nav>

      <main className="auth-section">
        <div className="wrap">
          <div className="auth-card">
            <span className="eyebrow">Sign in / Sign up</span>
            <h1>Welcome to the <em>studio</em></h1>
            <p className="auth-sub">Enter your email and we&apos;ll send you a one-time sign-in link. No password to remember.</p>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" required placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="submit-row">
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send me a sign-in link'}
                </button>
              </div>
            </form>

            {status && (
              <div className={`form-msg ${status.type === 'success' ? 'form-msg-success' : 'form-msg-error'}`}>
                {status.text}
              </div>
            )}

            <p className="auth-foot">New here? The same link creates your account — free, no card required.</p>
          </div>
        </div>
      </main>
    </>
  )
}
