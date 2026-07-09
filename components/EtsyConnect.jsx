// ============================================================
// components/EtsyConnect.jsx
//
// Drop this anywhere in the dashboard or onboarding flow.
// Shows one of three states:
//   1. Not connected  — "Connect your Etsy shop" button
//   2. Connected      — shop name + green checkmark + disconnect link
//   3. Error          — friendly message with retry
// ============================================================

'use client'

import { useEffect, useState } from 'react'
import { createClient }        from '@/lib/supabase'

export default function EtsyConnect() {
  const [shopName,    setShopName]    = useState(null)
  const [connected,   setConnected]   = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [statusMsg,   setStatusMsg]   = useState(null)

  const supabase = createClient()

  // ── Check current connection state on mount ─────────────────
  useEffect(() => {
    async function checkConnection() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('etsy_connected_at, shop_name')
        .eq('id', user.id)
        .single()

      if (profile?.etsy_connected_at) {
        setConnected(true)
        setShopName(profile.shop_name)
      }
      setLoading(false)
    }

    checkConnection()

    // Check for redirect status from the callback route
    const params = new URLSearchParams(window.location.search)
    const etsyStatus = params.get('etsy')
    if (etsyStatus === 'connected') {
      setStatusMsg({ type: 'success', text: 'Etsy shop connected successfully.' })
      // Clean up the query param without a page reload
      window.history.replaceState({}, '', window.location.pathname)
    } else if (etsyStatus === 'error') {
      const reason = params.get('reason') ?? 'unknown'
      setStatusMsg({ type: 'error', text: `Something went wrong connecting your shop (${reason}). Please try again.` })
      window.history.replaceState({}, '', window.location.pathname)
    } else if (etsyStatus === 'denied') {
      setStatusMsg({ type: 'info', text: 'Connection cancelled. You can connect your shop any time from settings.' })
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // ── Disconnect ─────────────────────────────────────────────
  async function handleDisconnect() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('etsy_tokens').delete().eq('user_id', user.id)
    await supabase.from('profiles').update({
      etsy_user_id:      null,
      etsy_shop_id:      null,
      shop_name:         null,
      etsy_connected_at: null,
    }).eq('id', user.id)

    setConnected(false)
    setShopName(null)
    setStatusMsg({ type: 'info', text: 'Etsy shop disconnected.' })
  }

  if (loading) return null

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <EtsyIcon />
        <span style={styles.label}>Etsy shop</span>
      </div>

      {statusMsg && (
        <div style={{ ...styles.banner, ...styles.bannerTypes[statusMsg.type] }}>
          {statusMsg.text}
        </div>
      )}

      {connected ? (
        <div style={styles.connectedRow}>
          <span style={styles.checkmark}>✓</span>
          <span style={styles.shopName}>
            {shopName ?? 'Shop connected'}
          </span>
          <button
            onClick={handleDisconnect}
            style={styles.disconnectBtn}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          <p style={styles.description}>
            Connect your Etsy shop to see market comparisons, publish
            listings directly, and let Pottery Pricer learn what's
            working in your shop over time.
          </p>
          <a href="/api/etsy/connect" style={styles.connectBtn}>
            Connect your Etsy shop
          </a>
          <p style={styles.note}>
            You'll be taken to Etsy to approve access. We'll only
            read your listings and sales, and publish on your behalf
            when you ask us to. We never post without your confirmation.
          </p>
        </div>
      )}
    </div>
  )
}

// ── Etsy wordmark icon ────────────────────────────────────────
function EtsyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="12" fill="#F1641E"/>
      <path
        d="M7 7h6M7 12h5M7 17h6"
        stroke="white" strokeWidth="1.8" strokeLinecap="round"
      />
    </svg>
  )
}

// ── Styles ────────────────────────────────────────────────────
const styles = {
  wrapper: {
    border:       '1px solid rgba(43,36,32,0.14)',
    borderRadius: '4px',
    padding:      '24px',
    maxWidth:     '480px',
    background:   '#F7F1E6',
  },
  header: {
    display:      'flex',
    alignItems:   'center',
    gap:          '10px',
    marginBottom: '16px',
  },
  label: {
    fontFamily:   "'Fraunces', serif",
    fontSize:     '18px',
    fontWeight:   500,
    color:        '#2B2420',
  },
  description: {
    fontSize:     '15px',
    color:        '#4a4038',
    lineHeight:   1.65,
    marginBottom: '18px',
  },
  connectBtn: {
    display:        'inline-block',
    fontFamily:     "'Karla', sans-serif",
    fontWeight:     700,
    fontSize:       '15px',
    background:     '#B5562D',
    color:          '#F7F1E6',
    padding:        '12px 22px',
    borderRadius:   '3px',
    textDecoration: 'none',
    transition:     'background .15s',
  },
  note: {
    marginTop:  '14px',
    fontSize:   '13px',
    color:      '#8C7E6A',
    lineHeight: 1.6,
  },
  connectedRow: {
    display:    'flex',
    alignItems: 'center',
    gap:        '12px',
  },
  checkmark: {
    color:      '#3D6B5C',
    fontSize:   '18px',
    fontWeight: 700,
  },
  shopName: {
    fontFamily: "'Fraunces', serif",
    fontSize:   '16px',
    color:      '#2B2420',
    flex:       1,
  },
  disconnectBtn: {
    background:  'none',
    border:      'none',
    cursor:      'pointer',
    fontSize:    '13px',
    color:       '#8C7E6A',
    fontFamily:  "'JetBrains Mono', monospace",
    padding:     '4px 0',
    borderBottom:'1px solid #8C7E6A',
  },
  banner: {
    fontSize:     '14px',
    padding:      '10px 14px',
    borderRadius: '3px',
    marginBottom: '16px',
    lineHeight:   1.5,
  },
  bannerTypes: {
    success: { background: '#edf7f0', color: '#3D6B5C', border: '1px solid #c0dfc8' },
    error:   { background: '#fdf2ee', color: '#8C3F1F', border: '1px solid #f0c9b8' },
    info:    { background: '#f5f0e8', color: '#4a4038', border: '1px solid #d4c9b8' },
  },
}
